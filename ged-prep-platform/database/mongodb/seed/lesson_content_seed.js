// ============================================================================
// GED Prep Platform — MongoDB Seed Data Example
// Demonstrates how lesson body_content is structured in MongoDB
// ============================================================================

const seedData = [
  {
    lesson_slug: 'solving-linear-equations',
    lesson_title: 'Solving Linear Equations',
    blocks: [
      {
        id: 'blk_001',
        block_type: 'heading',
        content: 'What is a Linear Equation?',
        level: 2,
      },
      {
        id: 'blk_002',
        block_type: 'paragraph',
        content: 'A <strong>linear equation</strong> is an algebraic equation of degree one. It has one or more variables, and the highest power of any variable is 1. The general form is ax + b = c, where a, b, and c are constants and x is the variable you need to solve for.',
      },
      {
        id: 'blk_003',
        block_type: 'callout',
        callout: {
          variant: 'formula',
          title: 'Standard Form',
          body: 'ax + b = c  →  x = (c − b) / a',
        },
      },
      {
        id: 'blk_004',
        block_type: 'video',
        video: {
          platform: 'youtube',
          video_id: 'dQw4w9WgXcQ',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Solving Linear Equations — Step by Step',
          thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          duration_secs: 720,
          start_time: 0,
          end_time: 0,
          caption_lang: 'en',
          autoplay: false,
        },
      },
      {
        id: 'blk_005',
        block_type: 'heading',
        content: 'Step-by-Step Method',
        level: 2,
      },
      {
        id: 'blk_006',
        block_type: 'numbered_list',
        content: '',
        items: [
          '<strong>Isolate the variable term</strong> — Move all terms with x to one side of the equation.',
          '<strong>Isolate the constant</strong> — Move all constant terms to the other side.',
          '<strong>Solve for x</strong> — Divide both sides by the coefficient of x.',
          '<strong>Check your answer</strong> — Substitute x back into the original equation.',
        ],
      },
      {
        id: 'blk_007',
        block_type: 'heading',
        content: 'Example',
        level: 3,
      },
      {
        id: 'blk_008',
        block_type: 'callout',
        callout: {
          variant: 'example',
          title: 'Solve: 3x + 7 = 22',
          body: 'Step 1: Subtract 7 from both sides → 3x = 15\nStep 2: Divide by 3 → x = 5\nCheck: 3(5) + 7 = 15 + 7 = 22 ✓',
        },
      },
      {
        id: 'blk_009',
        block_type: 'math',
        math: {
          latex: 'x = \\frac{c - b}{a}',
          display_mode: true,
          alt_text: 'x equals c minus b, all divided by a',
        },
      },
      {
        id: 'blk_010',
        block_type: 'callout',
        callout: {
          variant: 'tip',
          title: 'GED Tip',
          body: 'Always check your answer by plugging it back into the original equation. This catches sign errors and simple arithmetic mistakes.',
        },
      },
      {
        id: 'blk_011',
        block_type: 'divider',
        divider: { style: 'solid', margin_top: '1.5rem', margin_bottom: '1.5rem' },
      },
      {
        id: 'blk_012',
        block_type: 'heading',
        content: 'Practice Problems',
        level: 2,
      },
      {
        id: 'blk_013',
        block_type: 'accordion',
        accordion: {
          title: 'Problem 1: Solve 5x − 3 = 17',
          body: '5x − 3 = 17\n5x = 20\nx = 4\n\nCheck: 5(4) − 3 = 20 − 3 = 17 ✓',
          is_open_by_default: false,
        },
      },
      {
        id: 'blk_014',
        block_type: 'accordion',
        accordion: {
          title: 'Problem 2: Solve 2(x + 4) = 18',
          body: '2(x + 4) = 18\nx + 4 = 9\nx = 5\n\nCheck: 2(5 + 4) = 2(9) = 18 ✓',
          is_open_by_default: false,
        },
      },
    ],
  },
];

module.exports = { seedData };