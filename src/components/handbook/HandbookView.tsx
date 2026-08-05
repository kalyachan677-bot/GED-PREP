"use client";

import { useAppStore } from "@/lib/store";
import { useText, Lang } from "@/lib/ui-texts";
import { BackButton } from "@/components/ui/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronDown, ChevronRight, GraduationCap, Lightbulb, FlaskConical, CheckCircle2, ExternalLink, FileText, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// --- Types ---
interface HandbookContentItem {
  id: string;
  contentBodyEn: string;
  contentBodyTh: string;
  contentBodyMm: string;
  keyTakeaways: string[];
  formulaOrRules: string[];
  sortOrder: number;
}

interface HandbookTopicItem {
  id: string;
  subjectId: string;
  title: string;
  titleTh: string;
  titleMm: string;
  categoryType: string;
  sortOrder: number;
  contents: HandbookContentItem[];
}

interface LessonItem {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  durationMinutes: number;
}

interface TopicWithLessons {
  id: string;
  title: string;
  lessons: LessonItem[];
}

interface ModuleWithTopics {
  id: string;
  title: string;
  sortOrder: number;
  topics: TopicWithLessons[];
}

const SUBJECT_META: Record<string, { icon: string; gradient: string }> = {
  math: { icon: "\u{1F9EE}", gradient: "from-blue-500 to-cyan-500" },
  science: { icon: "\u{1F52C}", gradient: "from-emerald-500 to-teal-500" },
  rla: { icon: "\u{1F4D6}", gradient: "from-amber-500 to-orange-500" },
  ss: { icon: "\u{1F3DB}\uFE0F", gradient: "from-rose-500 to-pink-500" },
};

