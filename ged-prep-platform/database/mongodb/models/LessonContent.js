// ============================================================================
// GED Prep Platform — MongoDB Schema: Lesson Content (body_content)
// ============================================================================
// Purpose: Stores rich text/HTML/video embeds for lesson body content.
//          PostgreSQL `lessons.mongo_content_id` references documents here.
// ============================================================================

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---------------------------------------------------------------------------
// Sub-schema: Video Embed Block
// ---------------------------------------------------------------------------
const VideoBlockSchema = new Schema({
  platform: {
    type: String,
    enum: ['youtube', 'vimeo', 'loom', 'custom'],
    required: true,
  },
  video_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  thumbnail_url: {
    type: String,
    default: '',
  },
  duration_secs: {
    type: Number,
    default: 0,
  },
  start_time: {
    type: Number,
    default: 0,
  },
  end_time: {
    type: Number,
    default: 0,
  },
  caption_lang: {
    type: String,
    default: 'en',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Image Block
// ---------------------------------------------------------------------------
const ImageBlockSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  alt_text: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  source: {
    type: String,
    default: '',
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Callout / Info Box Block
// ---------------------------------------------------------------------------
const CalloutBlockSchema = new Schema({
  variant: {
    type: String,
    enum: ['tip', 'warning', 'info', 'formula', 'remember', 'example'],
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  body: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Code / Math Block
// ---------------------------------------------------------------------------
const CodeBlockSchema = new Schema({
  language: {
    type: String,
    default: 'plaintext',
  },
  code: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
}, { _id: false });

const MathBlockSchema = new Schema({
  latex: {
    type: String,
    required: true,
  },
  display_mode: {
    type: Boolean,
    default: true,
  },
  alt_text: {
    type: String,
    default: '',
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Interactive Element (Embed placeholder for future features)
// ---------------------------------------------------------------------------
const InteractiveBlockSchema = new Schema({
  type: {
    type: String,
    enum: ['geogebra', 'desmos', 'phet', 'custom_iframe'],
    required: true,
  },
  src_url: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '400px',
  },
  title: {
    type: String,
    default: '',
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Table Block
// ---------------------------------------------------------------------------
const TableBlockSchema = new Schema({
  headers: [{
    type: String,
    required: true,
  }],
  rows: [[{
    type: String,
  }]],
  caption: {
    type: String,
    default: '',
  },
  has_header_row: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Accordion / Collapsible Block
// ---------------------------------------------------------------------------
const AccordionBlockSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  is_open_by_default: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// Sub-schema: Divider / Horizontal Rule
// ---------------------------------------------------------------------------
const DividerBlockSchema = new Schema({
  style: {
    type: String,
    enum: ['solid', 'dashed', 'dotted'],
    default: 'solid',
  },
  margin_top: {
    type: String,
    default: '1rem',
  },
  margin_bottom: {
    type: String,
    default: '1rem',
  },
}, { _id: false });

// ---------------------------------------------------------------------------
// MAIN SCHEMA: LessonContent
// ---------------------------------------------------------------------------
const lessonContentSchema = new Schema({
  // Reference back to PostgreSQL lesson (for querying convenience)
  lesson_slug: {
    type: String,
    required: true,
    index: true,
  },
  lesson_title: {
    type: String,
    required: true,
  },

  // ---------------------------------------------------------------------------
  // Content Body: Ordered array of content blocks (Block-based editor pattern)
  // Each block is a discriminated union based on `block_type`
  // ---------------------------------------------------------------------------
  blocks: [{
    id: {
      type: String,
      required: true,
    },
    block_type: {
      type: String,
      enum: [
        'paragraph',
        'heading',
        'bullet_list',
        'numbered_list',
        'video',
        'image',
        'callout',
        'code',
        'math',
        'interactive',
        'table',
        'accordion',
        'divider',
        'blockquote',
      ],
      required: true,
    },
    // Paragraph / Heading / List / Blockquote text content (HTML-safe string)
    content: {
      type: String,
      default: '',
    },
    // Heading level (only for block_type: 'heading')
    level: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 2,
    },
    // List items (only for block_type: 'bullet_list' or 'numbered_list')
    items: [{
      type: String,
    }],
    // Nested block-specific data
    video: { type: VideoBlockSchema, default: null },
    image: { type: ImageBlockSchema, default: null },
    callout: { type: CalloutBlockSchema, default: null },
    code_block: { type: CodeBlockSchema, default: null },
    math: { type: MathBlockSchema, default: null },
    interactive: { type: InteractiveBlockSchema, default: null },
    table: { type: TableBlockSchema, default: null },
    accordion: { type: AccordionBlockSchema, default: null },
    divider: { type: DividerBlockSchema, default: null },
  }],

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------
  word_count: {
    type: Number,
    default: 0,
  },
  estimated_read_minutes: {
    type: Number,
    default: 0,
  },
  version: {
    type: Number,
    default: 1,
  },
  last_edited_by: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  minimize: false,
  strict: true,
});

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
lessonContentSchema.index({ lesson_slug: 1 }, { unique: true });
lessonContentSchema.index({ 'blocks.block_type': 1 });
lessonContentSchema.index({ updatedAt: -1 });

// ---------------------------------------------------------------------------
// Virtual: Computed read time
// ---------------------------------------------------------------------------
lessonContentSchema.virtual('computed_read_time').get(function () {
  const textBlocks = this.blocks.filter(b =>
    ['paragraph', 'heading', 'bullet_list', 'numbered_list', 'blockquote', 'accordion'].includes(b.block_type)
  );
  const totalWords = textBlocks.reduce((sum, b) => {
    if (b.items && b.items.length > 0) {
      return sum + b.items.join(' ').split(/\s+/).length;
    }
    if (b.accordion) {
      return sum + (b.accordion.body || '').split(/\s+/).length;
    }
    return sum + (b.content || '').split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.ceil(totalWords / 200));
});

// ---------------------------------------------------------------------------
// Middleware: Auto-calculate word count and read time on save
// ---------------------------------------------------------------------------
lessonContentSchema.pre('save', function (next) {
  const allText = this.blocks.map(b => {
    if (b.items && b.items.length > 0) return b.items.join(' ');
    if (b.callout) return b.callout.body;
    if (b.code_block) return b.code_block.code;
    if (b.accordion) return b.accordion.body;
    return b.content || '';
  }).join(' ');

  this.word_count = allText.split(/\s+/).filter(w => w.length > 0).length;
  this.estimated_read_minutes = Math.max(1, Math.ceil(this.word_count / 200));
  this.version += 1;
  next();
});

// ---------------------------------------------------------------------------
// Model Export
// ---------------------------------------------------------------------------
const LessonContent = mongoose.model('LessonContent', lessonContentSchema);

module.exports = {
  LessonContent,
  lessonContentSchema,
};