-- ============================================================================
-- GED Prep Platform — PostgreSQL Migration 002
-- Migration: 002_ai_essay_readiness.sql
-- Description: Adds tables for AI Study Buddy, RLA Essay Auto-Grader,
--              and Readiness Score Dashboard
-- Depends on: 001_init_schema.sql
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. NEW ENUM TYPES
-- ---------------------------------------------------------------------------
CREATE TYPE ai_conversation_context AS ENUM (
    'quiz_explanation',      -- ถามเฉลยในหน้าผลสอบ
    'lesson_clarification',  -- ถามระหว่างเรียนบทเรียน
    'general_help',          -- ถามทั่วไป
    'essay_feedback'         -- ถามเพิ่มเติมหลังตรวจเรียงความ
);

CREATE TYPE ai_message_role AS ENUM (
    'user',
    'assistant',
    'system'
);

CREATE TYPE essay_status AS ENUM (
    'draft',
    'submitted',
    'grading',
    'graded',
    'revision_requested'
);

CREATE TYPE ai_provider AS ENUM (
    'openai',
    'anthropic',
    'google',
    'local_llm'
);

-- ---------------------------------------------------------------------------
-- 2. AI CONVERSATIONS (Thread header — 1 conversation per context)
-- ---------------------------------------------------------------------------
CREATE TABLE ai_conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    context_type    ai_conversation_context NOT NULL,
    context_ref_id  UUID,                        -- อ้างอิง ID ของสิ่งที่เกี่ยวข้อง
                    -- quiz_explanation → quiz_attempt_answers.id
                    -- lesson_clarification → lessons.id
                    -- essay_feedback → essay_submissions.id
    title           VARCHAR(255),                -- auto-generated summary
    message_count   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    ai_provider     ai_provider NOT NULL DEFAULT 'openai',
    ai_model        VARCHAR(100) NOT NULL DEFAULT 'gpt-4o',
    total_tokens_in INT NOT NULL DEFAULT 0,
    total_tokens_out INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_aiconv_user ON ai_conversations (user_id);
CREATE INDEX idx_aiconv_context ON ai_conversations (context_type, context_ref_id);
CREATE INDEX idx_aiconv_active ON ai_conversations (user_id, is_active);
CREATE INDEX idx_aiconv_created ON ai_conversations (created_at DESC);

-- ---------------------------------------------------------------------------
-- 3. AI MESSAGES (Individual messages within a conversation)
-- ---------------------------------------------------------------------------
CREATE TABLE ai_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations (id) ON DELETE CASCADE,
    role            ai_message_role NOT NULL,
    content         TEXT NOT NULL,
    tokens_used     INT NOT NULL DEFAULT 0,
    latency_ms      INT,                        -- response time from AI provider
    model_used      VARCHAR(100),                -- ถ้าเปลี่ยน model กลาง conversation
    metadata_json   JSONB DEFAULT '{}',
                    -- สำหรับเก็บ extra data เช่น { citations: [...], confidence: 0.95 }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_aimsg_conversation ON ai_messages (conversation_id);
CREATE INDEX idx_aimsg_created ON ai_messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- 4. ESSAY PROMPTS (GED RLA Writing prompts bank)
-- ---------------------------------------------------------------------------
CREATE TABLE essay_prompts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    passage_text    TEXT NOT NULL,                -- เนื้อหาบทความที่ให้อ่าน
    mongo_passage_id VARCHAR(24),                 -- ถ้า passage มี rich content → MongoDB
    prompt_text     TEXT NOT NULL,                -- โจทย์ที่ให้เขียน (เช่น "Analyze the argument...")
    min_words       INT NOT NULL DEFAULT 250,
    max_words       INT NOT NULL DEFAULT 500,
    time_limit_mins INT NOT NULL DEFAULT 45,
    difficulty      difficulty_level NOT NULL DEFAULT 'medium',
    source_tag      VARCHAR(100),                -- 'ged_official', 'custom'
    tags            TEXT[] DEFAULT '{}',
    sort_order      INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_essayprompts_subject ON essay_prompts (subject_id);
CREATE INDEX idx_essayprompts_active ON essay_prompts (is_active);
CREATE INDEX idx_essayprompts_difficulty ON essay_prompts (difficulty);
CREATE INDEX idx_essayprompts_tags ON essay_prompts USING GIN (tags);

