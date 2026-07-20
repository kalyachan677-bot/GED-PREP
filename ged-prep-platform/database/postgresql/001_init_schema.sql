-- ============================================================================
-- GED Prep Platform — PostgreSQL Database Schema
-- Migration: 001_init_schema.sql
-- Description: Core relational tables for LMS, Quiz Engine, and Spaced Repetition
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- uuid-ossp not needed: gen_random_uuid() is built-in since PG 13

-- ---------------------------------------------------------------------------
-- 2. ENUM TYPES
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('student', 'admin', 'instructor');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deactivated');
CREATE TYPE subject_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE content_type AS ENUM ('text', 'video', 'mixed');
CREATE TYPE question_type AS ENUM (
    'multiple_choice',
    'multiple_select',
    'fill_blank',
    'drag_drop',
    'short_answer'
);
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'completed', 'timed_out', 'abandoned');
CREATE TYPE sr_status AS ENUM ('new', 'learning', 'review', 'mastered');

-- ---------------------------------------------------------------------------
-- 3. USERS
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    display_name    VARCHAR(100),
    role            user_role NOT NULL DEFAULT 'student',
    status          user_status NOT NULL DEFAULT 'active',
    avatar_url      TEXT,
    preferred_lang  VARCHAR(10) DEFAULT 'en',
    timezone        VARCHAR(50) DEFAULT 'UTC',
    target_ged_date DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_email ON users (email);

-- ---------------------------------------------------------------------------
-- 4. SUBJECTS (4 GED Subjects)
-- ---------------------------------------------------------------------------
CREATE TABLE subjects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(20) NOT NULL,          -- e.g. 'math', 'science', 'rla', 'ss'
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url    TEXT,
    color_hex   VARCHAR(7) DEFAULT '#3B82F6',
    sort_order  INT NOT NULL DEFAULT 0,
    status      subject_status NOT NULL DEFAULT 'draft',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_subjects_code UNIQUE (code)
);

CREATE INDEX idx_subjects_status ON subjects (status);
CREATE INDEX idx_subjects_sort ON subjects (sort_order);

-- ---------------------------------------------------------------------------
-- 5. MODULES (Group of Topics within a Subject)
-- ---------------------------------------------------------------------------
CREATE TABLE modules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id  UUID NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order  INT NOT NULL DEFAULT 0,
    status      subject_status NOT NULL DEFAULT 'draft',
    estimated_hours DECIMAL(4,1) DEFAULT 0.0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_modules_subject ON modules (subject_id);
CREATE INDEX idx_modules_sort ON modules (subject_id, sort_order);
CREATE INDEX idx_modules_status ON modules (status);

-- ---------------------------------------------------------------------------
-- 6. TOPICS (Group of Lessons within a Module)
-- ---------------------------------------------------------------------------
CREATE TABLE topics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id   UUID NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order  INT NOT NULL DEFAULT 0,
    status      subject_status NOT NULL DEFAULT 'draft',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topics_module ON topics (module_id);
CREATE INDEX idx_topics_sort ON topics (module_id, sort_order);
CREATE INDEX idx_topics_status ON topics (status);

-- ---------------------------------------------------------------------------
-- 7. LESSONS (Smallest unit of learning — references MongoDB for body_content)
-- ---------------------------------------------------------------------------
CREATE TABLE lessons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id        UUID NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,
    content_type    content_type NOT NULL DEFAULT 'text',
    mongo_content_id VARCHAR(24) NOT NULL,       -- MongoDB ObjectId (as hex string)
    video_url       TEXT,                         -- External video URL (YouTube, etc.)
    duration_minutes INT DEFAULT 0,
    sort_order      INT NOT NULL DEFAULT 0,
    is_prerequisite BOOLEAN NOT NULL DEFAULT FALSE,
    status          subject_status NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_lessons_slug UNIQUE (slug),
    CONSTRAINT chk_lessons_mongo_id CHECK (mongo_content_id ~ '^[a-fA-F0-9]{24}$')
);

