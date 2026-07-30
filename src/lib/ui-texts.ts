// ============================================================================
// Static UI Translations (EN / TH / MY) — press button to switch instantly
// ============================================================================

import { useAppStore } from "./store";

export type Lang = "en" | "th" | "my";

export const UI: Record<string, Record<Lang, string>> = {
  // ── Common ──
  error:            { en: "An error occurred",          th: "เกิดข้อผิดพลาด",       my: "ခာက်မှု ၐာတူး ၖုန်သီသ̀န်" },
  errorRetry:       { en: "An error occurred, please try again", th: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง", my: "ခာက်မှု ၐာတူးပါလ̀န်ရ̀န်ဝ့̄ တပ်နွ̄း မလ̀ထာပါ" },
  skip:             { en: "Skip",      th: "ข้าม",       my: "ကျာဘပေါ့" },
  save:             { en: "Save",      th: "บันทึก",       my: "သျုင်ထာဘ့̄မ̊" },
  restart:          { en: "Start Over",th: "เริ่มใหม่",       my: "ပြုပေါ့မ̊" },
  completed:        { en: "Completed", th: "สำเร็จ",       my: "ပြုံပြုံပါပေါ့" },
  locked:           { en: "Locked",    th: "ล็อค",          my: "လိ်̇လမ္စ်ထာဘ့̄" },
  minutes:          { en: "min",       th: "นาที",         my: "မိ̄းန်နး" },
  avg:              { en: "Avg",       th: "เฉลี่ย",       my: "ပျားမား" },

  // ── Auth ──
  loginFailed:      { en: "Login failed", th: "การเข้าสู่ระบบล้มเหลว", my: "ဝီင်ရန်̊တတ်ဝ့̄က်မှု" },
  registerFailed:   { en: "Registration failed", th: "การสมัครสมาชิกล้มเหลว", my: "အတ်မ်းမက်မ်ဆ်ပေါ့ တတ်ဝ့̄က်မှု" },
  loginSubtitle:    { en: "Professional GED Exam Preparation", th: "เตรียมสอบ GED อย่างมืออาชีพ", my: "G.E.D. ကိုတ် ဖူနုဖ̀န် လပ်မ္̄တာဝ့̄မ̊" },
  loginTitle:       { en: "Log In",    th: "เข้าสู่ระบบ",       my: "ဝီင်ရန်̊" },
  loginDesc:        { en: "Enter your email and password to start learning", th: "กรอกอีเมลและรหัสผ่านเพื่อเริ่มต้นการเรียน", my: "လပ်မ္̄တာဝ့̄မ̊ပြုပေါ့ရတ်က်မှု အိုမာလျန်̊န̂ာသး ဖံလုပ̊" },
  email:            { en: "Email",     th: "อีเมล",         my: "အိုမာလျန်̊" },
  password:         { en: "Password",  th: "รหัสผ่าน",       my: "ကာသျပါုမ̂ိ္" },
  loginBtn:         { en: "Log In",    th: "เข้าสู่ระบบ",       my: "ဝီင်ရန်̊" },
  noAccount:        { en: "Don't have an account? ", th: "ยังไม่มีบัญชี? ", my: "အတ်မ်းမရ̀န် မရ̀န်သ̀မ̊ဘ̀ရ့̄လ့̄ဘ်̀ရ့̄ရ်̄ရ̀န်? " },
  registerBtn:      { en: "Sign Up",   th: "สมัครสมาชิก",       my: "အတ်မ်းမက်မ်ဆ်ပေါ့" },
  tryDemo:          { en: "Try Demo",  th: "ทดลองใช้งาน",       my: "ဒီမု ကံထ်သးပါ" },
  demoAccount:      { en: "Use Demo: demo@ged.com / demo1234", th: "ใช้บัญชี Demo: demo@ged.com / demo1234", my: "ဒီမု အတ်မ်း ဆံလုပ̊: demo@ged.com / demo1234" },
  registerTitle:    { en: "Create Student Account", th: "สร้างบัญชีผู้เข้าเรียน", my: "လပ်မ္̄တာဝ့̄မ̊သူ အတ်မ်း ဖှန်နိ̇ချီဘ့̄" },
  register:         { en: "Sign Up",   th: "สมัครสมาชิก",       my: "အတ်မ်းမက်မ်ဆ်ပေါ့" },
  registerDesc:     { en: "Fill in your details to start learning", th: "กรอกข้อมูลเพื่อเริ่มต้นการเรียน", my: "လပ်မ္̄တာဝ့̄မ̊ပြုပေါ့ရတ်က်မှု အတ်န̂ာသး ဖံလုပ̊" },
  studentName:      { en: "Student Name",th: "ชื่อผู้เข้าเรียน",   my: "လပ်မ္̄တာဝ့̄မ̊သူဝေသြန်̊မ̂ိ္" },
  fullName:         { en: "Full Name", th: "ชื่อ-นามสกุล",       my: "အမ́ိ္ ဝေသြန်̊မ̂ိ္" },
  min6Chars:        { en: "At least 6 characters", th: "อย่างน้อย 6 ตัวอักษร", my: "အန်̊န̂ါးမ̆ပျား သွင်မတ်က်မှု ၦ လုဖ်̀" },
  passwordMin6:     { en: "Password must be at least 6 characters", th: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", my: "ကာသျပါုမ̂ိ္ထဲတ်က်မှု အန်̊န̂ါးမ̆ပျား ၦ လုဖ်̀ ရလန်̊ရတ်ရတ်" },
  passwordMismatch: { en: "Passwords do not match", th: "รหัสผ่านไม่ตรงกัน", my: "ကာသျပါုမ̂ိ္မျဖားမဟုန်̊မ̊" },
  confirmPassword:  { en: "Confirm Password", th: "ยื่อนรหัสผ่าน",    my: "ကာသျပါုမ̂ိ္ခပေါ့ရိုပေါ့" },
  confirmPasswordPh:{ en: "Enter password again", th: "กรอกรหัสผ่านอีกครั้ง", my: "ကာသျပါုမ̂ိ္ကိွ̄းထပ် ထပ်နွ̄း" },
  backToLogin:      { en: "Back to Login", th: "กลับไปเข้าสู่ระบบ",       my: "ဝီင်ရန်̊မ္̂နှန် ပြုပေါ့" },

  // ── Sidebar / Nav ──
  home:             { en: "Home",          th: "หน้าหลัก",          my: "မျိ္ဖိ်" },
  math:             { en: "Math",          th: "คณิตศาสตร์",        my: "ကန်ဒါန်ဘာ" },
  science:          { en: "Science",       th: "วิทยาศาสตร์",      my: "သွင်မုန်း" },
  rla:              { en: "Language Arts", th: "ภาษาอังกฤษ",      my: "အဖျာဘချပါုမ̂ိ္" },
  ss:               { en: "Social Studies", th: "สังคมศึกษา",      my: "ာှက်မရ̀န်ရိ̇ပ္̊ဝုံ" },
  resetProgress:    { en: "Reset All Progress",    th: "รีเซตข้อมูลการเรียน",  my: "လပ်မ္̄တာဝ့̄မ̊ အာုပ်နှန် ပြုပေါ့သျအန်ရတ်" },
  resetConfirm:     { en: "Reset all data?",       th: "ต้องการรีเซตข้อมูลทั้งหมด?", my: "အသြက်ဝှဘ်အာုပ်အသြက်ဠာုပ်ဖိ်သှင်မှုာ̄း?" },
  resetDesc:        { en: "All progress and scores will be deleted. This cannot be undone.", th: "ความคืบหน้า และ คะแนนทั้งหมด จะถูกลบ. คุณต้องเริ่มเรียนใหม่", my: "လပ်မ္̄တာဝ့̄မ̊န̂ါးမြန်မှု အာုပ်အသြက်အာုပ်ပျား ဖျားသားဖိ်သှက်မှုပ်ဟျုမှုပြုမ̊ဝ့̄ပြုံပြုံပါပေါ့ပြုမှုမ̊ဋိ့ပ်ပေါ့မတ်ရ့̄ရ့̄လ့̄ဘ်̀နွ̄း" },
  confirmReset:     { en: "Reset",    th: "ยื่อนรีเซต",          my: "ပြုပေါ့သျအန်ရတ်" },
  cancel:           { en: "Cancel",   th: "ยกเลิก",          my: "ဖျားသားမှု" },
  logout:           { en: "Log out",  th: "ออกจากระบบ",       my: "ထိုပ်တတ်မှု" },

  // ── Dashboard ──
  hello:            { en: "Hello", th: "สวัสดี", my: "မိန်ဥ်ဠူး" },
  scoreTargetMsg:   { en: "GED target {score} pts — continue where you left off, progress is saved automatically", th: "เป้าหมาย GED {score} คะแนน — เรียนต่อจากที่ค้างไว้ได้เลย ความคืบหน้าถูกบันทึกอัตโนมัติ", my: "GED ဓိျီးပ်တူး {score} မှဆ်ချီပ်မှု — မျိ္ဖိ်မိ္ပ္က်က်မှုဆြရင်ထဲတ်က်မှုဝ့̄ပြုပေါ့နိ်က်မှုဖြုိုပေါ့" },
  startLearning:    { en: "Start learning today — choose a subject below", th: "เริ่มต้นการเรียนวันนี้ — เลือกวิชาที่ต้องการเรียนด้างล่าง", my: "လပ်မ္̄တာဝ့̄မ̊ဝေင်နှန်မိ္ ပြုပေါ့ — အထဲတ်က်မှုထဲချာရတ်လျန်̊အထဲချာ" },
  lessonsCompleted: { en: "Lessons Done",   th: "บทเรียนที่เสร็จ",      my: "ပြုံပြုံပါပေါ့သွန်က်မှုလပ်မ္̄တာဝ့̄မ̊" },
  avgScore:         { en: "Avg Score",     th: "คะแนนเฉลี่ย",        my: "ပျားမား မှဆ်ချီပ်" },
  totalQuizzes:     { en: "Total Quizzes",  th: "แบบทดสอบทั้งหมด",    my: "စုံးပြုံပါပေါ့ဖြုံပါပေါ့" },
  overallProgress:  { en: "Overall Progress",th: "ความคืบหน้ารวม",    my: "ပြုံပြုံပါပေါ့တံလျပ်ပျား" },
  times:            { en: "times",   th: "ครั้ง",          my: "ပွိ္က်" },
  gedSubjects:      { en: "GED Subjects",  th: "วิชาเรียน GED",    my: "GED ဘာသွင်မုန်းက်မှု" },
  recentQuizzes:    { en: "Recent Quizzes", th: "แบบทดสอบล่าสุด",    my: "မျိ္ဖိ်မှဆ်ချီပ် စုံးပြုံပါပေါ့" },
  lessonQuiz:       { en: "Lesson Quiz",   th: "แบบทดสอบบทเรียน", my: "လပ်မ္̄တာဝ့̄မ̊ စုံးပြုံပါပေါ့" },
  subjectTest:      { en: "Subject Test",  th: "หน้าจอบทดสอบหน่วย",  my: "အထဲချာ စုံးပြုံပါပေါ့" },
  quiz:             { en: "Quiz",     th: "แบบทดสอบ",          my: "စုံးပြုံပါပေါ့" },
  questions:         { en: "questions",th: "คำถาม",          my: "မေီခ့ဝှမှု" },

  // ── Subject Descriptions ──
  mathDesc:         { en: "Reasoning through math, algebra, geometry, and data analysis", th: "คณิตศาสตร์เชิงการใช้เหตุผล พีชคณิต เรขาคณิต และการวิเคราะห์ข้อมูล", my: "ကန်ဒါန်ဘာ နံသးတိမတ်က်မှု အိုဖာဘာ ဘာမုမဟြဝီ န̊ု အထဲတ်က်မှု ဝုံတူးသ့လမ̊" },
  scienceDesc:      { en: "Life science, physical science, and earth & space science", th: "วิทยาศาสตร์ชีวิต ฟิสิกส์ เคมี และโลกและอวกาศ", my: "သွင်မုန်း ခရုံတြာက်မုန်းန̊ု အမျာာက်မုန်းန̊ု မြိ္ဖိ်အရျာဘလျန်̊" },
  rlaDesc:          { en: "Reading comprehension, writing, and grammar", th: "ทักษะการอ่านเข้าใจ การเขียน และไวยากรณ์ภาษาอังกฤษ", my: "စာဖိ်ပျများသ့လမ̊ အရ္̊ပ္ရ္̊ ဝုံတူးက်မှု န̊ု ကာသျပါုမ̂ိ္ ပိရပတ်က်မှု" },
  ssDesc:           { en: "History, civics, economics, and geography", th: "ประวัติศาสตร์ การเมือง เศรฐศาสตร์ และภูมิศาสตร์", my: "သွင်မုန်း တိုလးလျန်̊ ရူရ̊ဲမာ ရူလုဖ်ာဘ်္သျပ္ီးမဟာန်" },

  // ── Rigor ──
  dailyMission:     { en: "Daily Mission",      th: "สถานะภารกิจประจำวัน",  my: "နေ့ပျအာယု လုပ်ပိ္မှန်" },
  disciplineScore:  { en: "Discipline Score",   th: "คะแนนวินัย",        my: "လပ်မ္̄တာဝ့̄မ̊ရိ်န်းတူး" },
  reviewFlashcards: { en: "Review Flashcards",  th: "ทบทวน Flashcards",         my: "Flashcards မျိ္ဖိ် ပြုပေါ့သျတြာ" },
  subjects_done:    { en: "subjects",          th: "วิชา",                     my: "အထဲချာက်မှု" },
  doQuiz:           { en: "Do Quiz",           th: "ทำแบบทดสอบ",           my: "စုံးပြုံပါပေါ့ ၐာပ်" },
  done:             { en: "Done",             th: "เสร็จแล้ว",            my: "ပြုံပြုံပါ" },
  notDone:          { en: "Not done",          th: "ยังไม่ได้ทำ",         my: "မပ်ပြုပေါ့ရိ်က်မှုထှး" },
  missedDays:       { en: "Missed {days} days in a row", th: "ขาดเรียน {days} วันติดกัน", my: "ရသွင်မုန်း {days} နေ့ ထပ်ပွိ္က်ဖိ်သှက်မှုဝ့̄" },
  scoreDeducted:    { en: "— discipline score deducted", th: "— คะแนนวินัยถูกตัด", my: "— လပ်မ္̄တာဝ့̄မ̊ရိ်န်းတူး လျက်နှန်ပျား" },
  doubleMode:       { en: "2x Compensation Mode today — extra study schedule", th: "โหมดชดเชย 2x เท่าวันนี้ — ตารางเรียนเพิ่มเติม", my: "ဝေင်နှန် နှန်ထပ် တ်ပြာ — ပြုပေါ့မှုပွိ္က် ဖံလျပ်" },

  // ── Subject View ──
  back:             { en: "Back",           th: "กลับ",          my: "မျိ္ဖိ်" },
  backToLesson:     { en: "Lesson",         th: "บทเรียน",       my: "လပ်မ္̄တာဝ့̄မ̊" },
  backToDashboard:  { en: "Dashboard",      th: "แดชบอร์ด์",     my: "အျိ္ဖိ်" },
  lessons:          { en: "Lessons",        th: "บทเรียน",       my: "လပ်မ္̄တာဝ့̄မ̊" },
  lessonsCount:     { en: "{count} lessons",  th: "{count} ผสรศักรุน",  my: "လပ်မ္̄တာဝ့̄မ̊ {count} လုဖ်̀" },
  questionsCount:   { en: "{count} questions",th: "{count} คำถาม",  my: "မေီခ့ဝှ {count} လုဖ်̀" },
  flashcards:       { en: "Flashcards",     th: "แฟลชการ์ด",       my: "Flashcards" },
  vocabReview:      { en: "Vocab Review",   th: "ทบทวนคำศัพท์",    my: "စက်ပျားမျိ္ဖိ် ပြုပေါ့သျတြာ" },
  takeQuiz:         { en: "Take Quiz",      th: "ทำแบบทดสอบ",       my: "စုံးပြုံပါပေါ့ ၐာပ်" },
  startNew:        { en: "Start New",      th: "เริ่มใหม่",       my: "အသွင် ပြုပေါ့" },
  subjectTestDesc:  { en: "Test your understanding of all lessons in this subject", th: "ทดสอบความเข้าใจรวมทุกบทเรียนในวิชานี้", my: "ဤ်န်ဘာဝှင် လပ်မ္̄တာဝ့̄မ̊ အာုပ်ပျား နှက်မှုမဟာန်မှု စုံးပြုံပါ" },
  flashcardsFirst:  { en: "Complete Flashcards first", th: "ต้องทำ Flashcards ก่อน", my: "Flashcards ပြုံပြုံပါပေါ့မ̂ိ္ ဆြုံပါ" },
  scoreTooLow:     { en: "Score too low — Locked", th: "คะแนนต่ำเกินไป — ล็อค", my: "မှဆ်ချီပ် အန်̊န̂ါးမြန်မှု — လိ်̇လမ္စ်ထာဘ့̄" },
  startTest:        { en: "Start Test",      th: "เริ่มทำแบบทดสอบ", my: "စုံးပြုံပါပေါ့ ပြုပေါ့" },
  mustComplete:     { en: "Required — Must complete before starting quiz", th: "จำเป็น — ต้องทำให้เสร็จก่อนเริ่มแบบทดสอบ", my: "လအာပ်သျတ်း — စုံးပြုံပါပေါ့ မပ်ပြုပေါ့မ̂ိ္ ပြုံပြုံပါပေါ့ရိ်က်မှု" },
  lockReasonScore:  { en: "Locked — Score must pass threshold first", th: "ล็อค — ต้องทำคะแนนให้ผ่านเกณฑ์ก่อน", my: "လိ်̇လမ္စ်ထာဘ့̄ — မှဆ်ချီပ် လျာတြာအော်ပြုမ̂ိ္" },

  // ── Score Target Modal ──
  setTargetTitle:   { en: "Set GED Score Target", th: "ตั้งเป้าหมายคะแนน GED", my: "GED ဓိျီးပ်တူး သျအန်ရတ်" },
  setTargetDesc:    { en: "Choose your target GED score", th: "เลือกคะแนนเป้าหมาย GED ของคุณ", my: "ဆ်န်ဖ်ာဘ်္သျပ္ီးမဟာန် GED ဓိျီးပ်တူး ရမ်တ်က်မှု" },
  setTargetDashDesc: { en: "Choose target score 145–200 and let the AI tutor tailor your study plan", th: "เลือกคะแนนเป้าหมาย 145-200 และให้ AI ติวเตอร์ปรับแผนการเรียนให้ตามระดับ", my: "ဓိျီးပ်တူး 145-200 ရမ်တ်က်မှုနှန် သွင်မုန်းက်မှု အျားလုပ္ရို ပပွမ̊ုမှန် ပြုပေါ့" },
  confirm:          { en: "Confirm",       th: "ยื่อน",             my: "အနိ်သိ်အချာ" },

  // ── AI Tutor ──
  level:            { en: "Level {level}", th: "ระดับ {level}", my: "အော်ဘ်္ {level}" },
  aiTutor:          { en: "AI Tutor — {personality}", th: "AI ติวเตอร์ — {personality}", my: "AI ပပွမ̊ုမှန် — {personality}" },
  target:           { en: "Target",        th: "เป้าหมาย",          my: "ဓိျီးပ်တူး" },
  student:          { en: "Student",       th: "นักเรียน",         my: "လပ်မ္̄တာဝ့̄မ̊သူ" },
  aiRules:          { en: "Your AI Tutor Rules", th: "กฎระเบียบ AI ติวเตอร์ของคุณ", my: "ဆ်န်ဖြုံပါ AI ပပွမ̊ုမှန် စည်မှန်" },
  targetScore:      { en: "Target: {score} pts", th: "เป้าหมาย: {score} คะแนน", my: "ဓိျီးပ်တူး: {score} မှဆ်ချီပ်" },
  setTargetBtn:     { en: "Set Target",     th: "ตั้งเป้าหมายคะแนน", my: "ဓိျီးပ်တူး သျအန်ရတ်" },
  required:         { en: "Required",      th: "บังค์",            my: "လအာပ်သျတ်း" },
  optional:         { en: "Optional",      th: "ไม่บังค์",        my: "ရမ်တ်ပြုပေါ့" },
  recommended:      { en: "Recommended",  th: "แนะนำ",             my: "အျက်န̊းက်မှု" },

  // ── Quiz View ──
  questionOf:       { en: "Question {n} of {total}", th: "โจทยคำถามที่ {n} / {total}", my: "မေီခ့ဝှ {n} / {total}" },
  questionN:         { en: "Question {n}", th: "คำถามที่ {n}", my: "မေီခ့ဝှ {n}" },
  exitQuiz:         { en: "Exit Quiz?",    th: "ออกจากแบบทดสอบ?", my: "စုံးပြုံပါပေါ့မှု ထိုပ်တတ်မှုာ̄း?" },
  exitQuizMsg:      { en: "You answered {n} of {m} questions. If you exit now, scores won't be saved.", th: "คุณตอบไปแล้ว {n} ข้อจาก {m} ข้อ หากออกตอนนี้คะแนนจะไม่ถูกบันทึก", my: "ဆ်န်ဖြုံပာ {n} မှ {m} ပွိ္က်ဆြုံပာ ပြုပေါ့မ̊" },
  continue:         { en: "Continue",      th: "ทำต่อ",                my: "ဝုပ်လုပ်" },
  exitQuizBtn:      { en: "Exit Quiz",     th: "ออกจากแบบทดสอบ", my: "စုံးပြုံပါပေါ့မှုထိုပ်" },
  easy:             { en: "Easy",          th: "ง่าย",               my: "လိ်လုပ္" },
  medium:           { en: "Medium",        th: "ปานกลาง",           my: "အလုဖ်̀အလုပ္" },
  hard:             { en: "Hard",          th: "ยาก",                 my: "ဝုပ်န်" },
  previous:         { en: "Previous",      th: "ก่อนหน้า",           my: "ရျယ်မှန်" },
  submitAnswer:     { en: "Submit ({n}/{m})", th: "ส่งคำตอบ ({n}/{m})", my: "ပွိ္က်ဆြုံပာ ({n}/{m})" },
  next:             { en: "Next",          th: "ถัดไป",               my: "မျိ္ဖိ်နေ့" },

  // ── Quiz Result ──
  correct:          { en: "Correct",       th: "ถูกต้อง",             my: "မှည်သ်သာပါ" },
  tryAgain:         { en: "Try Again",     th: "ลองอีกครั้ง",        my: "တပ်နွ̄း ပြုပေါ့" },
  backToLessonBtn:  { en: "Back to Lesson", th: "กลับบทเรียน",       my: "လပ်မ္̄တာဝ့̄မ̊မှန် ပြုပေါ့" },
  reviewAnswers:    { en: "Review Answers",th: "ทบทวนคำตอบ",        my: "အဖြာဘ်္ဖြုံပာထဲဆြုံပ်" },
  yourAnswer:       { en: "Your Answer:",  th: "คำตอบของคุณ:",    my: "ဆ်န်ဖြုံပာ:" },
  correctAnswer:    { en: "Correct Answer:",th: "คำตอบที่ถูกต้อง:", my: "မှည်သ်သာပါသွင်မှုလပ်မ̊:" },

  // ── Vocab Review ──
  vocabLoading:     { en: "Loading vocabulary...",          th: "กำลังโหลดคำศัพท์...",           my: "စက်ပျားမျိ္ဖိ် လိုလပ်နွ̄း..." },
  vocabSummaryTitle:{ en: "Vocabulary Review Summary",       th: "สรุปผลการทบทวนคำศัพท์",        my: "စက်ပျားမျိ္ဖိ် ပြုပေါ့သျတြာ အပဲမင်" },
  vocabWordN:       { en: "Word {n}",                      th: "คำที่ {n}",                     my: "စက်ပျား {n}" },
  vocabAsking:      { en: "Asking",                         th: "กำลังถาม",                    my: "မေီခ့ဝှ" },
  vocabNoAudio:     { en: "No audio",                      th: "ไม่มีเสียง",                   my: "အသက်" },
  vocabListen:      { en: "Listen",                         th: "ฟังเสียง",                    my: "သပ်" },
  vocabCorrectBang: { en: "Correct!",                      th: "ถูกต้อง!",                     my: "မှည်သ်သာပါ!" },
  vocabYouAnswered: { en: "You answered:",                  th: "คุณตอบ:",                     my: "ဆ်န်ဖြုံပာ:" },
  vocabAnswer:      { en: "Correct:",                       th: "เฉลย:",                        my: "မှည်သ်သာပါ:" },
  vocabTranslateHint:{ en: "What does \"{term}\" mean?",   th: "\"{term}\" แปลว่าอะไร?",         my: "\"{term}\" ဘာနိုင်?" },
  vocabTypeTranslation:{ en: "Type Thai translation...",     th: "พิมพ์คำแปลภาษาไทย...",         my: "တျားလုပ္ပါ လပ်မ္̄တာဝ့̄မ̊..." },
  vocabTypeHint:    { en: "Type translation and press Enter — minor spelling mistakes are okay", th: "พิมพ์คำแปลแล้วกด Enter — สะกดผิดเล็กน้อยไม่เป็นไร ขอแค่ความหมายใกล้เคียงก็ผ่าน", my: "လပ်မ္̄တာဝ့̄မ̊ ဖံလုပ̊နွ̄း Enter — အန်̊န̂ါးမင်းမှု အန်̊န̂ါးမင်းမင်းမှု လိုက်ပါ" },
  vocabReviewAgain: { en: "Review Again",                  th: "เริ่มทบทวนใหม่",               my: "ပြုပေါ့သျတြာ ပြုပေါ့" },
  vocabNeedsReview: { en: "Words to review",                th: "คำที่ต้องทบทวนเพิ่มเติม",      my: "စက်ပျားမျိ္ဖိ် ပြုပေါ့သျတြာ" },
  vocabTranslationLabel:{ en: "Translation:",                th: "คำแปล:",                      my: "လပ်မ္̄တာဝ့̄မ̊:" },
  vocabResuming:    { en: "Resuming from last session",    th: "กำลังทำต่อจากครั้งล่าสุด",      my: "အချိန်အာုပ်နှန် ဝုပ်လုပ်" },
  vocabMsgLow:      { en: "Review more vocabulary. Try again!", th: "ควรทบทวนคำศัพท์เพิ่มเติม ลองอีกครั้งนะ", my: "စက်ပျားမျိ္ဖိ် ပြုပေါ့သျတြာ တပ်နွ̄း" },
  vocabMsgHigh:     { en: "Excellent! You remember vocabulary well. Ready for the next lesson!", th: "ยอดเยี่ยม! คุณจดจำคำศัพท์ได้ดีมาก พร้อมเรียนบทต่อไป!", my: "ကောင်းမှန်ပါ! စက်ပျားမျိ္ဖိ် မှည်သ်သာပါပါပေါ့" },
  vocabMsgMid:      { en: "Not bad. Review the wrong words again.", th: "พอใช้ได้ ลองทบทวนคำที่ผิดอีกสักครั้ง", my: "အနိုင်ရတ်ပါ မှည်မျဖားမဟုန်̊မ̊စက်ပျားမျိ္ဖိ် ပြုပေါ့သျတြာ" },

  // ── Subject View additions ──
  subjectQuiz:      { en: "Subject Test",                   th: "แบบทดสอบวิชา",               my: "အထဲချာ စုံးပြုံပါပေါ့" },
  aiTutorLabel:    { en: "AI Tutor:",                      th: "AI ติวเตอร์:",               my: "AI ပပွမ̊ုမှန်:" },
  lockReasonLesson:{ en: "Locked — Complete previous lesson first", th: "ล็อค — ทำบทเรียนก่อนหน้าให้เสร็จก่อน", my: "လိ်̇လမ္စ်ထာဘ့̄ — ရျယ်မှန် လပ်မ္̄တာဝ့̄မ̊ ပြုံပြုံပါပေါ့" },
  lockReasonQuizScore:{ en: "Locked — Pass quiz with 155+ first", th: "ล็อค — ทำแบบทดสอบให้คะแนนผ่าน 155+ ก่อน", my: "လိ်̇လမ္စ်ထာဘ့̄ — 155+ ပွိ္က်ဆြုံပါ" },
  resetVocabTitle: { en: "Reset vocab progress",           th: "รีเซ็ตความคืบหน้าคำศัพท์",     my: "စက်ပျားမျိ္ဖိ် အာုပ်နှန် ပြုပေါ့သျအန်ရတ်" },

  // ── Nickname Modal ──
  setNickname:      { en: "Set Your Nickname", th: "ตั้งชื่อเล่นของคุณ", my: "ဆ်န်ဖြုံပာ ဝေသြန်̊မ̂ိ္ သျအန်ရတ်" },
  nicknameDesc:     { en: "This will be displayed instead of your real name", th: "ชื่อเล่นจะแสดงในระบบแทนชื่อจริง", my: "ဤ်န်ဘာတြာ ဆ်န်ဖြုံပာ ဝေသြန်̊မ̂ိ္ပြုပေါ့ အပာင် ဖုပ်ပေါ့မ̊" },
  backBtn:          { en: "Go Back",       th: "ย้อนกลับ",             my: "မျိ္ဖိ်ပြုပေါ့" },
};

/**
 * useText - get text by current language instantly, no API needed
 */
export function useText() {
  const { language } = useAppStore();

  function tx(key: string, params?: Record<string, string | number>): string {
    const entry = UI[key];
    if (!entry) return key;
    let text = entry[language] || entry["en"] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }

  return { tx, language };
}