-- ---------------------------------------------------------------------------
-- 5. ESSAY SUBMISSIONS (Student essay submissions)
-- ---------------------------------------------------------------------------
CREATE TABLE essay_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    prompt_id       UUID NOT NULL REFERENCES essay_prompts (id) ON DELETE CASCADE,
    mongo_essay_id  VARCHAR(24) NOT NULL,         -- Essay full text + draft history → MongoDB
    status          essay_status NOT NULL DEFAULT 'draft',
    word_count      INT NOT NULL DEFAULT 0,
    time_spent_secs INT NOT NULL DEFAULT 0,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at    TIMESTAMPTZ,
    graded_at       TIMESTAMPTZ,

    -- Grading summary (populated after AI grading)
    total_score     SMALLINT,                     -- 0-100 scale
    ged_equivalent  SMALLINT,                     -- mapped to GED 100-200 scale
    ai_provider     ai_provider,
    ai_model        VARCHAR(100),
    grading_tokens_used INT DEFAULT 0,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_essay_score CHECK (
        total_score IS NULL OR total_score BETWEEN 0 AND 100
    ),
    CONSTRAINT chk_essay_ged CHECK (
        ged_equivalent IS NULL OR ged_equivalent BETWEEN 100 AND 200
    ),
    CONSTRAINT chk_essay_mongo_id CHECK (mongo_essay_id ~ '^[a-fA-F0-9]{24}$')
);

CREATE INDEX idx_essays_user ON essay_submissions (user_id);
CREATE INDEX idx_essays_prompt ON essay_submissions (prompt_id);
CREATE INDEX idx_essays_status ON essay_submissions (status);
CREATE INDEX idx_essays_score ON essay_submissions (total_score DESC NULLS LAST);
CREATE INDEX idx_essays_user_prompt ON essay_submissions (user_id, prompt_id);
CREATE INDEX idx_essays_mongo ON essay_submissions (mongo_essay_id);

-- ---------------------------------------------------------------------------
-- 6. ESSAY GRADING DETAILS (Rubric-based scoring per dimension)
-- ---------------------------------------------------------------------------
-- GED RLA Essay Rubric Dimensions:
--   1. Claim/Thesis       (เข้าใจ claim หลักของ passage ได้ดีแค่ไหน)
--   2. Evidence/Support   (ดึง evidence จาก passage มาสนับสนุนได้ดีแค่ไหน)
--   3. Organization       (โครงสร้างเรียงความ — intro, body, conclusion)
--   4. Language/Conventions (ไวยากรณ์, การสะกด, ความหลากหลายของประโยค)
--   5. Development/Reasoning (การพัฒนา argument ลึกซึ้งแค่ไหน)
CREATE TABLE essay_grading_details (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id   UUID NOT NULL REFERENCES essay_submissions (id) ON DELETE CASCADE,
    dimension       VARCHAR(50) NOT NULL,
                    -- 'claim', 'evidence', 'organization', 'language', 'reasoning'
    score           SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 4),
                    -- 0=Not Present, 1=Inadequate, 2=Adequate, 3=Effective, 4=Excellent
    max_score       SMALLINT NOT NULL DEFAULT 4,
    feedback        TEXT NOT NULL DEFAULT '',
                    -- AI-generated feedback สำหรับ dimension นี้
    strengths       TEXT[] DEFAULT '{}',
                    -- จุดแข็งที่ AI พบ (array ของ short phrases)
    improvements    TEXT[] DEFAULT '{}',
                    -- สิ่งที่ควรปรับปรุง (array ของ short phrases)
    mongo_feedback_id VARCHAR(24),
                    -- ถ้า feedback มี rich content (markdown/highlights) → MongoDB
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_essay_dimension UNIQUE (submission_id, dimension)
);

CREATE INDEX idx_egd_submission ON essay_grading_details (submission_id);
CREATE INDEX idx_egd_dimension ON essay_grading_details (dimension);

-- ---------------------------------------------------------------------------
-- 7. READINESS SCORES (Cached readiness assessment per user per subject)
-- ---------------------------------------------------------------------------
-- อัลกอริทึมคำนวณจากหลายตัวแปร:
--   - Weighted average ของ quiz_attempts ล่าสุด (ยิ่งชุดใหญ่/ใกล้เคียงจริง ยิ่งน้ำหนักสูง)
--   - % lesson completion ใน subject นั้น
--   - Spaced Repetition mastery rate (% 'mastered' cards)
--   - Essay scores (ถ้าเป็น RLA)
--   - Recency factor (คะแนนเก่าถูกลดน้ำหนัก)
--   - Consistency factor (standard deviation ของคะแนน — มาก = ยังไม่พร้อม)
CREATE TABLE readiness_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    subject_id          UUID NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    predicted_ged_score SMALLINT NOT NULL CHECK (predicted_ged_score BETWEEN 100 AND 200),
    confidence_level    VARCHAR(20) NOT NULL,
                        -- 'not_ready', 'approaching', 'likely_pass', 'strong_pass'
    pass_probability    DECIMAL(5,2) NOT NULL CHECK (pass_probability BETWEEN 0 AND 100),
                        -- % โอกาสผ่านเกณฑ์ 145+ จาก statistical model

    -- Factor breakdown (สำหรับแสดงใน Dashboard)
    quiz_score_factor   DECIMAL(5,2) DEFAULT 0.0,
    completion_factor   DECIMAL(5,2) DEFAULT 0.0,
    mastery_factor      DECIMAL(5,2) DEFAULT 0.0,
    recency_factor      DECIMAL(5,2) DEFAULT 0.0,
    consistency_factor  DECIMAL(5,2) DEFAULT 0.0,
    essay_factor        DECIMAL(5,2) DEFAULT 0.0,

    -- Raw data snapshot (สำหรับ debug และ audit)
    input_snapshot      JSONB NOT NULL DEFAULT '{}',
                        -- { total_quizzes: 45, avg_score: 78.5, lessons_completed: 32/40, ... }

    -- GED Ready test results (ถ้าเคยทำ ged_ready_full หรือ ged_ready_subject)
    best_ged_ready_score DECIMAL(5,2),
    best_ged_ready_date  TIMESTAMPTZ,

    calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_readiness_user_subject UNIQUE (user_id, subject_id)
);