CREATE INDEX idx_lessons_topic ON lessons (topic_id);
CREATE INDEX idx_lessons_sort ON lessons (topic_id, sort_order);
CREATE INDEX idx_lessons_mongo ON lessons (mongo_content_id);
CREATE INDEX idx_lessons_status ON lessons (status);
CREATE INDEX idx_lessons_content_type ON lessons (content_type);

-- ---------------------------------------------------------------------------
-- 8. QUESTIONS (Question bank — can belong to a Lesson or be standalone for exams)
-- ---------------------------------------------------------------------------
CREATE TABLE questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id       UUID REFERENCES lessons (id) ON DELETE SET NULL,
    subject_id      UUID NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    question_type   question_type NOT NULL,
    difficulty      difficulty_level NOT NULL DEFAULT 'medium',
    points          INT NOT NULL DEFAULT 1,
    explanation     TEXT,                        -- Explanation shown after answering
    hint_text       TEXT,                        -- Optional hint during quiz
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    source_tag      VARCHAR(100),                -- e.g. 'ged_official', 'custom'
    tags            TEXT[] DEFAULT '{}',         -- Array of searchable tags
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_lesson ON questions (lesson_id);
CREATE INDEX idx_questions_subject ON questions (subject_id);
CREATE INDEX idx_questions_type ON questions (question_type);
CREATE INDEX idx_questions_difficulty ON questions (difficulty);
CREATE INDEX idx_questions_active ON questions (is_active);
CREATE INDEX idx_questions_tags ON questions USING GIN (tags);

-- ---------------------------------------------------------------------------
-- 9. ANSWERS (Options for each question)
-- ---------------------------------------------------------------------------
CREATE TABLE answers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order  INT NOT NULL DEFAULT 0,
    explanation TEXT,                        -- Why this answer is/isn't correct
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_answers_correct_count CHECK (
        -- Enforced at application level for flexibility, but this ensures at least 1 correct
        -- We use a trigger instead (see below)
        sort_order >= 0
    )
);

CREATE INDEX idx_answers_question ON answers (question_id);
CREATE INDEX idx_answers_correct ON answers (question_id, is_correct);

-- ---------------------------------------------------------------------------
-- 10. QUIZ_ATTEMPTS (Records each quiz/exam attempt by a user)
-- ---------------------------------------------------------------------------
CREATE TABLE quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    lesson_id       UUID REFERENCES lessons (id) ON DELETE SET NULL,
    quiz_type       VARCHAR(30) NOT NULL DEFAULT 'lesson_quiz',
                    -- Values: 'lesson_quiz', 'module_review', 'subject_test', 'ged_ready_full', 'ged_ready_subject'
    status          attempt_status NOT NULL DEFAULT 'in_progress',
    total_questions INT NOT NULL DEFAULT 0,
    correct_count   INT NOT NULL DEFAULT 0,
    score_percent   DECIMAL(5,2) DEFAULT 0.0,
    time_spent_secs INT NOT NULL DEFAULT 0,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    flagged_question_ids UUID[] DEFAULT '{}',  -- Questions flagged for review during exam
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts (user_id);
CREATE INDEX idx_quiz_attempts_subject ON quiz_attempts (subject_id);
CREATE INDEX idx_quiz_attempts_lesson ON quiz_attempts (lesson_id);
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts (status);
CREATE INDEX idx_quiz_attempts_type ON quiz_attempts (quiz_type);
CREATE INDEX idx_quiz_attempts_user_subject ON quiz_attempts (user_id, subject_id);
CREATE INDEX idx_quiz_attempts_completed ON quiz_attempts (completed_at DESC);

-- ---------------------------------------------------------------------------
-- 11. QUIZ_ATTEMPT_ANSWERS (Individual answer records per attempt)
-- ---------------------------------------------------------------------------
CREATE TABLE quiz_attempt_answers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id      UUID NOT NULL REFERENCES quiz_attempts (id) ON DELETE CASCADE,
    question_id     UUID NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    selected_answer_ids UUID[] NOT NULL DEFAULT '{}',
    is_correct      BOOLEAN NOT NULL DEFAULT FALSE,
    is_flagged      BOOLEAN NOT NULL DEFAULT FALSE,
    time_spent_secs INT NOT NULL DEFAULT 0,
    answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_attempt_answer UNIQUE (attempt_id, question_id)
);