export function HandbookView() {
  const { selectedHandbookSubjectId, setSelectedHandbookSubjectId, setView } = useAppStore();
  const { tx, language } = useText();
  const [data, setData] = useState<HandbookTopicItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Lessons data for tab C
  const [lessonsData, setLessonsData] = useState<ModuleWithTopics[] | null>(null);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const subjectCodes = ["math", "science", "rla", "ss"];

  // Auto-select first subject when entering handbook view
  useEffect(() => {
    if (!selectedHandbookSubjectId) {
      setSelectedHandbookSubjectId(subjectCodes[0]);
    }
  }, [selectedHandbookSubjectId, setSelectedHandbookSubjectId, subjectCodes]);

  // Determine initial tab
  useEffect(() => {
    if (!data || data.length === 0) return;
    const types = [...new Set(data.map((t) => t.categoryType))];
    if (!activeTab || !types.includes(activeTab)) {
      setActiveTab(types[0] || null);
    }
  }, [data, activeTab]);

  // Fetch handbook data when subject changes
  const fetchHandbook = useCallback(async () => {
    if (!selectedHandbookSubjectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/handbook/${selectedHandbookSubjectId}`);
      const json = await res.json();
      setData(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      console.error("Failed to load handbook", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedHandbookSubjectId]);

  // Fetch lessons data — มี retry 3 ครั้ง เผื่อ server restart
  const fetchLessons = useCallback(async () => {
    if (!selectedHandbookSubjectId) return;
    setLessonsLoading(true);
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`/api/handbook/lessons/${selectedHandbookSubjectId}`);
        const json = await res.json();
        setLessonsData(Array.isArray(json.data) ? json.data : []);
        break; // สำเร็จ ออก loop
      } catch (e) {
        console.warn(`Lessons fetch attempt ${attempt}/3 failed`, e);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * attempt));
        else { setLessonsData([]); }
      }
    }
    setLessonsLoading(false);
  }, [selectedHandbookSubjectId]);

  // Fetch lessons when tab becomes "lessons"
  useEffect(() => {
    if (activeTab === "lessons" && !lessonsData && !lessonsLoading) {
      fetchLessons();
    }
  }, [activeTab, lessonsData, lessonsLoading, fetchLessons]);

  useEffect(() => {
    fetchHandbook();
  }, [fetchHandbook]);

  // Reset lessons data when subject changes
  useEffect(() => {
    setLessonsData(null);
  }, [selectedHandbookSubjectId]);

  const filteredTopics = data
    ? data.filter((t) => t.categoryType === activeTab)
    : [];

  const handbookTopics = data ? data.filter((t) => t.categoryType === "handbook") : [];
  const textbookTopics = data ? data.filter((t) => t.categoryType === "textbook") : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <BackButton label={tx("backToDashboard")} onClick={() => { setView("dashboard"); setSelectedHandbookSubjectId(null); }} />

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{tx("studyGuide")}</h1>
            <p className="mt-1 text-sm text-white/70 font-medium">
              {language === "en"
                ? "GED Knowledge Base & Official Handbook"
                : language === "my"
                  ? "GED မ္ဟာ ပြည့်မြောက် & Official Handbook"
                  : "คลังความรู้ GED และคู่มือเรียน"}
            </p>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {subjectCodes.map((code) => {
          const meta = SUBJECT_META[code];
          const isActive = selectedHandbookSubjectId === code;
          return (
            <button
              key={code}
              onClick={() => setSelectedHandbookSubjectId(code)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? `bg-gradient-to-r ${meta.gradient} text-white shadow-md`
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{meta.icon}</span>
              {tx(code)}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      )}

      {/* No subject selected */}
      {!loading && !selectedHandbookSubjectId && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-12 text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">{tx("noHandbookYet")}</p>
        </div>
      )}

      {/* Content */}
      {!loading && selectedHandbookSubjectId && data && (
        <>
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {handbookTopics.length > 0 && (
              <button
                onClick={() => setActiveTab("handbook")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "handbook"
                    ? "bg-violet-100 text-violet-700 border-2 border-violet-200"
                    : "bg-white text-slate-500 border-2 border-transparent hover:bg-slate-50"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {tx("examHandbook")}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "handbook" ? "bg-violet-200 text-violet-800" : "bg-slate-100 text-slate-500"}`}>A</span>
              </button>
            )}
            {textbookTopics.length > 0 && (
              <button
                onClick={() => setActiveTab("textbook")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "textbook"
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                    : "bg-white text-slate-500 border-2 border-transparent hover:bg-slate-50"
                }`}
              >
                <FlaskConical className="h-4 w-4" />
                {tx("coreTextbook")}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "textbook" ? "bg-emerald-200 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>B</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab("lessons")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "lessons"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                  : "bg-white text-slate-500 border-2 border-transparent hover:bg-slate-50"
              }`}
            >
              <FileText className="h-4 w-4" />
              {tx("lessons")}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "lessons" ? "bg-blue-200 text-blue-800" : "bg-slate-100 text-slate-500"}`}>C</span>
            </button>
          </div>

          {/* Empty state */}
          {data.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">{tx("handbookEmpty")}</p>
              <p className="text-xs text-slate-400 mt-1">{tx("noHandbookYet")}</p>
            </div>
          )}

          {/* Topics list (handbook/textbook tabs) */}
          {activeTab !== "lessons" && filteredTopics.map((topic) => (
            <TopicAccordion key={topic.id} topic={topic} language={language} tx={tx} />
          ))}

          {/* Lessons tab content */}
          {activeTab === "lessons" && lessonsLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          )}
          {activeTab === "lessons" && !lessonsLoading && lessonsData && lessonsData.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">{tx("handbookEmpty")}</p>
            </div>
          )}
          {activeTab === "lessons" && !lessonsLoading && lessonsData && lessonsData.length > 0 && (
            <LessonsTabContent modules={lessonsData} />
          )}
        </>
      )}
    </div>
  );
}

// --- Topic Accordion ---
function TopicAccordion({ topic, language, tx }: { topic: HandbookTopicItem; language: Lang; tx: (k: string) => string }) {
  const [open, setOpen] = useState(false);

  const title = language === "th" && topic.titleTh ? topic.titleTh
    : language === "my" && topic.titleMm ? topic.titleMm
    : topic.title;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
            <BookOpen className="h-4.5 w-4.5 text-violet-600" />
          </div>
          <p className="font-bold text-slate-800 text-sm">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">{topic.contents.length} sections</span>
          {open ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4">
          {topic.contents.map((content) => (
            <ContentSection key={content.id} content={content} language={language} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Content Section ---
function ContentSection({ content, language, tx }: { content: HandbookContentItem; language: Lang; tx: (k: string) => string }) {
  const body = language === "th" && content.contentBodyTh ? content.contentBodyTh
    : language === "my" && content.contentBodyMm ? content.contentBodyMm
    : content.contentBodyEn;

  const takeaways = content.keyTakeaways.length > 0 ? content.keyTakeaways : [];
  const formulas = content.formulaOrRules.length > 0 ? content.formulaOrRules : [];

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
      {/* Body content */}
      {body && (
        <div className="prose prose-sm prose-slate max-w-none">
          {body.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <br key={i} />;
            if (trimmed.startsWith("# ")) return <h3 key={i} className="text-base font-bold text-slate-800 mt-3 mb-1">{trimmed.slice(2)}</h3>;
            if (trimmed.startsWith("## ")) return <h4 key={i} className="text-sm font-bold text-slate-700 mt-2 mb-1">{trimmed.slice(3)}</h4>;
            if (trimmed.startsWith("### ")) return <h5 key={i} className="text-xs font-bold text-slate-600 mt-1 mb-0.5 uppercase tracking-wider">{trimmed.slice(4)}</h5>;
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return <li key={i} className="text-sm text-slate-600 ml-4 list-disc">{trimmed.slice(2)}</li>;
            }
            if (/^\d+\./.test(trimmed)) {
              return <li key={i} className="text-sm text-slate-600 ml-4 list-decimal">{trimmed.replace(/^\d+\.\s*/, "")}</li>;
            }
            if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
              return <p key={i} className="text-sm font-bold text-slate-700">{trimmed.slice(2, -2)}</p>;
            }
            return <p key={i} className="text-sm text-slate-600 leading-relaxed">{trimmed}</p>;
          })}
        </div>
      )}

      {/* Key Takeaways */}
      {takeaways.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">{tx("keyTakeaways")}</p>
          </div>
          {takeaways.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      )}

      {/* Formulas & Rules */}
      {formulas.length > 0 && (
        <div className="rounded-lg bg-violet-50 border border-violet-100 p-3 space-y-1.5">
          <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">{tx("formulasAndRules")}</p>
          {formulas.map((f, i) => (
            <div key={i} className="rounded-md bg-white/60 border border-violet-100 px-3 py-2">
              <p className="text-xs font-mono text-violet-800 leading-relaxed whitespace-pre-wrap">{f}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Lessons Tab Content (Tab C) ---
function LessonsTabContent({ modules }: { modules: ModuleWithTopics[] }) {
  const { setSelectedLesson, setView, setLessonOrigin } = useAppStore();
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);

  async function handleOpenLesson(lessonId: string) {
    if (loadingLessonId) return; // prevent double-click
    setLoadingLessonId(lessonId);
    // retry 3 ครั้ง เผื่อ server restart
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const json = await res.json();
        if (json.data) {
          setSelectedLesson(json.data);
          setLessonOrigin("handbook");
          setView("lesson");
          break;
        }
      } catch (e) {
        console.warn(`Lesson load attempt ${attempt}/3 failed`, e);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    setLoadingLessonId(null);
  }

  return (
    <>
      {modules.map((mod) => (
        <LessonsModuleCard
          key={mod.id}
          module={mod}
          loadingLessonId={loadingLessonId}
          onOpenLesson={handleOpenLesson}
        />
      ))}
    </>
  );
}

// --- Lessons Module Card (Tab C) ---
function LessonsModuleCard({ module, loadingLessonId, onOpenLesson }: { module: ModuleWithTopics; loadingLessonId: string | null; onOpenLesson: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  const totalLessons = module.topics.reduce((s, t) => s + t.lessons.length, 0);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <FileText className="h-4.5 w-4.5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{module.title}</p>
            <p className="text-[11px] text-slate-400 font-medium">{totalLessons} lessons</p>
          </div>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-3">
          {module.topics.map((topic) => (
            <div key={topic.id} className="mb-3 last:mb-0">
              <p className="px-2 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{topic.title}</p>
              {topic.lessons.map((lesson) => {
                const isLoading = loadingLessonId === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onOpenLesson(lesson.id)}
                    disabled={isLoading}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-blue-50/50 group disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100/60">
                        <div className="h-3.5 w-3.5 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100/60">
                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-600 group-hover:text-blue-700 truncate">{lesson.title}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
                      <Clock className="h-3 w-3" />
                      {lesson.durationMinutes} min
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Concept Guide Inline Panel (for QuizResult) ---
export function ConceptGuidePanel({ conceptId }: { conceptId: string }) {
  const { language } = useText();
  const [data, setData] = useState<{
    id: string; title: string; titleTh: string; titleMm: string;
    contents: HandbookContentItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!conceptId) return;
    setLoading(true);
    fetch(`/api/handbook/concept/${conceptId}`)
      .then((r) => r.json())
      .then((j) => setData(j.data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conceptId]);

  if (loading) {
    return (
      <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-xs text-blue-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data || data.contents.length === 0) return null;

  const title = language === "th" && data.titleTh ? data.titleTh
    : language === "my" && data.titleMm ? data.titleMm
    : data.title;

  const firstContent = data.contents[0];
  const body = language === "th" && firstContent.contentBodyTh ? firstContent.contentBodyTh
    : language === "my" && firstContent.contentBodyMm ? firstContent.contentBodyMm
    : firstContent.contentBodyEn;

  return (
    <div className="rounded-xl bg-blue-50/80 border border-blue-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 bg-blue-100/50 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-800">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <ExternalLink className="h-3 w-3 text-blue-400" />
          {open ? <ChevronDown className="h-3.5 w-3.5 text-blue-500" /> : <ChevronRight className="h-3.5 w-3.5 text-blue-500" />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2 max-h-64 overflow-y-auto">
          {body && body.split("\n").slice(0, 15).map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("# ")) return <h3 key={i} className="text-sm font-bold text-blue-900">{trimmed.slice(2)}</h3>;
            if (trimmed.startsWith("## ")) return <h4 key={i} className="text-xs font-bold text-blue-800">{trimmed.slice(3)}</h4>;
            return <p key={i} className="text-xs text-blue-900/80 leading-relaxed">{trimmed}</p>;
          })}
          {firstContent.keyTakeaways.length > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-200/50">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Key Takeaways</p>
              {firstContent.keyTakeaways.slice(0, 5).map((t, i) => (
                <p key={i} className="text-[11px] text-blue-800 leading-relaxed">- {t}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}