CREATE INDEX idx_readiness_user ON readiness_scores (user_id);
CREATE INDEX idx_readiness_subject ON readiness_scores (subject_id);
CREATE INDEX idx_readiness_confidence ON readiness_scores (confidence_level);
CREATE INDEX idx_readiness_predicted ON readiness_scores (predicted_ged_score DESC);
CREATE INDEX idx_readiness_calculated ON readiness_scores (calculated_at DESC);

-- ---------------------------------------------------------------------------
-- 8. READINESS HISTORY (Track readiness score changes over time)
-- ---------------------------------------------------------------------------
CREATE TABLE readiness_history (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    subject_id          UUID NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    predicted_ged_score SMALLINT NOT NULL,
    confidence_level    VARCHAR(20) NOT NULL,
    pass_probability    DECIMAL(5,2) NOT NULL,
    trigger_event       VARCHAR(50) NOT NULL DEFAULT 'auto',
                        -- 'auto' (หลังทำ quiz/essay), 'manual' (user กด refresh)
    input_snapshot      JSONB NOT NULL DEFAULT '{}',
    calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rh_user_subject ON readiness_history (user_id, subject_id, calculated_at DESC);
CREATE INDEX idx_rh_calculated ON readiness_history (calculated_at DESC);

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-update updated_at for new tables
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_aiconv_updated BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_essays_updated BEFORE UPDATE ON essay_submissions FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_essayprompts_updated BEFORE UPDATE ON essay_prompts FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_readiness_updated BEFORE UPDATE ON readiness_scores FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-increment message_count on ai_conversations
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_conv_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_conversations
    SET message_count = (SELECT COUNT(*) FROM ai_messages WHERE conversation_id = NEW.conversation_id)
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_msg_count
    AFTER INSERT ON ai_messages
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_conv_message_count();

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-log readiness score changes to history
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_log_readiness_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO readiness_history (
        user_id, subject_id, predicted_ged_score,
        confidence_level, pass_probability, input_snapshot, calculated_at
    ) VALUES (
        NEW.user_id, NEW.subject_id, NEW.predicted_ged_score,
        NEW.confidence_level, NEW.pass_probability, NEW.input_snapshot, NEW.calculated_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_readiness
    AFTER INSERT OR UPDATE OF predicted_ged_score ON readiness_scores
    FOR EACH ROW
    EXECUTE FUNCTION fn_log_readiness_history();

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-update essay_submissions.total_score from grading_details
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_recalc_essay_score()
RETURNS TRIGGER AS $$
DECLARE
    v_total       INT;
    v_max_total   INT;
    v_percent     DECIMAL(5,2);
    v_ged_equiv   SMALLINT;
BEGIN
    SELECT COALESCE(SUM(score), 0), COALESCE(SUM(max_score), 0)
    INTO v_total, v_max_total
    FROM essay_grading_details
    WHERE submission_id = NEW.submission_id;

    v_percent := CASE
        WHEN v_max_total > 0 THEN ROUND((v_total::DECIMAL / v_max_total::DECIMAL) * 100, 2)
        ELSE 0.0
    END;

    -- Map 0-100 scale → GED 100-200 scale (145 = passing)
    v_ged_equiv := 100 + (v_percent::SMALLINT);

    UPDATE essay_submissions
    SET total_score    = v_percent::SMALLINT,
        ged_equivalent = v_ged_equiv
    WHERE id = NEW.submission_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalc_essay_score
    AFTER INSERT OR UPDATE OF score ON essay_grading_details
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalc_essay_score();

COMMIT;