CREATE INDEX idx_qaa_attempt ON quiz_attempt_answers (attempt_id);
CREATE INDEX idx_qaa_question ON quiz_attempt_answers (question_id);
CREATE INDEX idx_qaa_correct ON quiz_attempt_answers (attempt_id, is_correct);

-- ---------------------------------------------------------------------------
-- 12. SPACED_REPETITION (Flashcard SRS tracking per user per question)
-- ---------------------------------------------------------------------------
CREATE TABLE spaced_repetition (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    question_id     UUID NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    sr_status       sr_status NOT NULL DEFAULT 'new',
    ease_factor     DECIMAL(4,2) NOT NULL DEFAULT 2.50,
    interval_days   INT NOT NULL DEFAULT 0,
    repetitions     INT NOT NULL DEFAULT 0,
    next_review_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_review_at  TIMESTAMPTZ,
    last_rating     SMALLINT,
                    -- SM-2 Ratings: 0=Again, 1=Hard, 2=Good, 3=Easy
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_sr_user_question UNIQUE (user_id, question_id),
    CONSTRAINT chk_sr_rating CHECK (last_rating IS NULL OR last_rating BETWEEN 0 AND 3),
    CONSTRAINT chk_sr_ease CHECK (ease_factor >= 1.30)
);

CREATE INDEX idx_sr_user ON spaced_repetition (user_id);
CREATE INDEX idx_sr_next_review ON spaced_repetition (next_review_at);
CREATE INDEX idx_sr_status ON spaced_repetition (user_id, sr_status);
CREATE INDEX idx_sr_due_cards ON spaced_repetition (next_review_at)
    WHERE next_review_at <= NOW();

-- ---------------------------------------------------------------------------
-- 13. LESSON_PROGRESS (Tracks per-user lesson completion)
-- ---------------------------------------------------------------------------
CREATE TABLE lesson_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    lesson_id       UUID NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    is_completed    BOOLEAN NOT NULL DEFAULT FALSE,
    completion_pct  INT NOT NULL DEFAULT 0 CHECK (completion_pct BETWEEN 0 AND 100),
    last_accessed   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_lesson_progress UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lp_user ON lesson_progress (user_id);
CREATE INDEX idx_lp_lesson ON lesson_progress (lesson_id);
CREATE INDEX idx_lp_completed ON lesson_progress (user_id, is_completed);

-- ---------------------------------------------------------------------------
-- TRIGGER: Ensure every question has at least one correct answer
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_ensure_correct_answer()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM answers WHERE question_id = NEW.question_id AND is_correct = TRUE
    ) THEN
        RAISE EXCEPTION 'Question % must have at least one correct answer', NEW.question_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ensure_correct_answer
    AFTER INSERT OR UPDATE ON answers
    FOR EACH ROW
    EXECUTE FUNCTION fn_ensure_correct_answer();

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-update updated_at timestamp
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_subjects_updated BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_topics_updated BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_questions_updated BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_sr_updated BEFORE UPDATE ON spaced_repetition FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-calculate quiz score on answer insert/update
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_recalc_quiz_score()
RETURNS TRIGGER AS $$
DECLARE
    v_total      INT;
    v_correct    INT;
    v_percent    DECIMAL(5,2);
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct = TRUE)
    INTO v_total, v_correct
    FROM quiz_attempt_answers
    WHERE attempt_id = NEW.attempt_id;

    v_percent := CASE
        WHEN v_total > 0 THEN ROUND((v_correct::DECIMAL / v_total::DECIMAL) * 100, 2)
        ELSE 0.0
    END;

    UPDATE quiz_attempts
    SET total_questions = v_total,
        correct_count   = v_correct,
        score_percent   = v_percent
    WHERE id = NEW.attempt_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalc_score
    AFTER INSERT OR UPDATE OF is_correct ON quiz_attempt_answers
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalc_quiz_score();

COMMIT;