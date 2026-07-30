// ============================================================================
// Static UI Translations (EN / TH / MY) - press button to switch instantly
// ============================================================================

import { useAppStore } from "./store";

export type Lang = "en" | "th" | "my";

export const UI: Record<string, Record<Lang, string>> = {
  // -- Common --
  error:            { en: "An error occurred",          th: "เกิดข้อผิดพลาด",       my: "အမှား တစ်ခု ဖြစ်ပါသည်" },
  errorRetry:       { en: "An error occurred, please try again", th: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง", my: "အမှား တစ်ခု ဖြစ်ပါသည်၊ ပြန်လုပ်ကြိုးပါ" },
  skip:             { en: "Skip",      th: "ข้าม",       my: "ကျေးဇူးပြု" },
  save:             { en: "Save",      th: "บันทึก",       my: "သိမ်းဆည်းပါ" },
  restart:          { en: "Start Over",th: "เริ่มใหม่",       my: "ပြန်လုပ်မည်" },
  completed:        { en: "Completed", th: "สำเร็จ",       my: "ပြီးပြည်ပြီး" },
  locked:           { en: "Locked",    th: "ล็อค",          my: "ပိုက်ထားသည်" },
  minutes:          { en: "min",       th: "นาที",         my: "မိနစ်" },
  avg:              { en: "Avg",       th: "เฉลี่ย",       my: "ပျှမ်းမျှ" },

  // -- Auth --
  loginFailed:      { en: "Login failed", th: "การเข้าสู่ระบบล้มเหลว", my: "ဝင်ရောက်မှု မအောင်မြင်ပါ" },
  registerFailed:   { en: "Registration failed", th: "การสมัครสมาชิกล้มเหลว", my: "အမည်သို့ မအောင်မြင်ပါ" },
  loginSubtitle:    { en: "Professional GED Exam Preparation", th: "เตรียมสอบ GED อย่างมืออาชีพ", my: "G.E.D. စမ်းပြဿနာ ကျွန်ုပ်灌ရှင်ရှင်ဖောက်မြန်မား" },
  loginTitle:       { en: "Log In",    th: "เข้าสู่ระบบ",       my: "ဝင်ရောက်ပါ" },
  loginDesc:        { en: "Enter your email and password to start learning", th: "กรอกอีเมลและรหัสผ่านเพื่อเริ่มต้นการเรียน", my: "သုံးပြုလုပ်ကိုင်ရောက်ရန် အီးမေးလ်နှင့် စကားဝှက်ကို ရေးသွင်းပါ" },
  email:            { en: "Email",     th: "อีเมล",         my: "အီးမေးလ်" },
  password:         { en: "Password",  th: "รหัสผ่าน",       my: "စကားဝှက်" },
  loginBtn:         { en: "Log In",    th: "เข้าสู่ระบบ",       my: "ဝင်ရောက်ပါ" },
  noAccount:        { en: "Don't have an account? ", th: "ยังไม่มีบัญชี? ", my: "အမည်မရှိသေးဘူး? " },
  registerBtn:      { en: "Sign Up",   th: "สมัครสมาชิก",       my: "အမည်သို့" },
  tryDemo:          { en: "Try Demo",  th: "ทดลองใช้งาน", my: "ဒီမု စမ်းကြည့်ပါ" },
  demoAccount:      { en: "Use Demo: demo@ged.com / demo1234", th: "ใช้บัญชี Demo: demo@ged.com / demo1234", my: "ဒီမု အမည်: demo@ged.com / demo1234" },
  registerTitle:    { en: "Create Student Account", th: "สร้างบัญชีผู้เข้าเรียน", my: "သုံးပြုလုပ်သူ အမည်ဖန်ရှင်ပါ" },
  register:         { en: "Sign Up",   th: "สมัครสมาชิก",       my: "အမည်သို့" },
  registerDesc:     { en: "Fill in your details to start learning", th: "กรอกข้อมูลเพื่อเริ่มต้นการเรียน", my: "သုံးပြုလုပ်ရန် အချက်အလွယ်တူကို ရေးသွင်းပါ" },
  studentName:      { en: "Student Name",th: "ชื่อผู้เข้าเรียน",   my: "သုံးပြုလုပ်သူ အမည်" },
  fullName:         { en: "Full Name", th: "ชื่อ-นามสกุล",       my: "အပြည့်အမည်" },
  min6Chars:        { en: "At least 6 characters", th: "อย่างน้อย 6 ตัวอักษร", my: "အနည်းဆုံး စာလုံး ၆ လုံး" },
  passwordMin6:     { en: "Password must be at least 6 characters", th: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", my: "စကားဝှက်တွင် အနည်းဆုံး စာလုံး ၆ လုံး ရှိရမည်" },
  passwordMismatch: { en: "Passwords do not match", th: "รหัสผ่านไม่ตรงกัน", my: "စကားဝှက် မတူညီပါ" },
  confirmPassword:  { en: "Confirm Password", th: "ยืนยันรหัสผ่าน",    my: "စကားဝှက် အတိုင်းထိုင်ပါ" },
  confirmPasswordPh:{ en: "Enter password again", th: "กรอกรหัสผ่านอีกครั้ง", my: "စကားဝှက်ကို ပြန်ရေးသွင်းပါ" },
  backToLogin:      { en: "Back to Login", th: "กลับไปเข้าสู่ระบบ",       my: "ဝင်ရောက်သို့ ပြန်သွားပါ" },

  // -- Sidebar / Nav --
  home:             { en: "Home",          th: "หน้าหลัก",          my: "ပိုင်းမြောက်" },
  math:             { en: "Math",          th: "คณิตศาสตร์",        my: "ကန်ဒါန်ဘာ" },
  science:          { en: "Science",       th: "วิทยาศาสตร์",      my: "သွင်မုန်း" },
  rla:              { en: "Language Arts", th: "ภาษาอังกฤษ",      my: "အရေးကိုင်ဘာ" },
  ss:               { en: "Social Studies", th: "สังคมศึกษา",      my: "လူမှုရေးရပ်" },
  resetProgress:    { en: "Reset All Progress",    th: "รีเซตข้อมูลการเรียน",  my: "အရေးအကြီး ပြန်လုပ်မည်" },
  resetConfirm:     { en: "Reset all data?",       th: "ต้องการรีเซตข้อมูลทั้งหมด?", my: "အရေးအကြီး ပြန်ရဲ့မည်လား?" },
  resetDesc:        { en: "All progress and scores will be deleted. This cannot be undone.", th: "ความคืบหน้า และ คะแนนทั้งหมด จะถูกลบ. คุณต้องเริ่มเรียนใหม่", my: "ရလဒ်နှင့် မြှောင်းမှတ်များ အားလုံး ဖျက်မည်။ နောက်ပြန်မရပါ။" },
  confirmReset:     { en: "Reset",    th: "ยืนยันรีเซต",          my: "ပြန်လုပ်မည်" },
  cancel:           { en: "Cancel",   th: "ยกเลิก",          my: "ပယ်ဖျက်မည်" },
  logout:           { en: "Log out",  th: "ออกจากระบบ",       my: "ထွက်မည်" },

  // -- Dashboard --
  hello:            { en: "Hello", th: "สวัสดี", my: "မင်္ဂလာပါ" },
  scoreTargetMsg:   { en: "GED target {score} pts - continue where you left off, progress is saved automatically", th: "เป้าหมาย GED {score} คะแนน - เรียนต่อจากที่ค้างไว้ได้เลย ความคืบหน้าถูกบันทึกอัตโนมัติ", my: "GED ရည်တုံ {score} မြှောင်း - နောက်ဆက်လုပ်ပါ၊ ရလဒ် အလိုအလျောက် သိမ်းဆည်းပေးသည်" },
  startLearning:    { en: "Start learning today - choose a subject below", th: "เริ่มต้นการเรียนวันนี้ - เลือกวิชาที่ต้องการเรียนด้างล่าง", my: "ယနေ့ကတည်း သုံးပြုပါ - အောက်ပါ ဘာသာစကားကို ရွေးချယ်ပါ" },
  lessonsCompleted: { en: "Lessons Done",   th: "บทเรียนที่เสร็จ",      my: "ပြီးပြည်ပြီးသော သို့" },
  avgScore:         { en: "Avg Score",     th: "คะแนนเฉลี่ย",        my: "ပျှမ်းမျှ မြှောင်း" },
  totalQuizzes:     { en: "Total Quizzes",  th: "แบบทดสอบทั้งหมด",    my: "စမ်းပြဿနာ အပေါင်းစုံ" },
  overallProgress:  { en: "Overall Progress",th: "ความคืบหน้ารวม",    my: "အရေးအကြီး ရလဒ်" },
  times:            { en: "times",   th: "ครั้ง",          my: "ကြိမ်" },
  gedSubjects:      { en: "GED Subjects",  th: "วิชาเรียน GED",    my: "GED ဘာသာစကားများ" },
  recentQuizzes:    { en: "Recent Quizzes", th: "แบบทดสอบล่าสุด",    my: "နောက်ဆုံး စမ်းပြဿနာများ" },
  lessonQuiz:       { en: "Lesson Quiz",   th: "แบบทดสอบบทเรียน", my: "သို့ စမ်းပြဿနာ" },
  subjectTest:      { en: "Subject Test",  th: "แบบทดสอบหน่วย",  my: "ဘာသာစကား စမ်းပြဿနာ" },
  quiz:             { en: "Quiz",     th: "แบบทดสอบ",          my: "စမ်းပြဿနာ" },
  questions:         { en: "questions",th: "คำถาม",          my: "မေးခွန်းများ" },

  // -- Subject Descriptions --
  mathDesc:         { en: "Reasoning through math, algebra, geometry, and data analysis", th: "คณิตศาสตร์เชิงการใช้เหตุผล พีชคณิต เรขาคณิต และการวิเคราะห์ข้อมูล", my: "ကန်ဒါန်ဘာ၊ အယ်လ်ဂျာဘာ၊ ဂျပန်းမှန်နှင့် ဒေတာ ခန့်မှန်းခြင်း" },
  scienceDesc:      { en: "Life science, physical science, and earth & space science", th: "วิทยาศาสตร์ชีวิต ฟิสิกส์ เคมี และโลกและอวกาศ", my: "သာသနီးဘာသာ၊ ရေစီစစ်ဘာသာနှင့် မြေဘာသာ" },
  rlaDesc:          { en: "Reading comprehension, writing, and grammar", th: "ทักษะการอ่านเข้าใจ การเขียน และไวยากรณ์ภาษาอังกฤษ", my: "ဖတ်စွာဖတ်မှု၊ ရေးသားခြင်းနှင့် စကားလိုက်" },
  ssDesc:           { en: "History, civics, economics, and geography", th: "ประวัติศาสตร์ การเมือง เศรฐศาสตร์ และภูมิศาสตร์", my: "သမိုင်း၊ ရပ်ရေးရွေ့ချေးရေး၊ ဘက်ရှေ့စီးပွားစောင့်နှင့် ဒေသခံဘာသာ" },

  // -- Rigor --
  dailyMission:     { en: "Daily Mission",      th: "สถานะภารกิจประจำวัน",  my: "နေ့စဉ် အတွေ့အကြုံ" },
  disciplineScore:  { en: "Discipline Score",   th: "คะแนนวินัย",        my: "ပညာရေး မြှောင်း" },
  reviewFlashcards: { en: "Review Flashcards",  th: "ทบทวน Flashcards",         my: "Flashcards ပြန်သုံးဖတ်ပါ" },
  subjects_done:    { en: "subjects",          th: "วิชา",                     my: "ဘာသာစကား" },
  doQuiz:           { en: "Do Quiz",           th: "ทำแบบทดสอบ",           my: "စမ်းပြဿနာ ဖြင့်ပါ" },
  done:             { en: "Done",             th: "เสร็จแล้ว",            my: "ပြီးပြည်ပြီး" },
  notDone:          { en: "Not done",          th: "ยังไม่ได้ทำ",         my: "မလုပ်ရသေးသား" },
  missedDays:       { en: "Missed {days} days in a row", th: "ขาดเรียน {days} วันติดกัน", my: "ဆက်တိုက် {days} ရက် မလုပ်ခဲ့" },
  scoreDeducted:    { en: "- discipline score deducted", th: "- คะแนนวินัยถูกตัด", my: "- ပညာရေး မြှောင်း လျှော့ချခြင်း" },
  doubleMode:       { en: "2x Compensation Mode today - extra study schedule", th: "โหมดชดเชย 2x เท่าวันนี้ - ตารางเรียนเพิ่มเติม", my: "ယနေ့ နှစ်ဆထတ် ဖြြးထမ်းခြင်း - ပိုမို သုံးပြုရေးမွက်ခက်" },

  // -- Subject View --
  back:             { en: "Back",           th: "กลับ",          my: "နောက်သွား" },
  backToLesson:     { en: "Lesson",         th: "บทเรียน",       my: "သို့" },
  backToDashboard:  { en: "Dashboard",      th: "แดชบอร์ด์",     my: "ဒက်ရှ်ဘာဖြာ" },
  lessons:          { en: "Lessons",        th: "บทเรียน",       my: "သို့များ" },
  lessonsCount:     { en: "{count} lessons",  th: "{count} บทเรียน",  my: "သို့ {count} ခု" },
  questionsCount:   { en: "{count} questions",th: "{count} คำถาม",  my: "မေးခွန်း {count} ခု" },
  flashcards:       { en: "Flashcards",     th: "แฟลชการ์ด",       my: "Flashcards" },
  vocabReview:      { en: "Vocab Review",   th: "ทบทวนคำศัพท์",    my: "စကားလုံး ပြန်သုံးဖတ်ခြင်း" },
  takeQuiz:         { en: "Take Quiz",      th: "ทำแบบทดสอบ",       my: "စမ်းပြဿနာ ဖြင့်ပါ" },
  startNew:        { en: "Start New",      th: "เริ่มใหม่",       my: "အသစ် ပြန်လုပ်ပါ" },
  subjectTestDesc:  { en: "Test your understanding of all lessons in this subject", th: "ทดสอบความเข้าใจรวมทุกบทเรียนในวิชานี้", my: "ဤဘာသာစကားရဲ့ သို့အားလုံးကို နားလည်မှု စမ်းသပ်ပါ" },
  flashcardsFirst:  { en: "Complete Flashcards first", th: "ต้องทำ Flashcards ก่อน", my: "Flashcards ကို ရှေ့ ပြီးပြည်ပြီးပါ" },
  scoreTooLow:     { en: "Score too low - Locked", th: "คะแนนต่ำเกินไป - ล็อค", my: "မြှောင်း အနည်းငယ်လွန်း - ပိုက်ထားသည်" },
  startTest:        { en: "Start Test",      th: "เริ่มทำแบบทดสอบ", my: "စမ်းပြဿနာ စတင်ပါ" },
  mustComplete:     { en: "Required - Must complete before starting quiz", th: "จำเป็น - ต้องทำให้เสร็จก่อนเริ่มแบบทดสอบ", my: "လိုအပ်သည် - စမ်းပြဿနာ မစတင်မီ ပြီးပြည်ပါ" },
  lockReasonScore:  { en: "Locked - Score must pass threshold first", th: "ล็อค - ต้องทำคะแนนให้ผ่านเกณฑ์ก่อน", my: "ပိုက်ထားသည် - မြှောင်း လိုက်နက်ရရှိရမည်" },

  // -- Score Target Modal --
  setTargetTitle:   { en: "Set GED Score Target", th: "ตั้งเป้าหมายคะแนน GED", my: "GED မြှောင်း ရည်တုံ သတ်မှတ်ပါ" },
  setTargetDesc:    { en: "Choose your target GED score", th: "เลือกคะแนนเป้าหมาย GED ของคุณ", my: "သင့် GED မြှောင်း ရည်တုံကို ရွေးချယ်ပါ" },
  setTargetDashDesc: { en: "Choose target score 145-200 and let the AI tutor tailor your study plan", th: "เลือกคะแนนเป้าหมาย 145-200 และให้ AI ติวเตอร์ปรับแผนการเรียนให้ตามระดับ", my: "145-200 ကန့်မှန်းမြှောင်းကို ရွေးပြီး AI သုံးပြုပိုင် ကိုင်ရှင်ပေးပါ" },
  confirm:          { en: "Confirm",       th: "ยืนยัน",             my: "အတိုင်းထိုင်ပါ" },

  // -- AI Tutor --
  level:            { en: "Level {level}", th: "ระดับ {level}", my: "အဆင့် {level}" },
  aiTutor:          { en: "AI Tutor - {personality}", th: "AI ติวเตอร์ - {personality}", my: "AI သုံးပြုပိုင် - {personality}" },
  target:           { en: "Target",        th: "เป้าหมาย",          my: "ရည်တုံ" },
  student:          { en: "Student",       th: "นักเรียน",         my: "သုံးပြုလုပ်သူ" },
  aiRules:          { en: "Your AI Tutor Rules", th: "กฎระเบียบ AI ติวเตอร์ของคุณ", my: "သင့် AI သုံးပြုပိုင် စည်မာ" },
  targetScore:      { en: "Target: {score} pts", th: "เป้าหมาย: {score} คะแนน", my: "ရည်တုံ: {score} မြှောင်း" },
  setTargetBtn:     { en: "Set Target",     th: "ตั้งเป้าหมายคะแนน", my: "ရည်တုံ သတ်မှတ်ပါ" },
  required:         { en: "Required",      th: "บังคับ",            my: "လိုအပ်သည်" },
  optional:         { en: "Optional",      th: "ไม่บังคับ",        my: "ရွေးချယ်ပိုင်" },
  recommended:      { en: "Recommended",  th: "แนะนำ",             my: "အကြံပြု" },

  // -- Quiz View --
  questionOf:       { en: "Question {n} of {total}", th: "โจทยคำถามที่ {n} / {total}", my: "မေးခွန်း {n} / {total}" },
  questionN:         { en: "Question {n}", th: "คำถามที่ {n}", my: "မေးခွန်း {n}" },
  exitQuiz:         { en: "Exit Quiz?",    th: "ออกจากแบบทดสอบ?", my: "စမ်းပြဿနာမှ ထွက်မည်လား?" },
  exitQuizMsg:      { en: "You answered {n} of {m} questions. If you exit now, scores won't be saved.", th: "คุณตอบไปแล้ว {n} ข้อจาก {m} ข้อ หากออกตอนนี้คะแนนจะไม่ถูกบันทึก", my: "{m} မေးခွန်းတွင် {n} ဖြေကြားပြီးပြီးပါသည်။ ထွက်လိုက်လျှင် မြှောင်း သိမ်းမလိုက်ပါ။" },
  continue:         { en: "Continue",      th: "ทำต่อ",                my: "ဆက်လုပ်" },
  exitQuizBtn:      { en: "Exit Quiz",     th: "ออกจากแบบทดสอบ", my: "စမ်းပြဿနာမှ ထွက်ပါ" },
  easy:             { en: "Easy",          th: "ง่าย",               my: "လွယ်ကူ" },
  medium:           { en: "Medium",        th: "ปานกลาง",           my: "အတိအကျ" },
  hard:             { en: "Hard",          th: "ยาก",                 my: "ခက်ခဲ" },
  previous:         { en: "Previous",      th: "ก่อนหน้า",           my: "ရှေ့က" },
  submitAnswer:     { en: "Submit ({n}/{m})", th: "ส่งคำตอบ ({n}/{m})", my: "ဖြေပေးပါ ({n}/{m})" },
  next:             { en: "Next",          th: "ถัดไป",               my: "နောက်က" },

  // -- Quiz Result --
  correct:          { en: "Correct",       th: "ถูกต้อง",             my: "မှန်ကန်သည်" },
  tryAgain:         { en: "Try Again",     th: "ลองอีกครั้ง",        my: "ပြန်စမ်းကြည့်ပါ" },
  backToLessonBtn:  { en: "Back to Lesson", th: "กลับบทเรียน",       my: "သို့သို့ ပြန်သွားပါ" },
  reviewAnswers:    { en: "Review Answers",th: "ทบทวนคำตอบ",        my: "ဖြေတူကို ပြန်သုံးဖတ်ပါ" },
  yourAnswer:       { en: "Your Answer:",  th: "คำตอบของคุณ:",    my: "သင့် အဖြေ:" },
  correctAnswer:    { en: "Correct Answer:",th: "คำตอบที่ถูกต้อง:", my: "မှန်ကန်သော အဖြေ:" },

  // -- Vocab Review --
  vocabLoading:     { en: "Loading vocabulary...",          th: "กำลังโหลดคำศัพท์...",           my: "စကားလုံး လေ့လာနေသည်..." },
  vocabSummaryTitle:{ en: "Vocabulary Review Summary",       th: "สรุปผลการทบทวนคำศัพท์",        my: "စကားလုံး ပြန်သုံးဖတ်ခြင်း အပြည့်စုံ" },
  vocabWordN:       { en: "Word {n}",                      th: "คำที่ {n}",                     my: "စကား {n}" },
  vocabAsking:      { en: "Asking",                         th: "กำลังถาม",                    my: "မေးနေသည်" },
  vocabNoAudio:     { en: "No audio",                      th: "ไม่มีเสียง",                   my: "သက်သာမရှိ" },
  vocabListen:      { en: "Listen",                         th: "ฟังเสียง",                    my: "နားသပ်ပါ" },
  vocabCorrectBang: { en: "Correct!",                      th: "ถูกต้อง!",                     my: "မှန်ကန်သည်!" },
  vocabYouAnswered: { en: "You answered:",                  th: "คุณตอบ:",                     my: "သင့် အဖြေ:" },
  vocabAnswer:      { en: "Correct:",                       th: "เฉลย:",                        my: "အဖြေ (မှန်ကန်):" },
  vocabTranslateHint:{ en: "What does \"{term}\" mean?",   th: "\"{term}\" แปลว่าอะไร?",         my: "\"{term}\" အဓိပ္ပာယ်ရှိသလား?" },
  vocabTypeTranslation:{ en: "Type Thai translation...",     th: "พิมพ์คำแปลภาษาไทย...",         my: "မြန်မာ အပြုစုံ ရေးသွင်းပါ..." },
  vocabTypeHint:    { en: "Type translation and press Enter - minor spelling mistakes are okay", th: "พิมพ์คำแปลแล้วกด Enter - สะกดผิดเล็กน้อยไม่เป็นไร ขอแค่ความหมายใกล้เคียงก็ผ่าน", my: "အပြုစုံ ရေးသွင်းပြီး Enter နုတ်ပါ - စာပြန် အနည်းငယ်များ မလိုက်ပါ" },
  vocabReviewAgain: { en: "Review Again",                  th: "เริ่มทบทวนใหม่",               my: "ပြန်သုံးဖတ်ပါ" },
  vocabNeedsReview: { en: "Words to review",                th: "คำที่ต้องทบทวนเพิ่มเติม",      my: "ပြန်သုံးဖတ်ရမည်သော စကားများ" },
  vocabTranslationLabel:{ en: "Translation:",                th: "คำแปล:",                      my: "အပြုစုံ:" },
  vocabResuming:    { en: "Resuming from last session",    th: "กำลังทำต่อจากครั้งล่าสุด",      my: "နောက်ဆုံး ပြက် ဆက်လုပ်နေသည်" },
  vocabMsgLow:      { en: "Review more vocabulary. Try again!", th: "ควรทบทวนคำศัพท์เพิ่มเติม ลองอีกครั้งนะ", my: "စကားလုံးပိုမို သုံးပြုပါ။ ပြန်စမ်းပါ!" },
  vocabMsgHigh:     { en: "Excellent! You remember vocabulary well. Ready for the next lesson!", th: "ยอดเยี่ยม! คุณจดจำคำศัพท์ได้ดีมาก พร้อมเรียนบทต่อไป!", my: "ကောင်းလွန်း! စကားလုံးများကို ကျွန်ုပ် မှတ်သားနိုင်ပါသည်။ နောက်သို့ အဆင်သင့်ပါသည်!" },
  vocabMsgMid:      { en: "Not bad. Review the wrong words again.", th: "พอใช้ได้ ลองทบทวนคำที่ผิดอีกสักครั้ง", my: "အရမ်းရှိပါသည်။ မှားသော စကားများကို ပြန်သုံးဖတ်ပါ။" },

  // -- Subject View additions --
  subjectQuiz:      { en: "Subject Test",                   th: "แบบทดสอบวิชา",               my: "ဘာသာစကား စမ်းပြဿနာ" },
  aiTutorLabel:    { en: "AI Tutor:",                      th: "AI ติวเตอร์:",               my: "AI သုံးပြုပိုင်:" },
  lockReasonLesson:{ en: "Locked - Complete previous lesson first", th: "ล็อค - ทำบทเรียนก่อนหน้าให้เสร็จก่อน", my: "ပိုက်ထားသည် - ရှေ့သို့ကို ပြီးပြည်ပြီးပါ" },
  lockReasonQuizScore:{ en: "Locked - Pass quiz with 155+ first", th: "ล็อค - ทำแบบทดสอบให้คะแนนผ่าน 155+ ก่อน", my: "ပိုက်ထားသည် - 155+ ဖြေကြားပြီးပါ" },
  resetVocabTitle: { en: "Reset vocab progress",           th: "รีเซ็ตความคืบหน้าคำศัพท์",     my: "စကားလုံး ရလဒ် ပြန်လုပ်" },

  // -- Nickname Modal --
  setNickname:      { en: "Set Your Nickname", th: "ตั้งชื่อเล่นของคุณ", my: "သင့် အမည်သတ်မှတ်ပါ" },
  nicknameDesc:     { en: "This will be displayed instead of your real name", th: "ชื่อเล่นจะแสดงในระบบแทนชื่อจริง", my: "အမည်တွင်းကို တိုက်ရိုက် အမည် အစစ် အစရာ ထုတ်ယူပါသည်" },
  backBtn:          { en: "Go Back",       th: "ย้อนกลับ",             my: "နောက်သွား" },
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
