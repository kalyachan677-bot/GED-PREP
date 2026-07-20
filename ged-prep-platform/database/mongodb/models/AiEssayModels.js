// ============================================================================
// GED Prep Platform — MongoDB Schema: Essay Content & AI Feedback
// ============================================================================
// Purpose:
//   1. EssayContent — stores full essay text, draft history, and versioning
//   2. AiFeedbackRich  — stores AI grading feedback with rich annotations
//      (highlighted text, inline comments, markdown-formatted feedback)
// ============================================================================

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---------------------------------------------------------------------------
// Sub-schema: Essay Draft Version (for version history / undo)
// ---------------------------------------------------------------------------
const EssayDraftSchema = new Schema({
  version: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  word_count: {
    type: Number,
    required: true,
  },
  saved_at: {
    type: Date,
    default: Date.now,
  },
  auto_saved: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Text Annotation (inline comment on a specific text span)
// ---------------------------------------------------------------------------
const TextAnnotationSchema = new Schema({
  start_offset: {
    type: Number,
    required: true,
  },
  end_offset: {
    type: Number,
    required: true,
  },
  text_segment: {
    type: String,
    required: true,
  },
  annotation_type: {
    type: String,
    enum: ['error', 'warning', 'suggestion', 'praise', 'highlight'],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'grammar',
      'spelling',
      'punctuation',
      'word_choice',
      'sentence_structure',
      'claim_analysis',
      'evidence_usage',
      'organization',
      'cohesion',
      'other',
    ],
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    default: '',
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// MAIN SCHEMA 1: EssayContent
// ---------------------------------------------------------------------------
const essayContentSchema = new Schema({
  // Reference to PostgreSQL essay_submissions.mongo_essay_id
  submission_ref: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },

  // ---------------------------------------------------------------------------
  // Current essay text
  // ---------------------------------------------------------------------------
  current_text: {
    type: String,
    required: true,
  },
  word_count: {
    type: Number,
    default: 0,
  },
  paragraph_count: {
    type: Number,
    default: 0,
  },
  sentence_count: {
    type: Number,
    default: 0,
  },

  // ---------------------------------------------------------------------------
  // Draft History (auto-save + manual save versions)
  // ---------------------------------------------------------------------------
  drafts: {
    type: [EssayDraftSchema],
    default: [],
  },

  // ---------------------------------------------------------------------------
  // Structural Analysis (pre-computed for grading context)
  // ---------------------------------------------------------------------------
  structure: {
    has_introduction: { type: Boolean, default: false },
    has_conclusion: { type: Boolean, default: false },
    body_paragraph_count: { type: Number, default: 0 },
    avg_sentence_length: { type: Number, default: 0 },
    avg_word_length: { type: Number, default: 0 },
    unique_word_ratio: { type: Number, default: 0 },
    transition_words_used: {
      type: [String],
      default: [],
    },
  },

  // ---------------------------------------------------------------------------
  // AI Grading Feedback (rich content with annotations)
  // ---------------------------------------------------------------------------
  overall_feedback: {
    type: String,
    default: '',
  },
  annotations: {
    type: [TextAnnotationSchema],
    default: [],
  },
  improved_version: {
    type: String,
    default: '',
    // AI-generated improved version of the essay (optional)
  },

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------
  grading_model: {
    type: String,
    default: '',
  },
  grading_completed_at: {
    type: Date,
  },
  version: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
  minimize: false,
  strict: true,
});

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
essayContentSchema.index({ submission_ref: 1 }, { unique: true });
essayContentSchema.index({ user_id: 1, 'timestamps.createdAt': -1 });

// ---------------------------------------------------------------------------
// Middleware: Auto-compute text statistics on save
// ---------------------------------------------------------------------------
essayContentSchema.pre('save', function (next) {
  const text = this.current_text || '';

  // Word count
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  this.word_count = words.length;

  // Sentence count (rough: split by . ! ?)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  this.sentence_count = Math.max(1, sentences.length);

  // Paragraph count
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  this.paragraph_count = Math.max(1, paragraphs.length);

  // Structural analysis
  if (this.structure) {
    this.structure.avg_sentence_length = this.word_count / this.sentence_count;
    this.structure.avg_word_length = text.length / Math.max(1, this.word_count);

    // Unique word ratio (vocabulary diversity)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    this.structure.unique_word_ratio = Math.round(
      (uniqueWords.size / Math.max(1, words.length)) * 100
    ) / 100;

    // Check for introduction/conclusion patterns
    const firstPara = (paragraphs[0] || '').toLowerCase();
    const lastPara = (paragraphs[paragraphs.length - 1] || '').toLowerCase();
    this.structure.has_introduction = firstPara.length > 20;
    this.structure.has_conclusion = lastPara.length > 20 && paragraphs.length > 1;
    this.structure.body_paragraph_count = Math.max(0, paragraphs.length - 2);
  }

  // Auto-save to draft history (only if text changed significantly)
  const lastDraft = this.drafts[this.drafts.length - 1];
  if (!lastDraft || lastDraft.text !== text) {
    this.drafts.push({
      version: (lastDraft ? lastDraft.version : 0) + 1,
      text: text,
      word_count: this.word_count,
      saved_at: new Date(),
      auto_saved: true,
    });

    // Keep only last 20 drafts to prevent unbounded growth
    if (this.drafts.length > 20) {
      this.drafts = this.drafts.slice(-20);
    }
  }

  this.version += 1;
  next();
});

const EssayContent = mongoose.model('EssayContent', essayContentSchema);

// ---------------------------------------------------------------------------
// MAIN SCHEMA 2: AiConversationContext
// ---------------------------------------------------------------------------
// Stores rich context data that gets injected into AI prompts.
// PostgreSQL ai_conversations stores the relational metadata;
// this document stores the actual context payload.
// ---------------------------------------------------------------------------
const aiConversationContextSchema = new Schema({
  // Reference to PostgreSQL ai_conversations.id (as hex string)
  conversation_ref: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },

  // ---------------------------------------------------------------------------
  // Context payload (varies by context_type)
  // ---------------------------------------------------------------------------
  // For 'quiz_explanation':
  //   - question_text, correct_answer, user_answer, explanation
  // For 'lesson_clarification':
  //   - lesson_title, lesson_summary, current_block_content
  // For 'essay_feedback':
  //   - essay_text, grading_details, annotations
  context_type: {
    type: String,
    enum: ['quiz_explanation', 'lesson_clarification', 'general_help', 'essay_feedback'],
    required: true,
  },
  system_prompt: {
    type: String,
    required: true,
    // The system prompt that was used (for reproducibility)
  },
  initial_context: {
    type: Schema.Types.Mixed,
    required: true,
    // Flexible object holding all context data for this conversation
  },

  // ---------------------------------------------------------------------------
  // Token management
  // ---------------------------------------------------------------------------
  total_input_tokens: {
    type: Number,
    default: 0,
  },
  total_output_tokens: {
    type: Number,
    default: 0,
  },
  estimated_cost_usd: {
    type: Number,
    default: 0,
  },

  // ---------------------------------------------------------------------------
  // Feedback / Rating from user
  // ---------------------------------------------------------------------------
  user_rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: null,
  },
  user_feedback_text: {
    type: String,
    default: '',
  },
  was_helpful: {
    type: Boolean,
    default: null,
  },
}, {
  timestamps: true,
  minimize: false,
  strict: true,
});

aiConversationContextSchema.index({ user_id: 1, 'timestamps.createdAt': -1 });

const AiConversationContext = mongoose.model('AiConversationContext', aiConversationContextSchema);

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  EssayContent,
  essayContentSchema,
  AiConversationContext,
  aiConversationContextSchema,
};