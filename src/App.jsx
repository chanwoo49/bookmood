import { useState } from "react";
import "./App.css";

// ═══════════════════════════════════════════════════════════════
// 1. 선택지 데이터 — 모든 항목에 prompt_en(프롬프트용 영문) 포함
// ═══════════════════════════════════════════════════════════════

// ─── 키오스크: 첫인상 감성 (Pre-read) ───
const KIOSK_MOODS = [
  { label: "끌림",           emoji: "💫", prompt_en: "attraction, curiosity",        cat: "기대-긍정" },
  { label: "궁금함",         emoji: "🔍", prompt_en: "curiosity, anticipation",      cat: "기대-탐색" },
  { label: "설렘",           emoji: "💓", prompt_en: "excitement, flutter",           cat: "기대-긍정" },
  { label: "위로가 될 것 같은", emoji: "🫂", prompt_en: "comforting, soothing",       cat: "기대-안정" },
  { label: "도전적인",       emoji: "🔥", prompt_en: "challenging, bold",             cat: "기대-자극" },
  { label: "잔잔할 것 같은", emoji: "🍃", prompt_en: "calm, serene, peaceful",       cat: "기대-안정" },
  { label: "강렬한",         emoji: "⚡", prompt_en: "intense, powerful, striking",   cat: "기대-자극" },
  { label: "따뜻한",         emoji: "☀️", prompt_en: "warm, cozy, gentle",           cat: "기대-안정" },
  { label: "지적인",         emoji: "🧠", prompt_en: "intellectual, thought-provoking", cat: "기대-탐색" },
  { label: "모험적인",       emoji: "🧭", prompt_en: "adventurous, exploratory",     cat: "기대-자극" },
  { label: "감성적인",       emoji: "🌙", prompt_en: "emotional, sentimental",       cat: "기대-감성" },
  { label: "신선한",         emoji: "✨", prompt_en: "fresh, novel, unique",          cat: "기대-탐색" },
];

// ─── 웹: 독서 경험 감성 (Post-read) ───
const WEB_MOODS = [
  { label: "몰입했다",       emoji: "🌀", prompt_en: "immersive, deeply absorbed",    cat: "경험-몰입" },
  { label: "위로받았다",     emoji: "🫂", prompt_en: "comforted, healed",             cat: "경험-안정" },
  { label: "생각이 많아졌다", emoji: "🤔", prompt_en: "contemplative, reflective",    cat: "경험-사유" },
  { label: "가슴이 뛰었다", emoji: "💓", prompt_en: "heart-racing, thrilling",        cat: "경험-각성" },
  { label: "먹먹했다",       emoji: "😢", prompt_en: "overwhelming emotion, moved",   cat: "경험-감성" },
  { label: "웃겼다",         emoji: "😄", prompt_en: "funny, humorous, joyful",       cat: "경험-유쾌" },
  { label: "충격적이었다",   emoji: "😲", prompt_en: "shocking, unexpected twist",     cat: "경험-각성" },
  { label: "잔잔했다",       emoji: "🍃", prompt_en: "calm, quietly touching",        cat: "경험-안정" },
  { label: "뿌듯했다",       emoji: "😊", prompt_en: "fulfilling, satisfying",        cat: "경험-긍정" },
  { label: "허무했다",       emoji: "🌫️", prompt_en: "empty, bittersweet",            cat: "경험-감성" },
  { label: "용기를 얻었다", emoji: "💪", prompt_en: "empowering, courageous",         cat: "경험-긍정" },
  { label: "꿈꾸게 했다",   emoji: "🌈", prompt_en: "dreamy, imaginative",            cat: "경험-탐색" },
];

// ─── 공통: 표현 스타일 ───
const STYLES = [
  { label: "미니멀 포스터",   icon: "◻️", prompt_en: "minimal poster style, clean composition, bold typography" },
  { label: "수채화",          icon: "🎨", prompt_en: "watercolor painting style, soft edges, bleeding colors" },
  { label: "따뜻한 일러스트", icon: "🖼️", prompt_en: "warm illustration style, soft colors, hand-drawn feel" },
  { label: "픽셀아트",       icon: "👾", prompt_en: "pixel art style, retro 16-bit aesthetic" },
  { label: "3D 디오라마",    icon: "🏠", prompt_en: "3D diorama style, miniature scene, tilt-shift effect" },
  { label: "필름 감성",      icon: "📷", prompt_en: "film photography style, analog grain, muted tones" },
];

// ─── 공통: 장면 ───
const SCENES = [
  { label: "서점",       prompt_en: "bookstore interior" },
  { label: "카페",       prompt_en: "cozy cafe" },
  { label: "창가",       prompt_en: "by the window, window sill" },
  { label: "비 오는 거리", prompt_en: "rainy street" },
  { label: "밤하늘",     prompt_en: "night sky, starry" },
  { label: "숲",         prompt_en: "forest, woodland" },
  { label: "기차",       prompt_en: "train interior, railway" },
  { label: "바다",       prompt_en: "ocean, seaside" },
  { label: "도서관",     prompt_en: "library interior" },
  { label: "책상 위",    prompt_en: "desk, table top" },
  { label: "조용한 방",  prompt_en: "quiet room, peaceful interior" },
  { label: "노을",       prompt_en: "sunset, golden hour" },
];

// ─── 공통: 소품 ───
const PROPS = [
  { label: "커피",       prompt_en: "coffee cup" },
  { label: "찻잔",       prompt_en: "tea cup" },
  { label: "노트",       prompt_en: "notebook" },
  { label: "만년필",     prompt_en: "fountain pen" },
  { label: "스탠드 조명", prompt_en: "desk lamp" },
  { label: "꽃",         prompt_en: "flowers" },
  { label: "책갈피",     prompt_en: "bookmark" },
  { label: "헤드폰",     prompt_en: "headphones" },
  { label: "담요",       prompt_en: "blanket" },
  { label: "유리컵",     prompt_en: "glass cup" },
  { label: "초",         prompt_en: "candle" },
  { label: "별",         prompt_en: "stars, sparkles" },
];

// ═══════════════════════════════════════════════════════════════
// 2. 도서 템플릿 데이터
// ═══════════════════════════════════════════════════════════════
const TEMPLATE_BOOKS = [
  {
    id: "9791188331796", title: "돈의 속성", author: "김승호",
    cover: "💰", category: "경제/경영", purchaseDate: "2026-01-15",
    aiReview: "돈에 대한 깊은 통찰로 경제적 자유를 향한 실천적 지혜를 주는 안내서\n김승호 회장님의 풍부한 경험을 바탕으로 돈을 대하는 올바른 태도와 철학을 쉽고 명쾌하게 제시하는 책이에요.",
    tags: ["통찰", "실천", "성찰", "동기부여", "희망"],
    tagPack: {
      primary_mood: "motivation", secondary_moods: ["insight", "hope"],
      mood_scores: { motivation: 0.9, insight: 0.85, hope: 0.7, practical: 0.8, reflection: 0.6 },
      scene_candidates: ["책상 위", "카페"],
      color_lighting_hint: "warm golden light, confident contrast, sunrise tones",
      style_hint: "minimal poster",
    },
  },
  {
    id: "9788932920955", title: "아몬드", author: "손원평",
    cover: "🌰", category: "소설", purchaseDate: "2026-02-03",
    aiReview: "감정을 느끼지 못하는 소년의 성장 이야기. 깊은 철학적 질문과 따뜻한 결말이 인상적이다.",
    tags: ["성장", "철학적", "감동"],
    tagPack: {
      primary_mood: "growth", secondary_moods: ["philosophical", "touching"],
      mood_scores: { growth: 0.9, philosophical: 0.6, touching: 0.5 },
      scene_candidates: ["조용한 방", "창가"],
      color_lighting_hint: "soft muted tones, gentle afternoon light",
      style_hint: "warm illustration",
    },
  },
  {
    id: "9791191043747", title: "역행자", author: "자청",
    cover: "🔄", category: "자기계발", purchaseDate: "2025-12-20",
    aiReview: "자기계발과 인생 역전의 실전 가이드. 실행력과 사고방식의 전환을 강조하며 동기부여를 제공한다.",
    tags: ["도전", "자신감", "동기부여"],
    tagPack: {
      primary_mood: "motivation", secondary_moods: ["challenge", "confidence"],
      mood_scores: { motivation: 0.9, challenge: 0.7, confidence: 0.6 },
      scene_candidates: ["책상 위", "밤하늘"],
      color_lighting_hint: "dramatic lighting, dark background with bright accent",
      style_hint: "minimal poster",
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// 3. 프롬프트 빌더 (Gemini Imagen API용)
// ═══════════════════════════════════════════════════════════════
function buildPrompt({ book, mood, style, scene, props, channel }) {
  const tagPack = book?.tagPack || {};

  // 태그팩에서 가중치 0.3 이상인 mood만 핵심 키워드로
  const highMoods = Object.entries(tagPack.mood_scores || {})
    .filter(([, v]) => v >= 0.3)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 3);

  const parts = [];

  // 스타일
  if (style) parts.push(style.prompt_en);

  // 장면
  if (scene) parts.push(`Scene: ${scene.prompt_en}`);

  // 감성 (사용자 선택 + 태그팩)
  const moodKeywords = [];
  if (mood) moodKeywords.push(mood.prompt_en);
  if (highMoods.length) moodKeywords.push(highMoods.join(", "));
  if (moodKeywords.length) parts.push(`Mood: ${moodKeywords.join(", ")}`);

  // 색감/조명 (태그팩)
  if (tagPack.color_lighting_hint) parts.push(`Lighting: ${tagPack.color_lighting_hint}`);

  // 소품
  if (props?.length) {
    const propEn = props.map((p) => p.prompt_en).join(", ");
    parts.push(`Props: ${propEn}`);
  }

  // 안전 네거티브
  parts.push("No text, no words, no letters, no humans, no faces, no characters");
  parts.push("Safe for all audiences, no violence, no political symbols");

  const prompt = parts.join(". ") + ".";

  return {
    prompt,
    // 디버그/로그용 메타
    meta: {
      channel,
      book_id: book?.id,
      mood_label: mood?.label,
      mood_cat: mood?.cat,
      style_label: style?.label,
      scene_label: scene?.label,
      props_labels: props?.map((p) => p.label),
      tagPack_primary: tagPack.primary_mood,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 4. 플로우 정의
// ═══════════════════════════════════════════════════════════════
const STEPS_KIOSK = ["도서선택", "확인", "기분", "스타일", "장면", "소품", "생성", "결과"];
const STEPS_WEB = ["도서목록", "기분", "한줄감상", "스타일", "장면", "소품", "생성", "결과"];

// ═══════════════════════════════════════════════════════════════
// 5. 메인 App
// ═══════════════════════════════════════════════════════════════
function App() {
  const [path, setPath] = useState(null);
  const [step, setStep] = useState("home");
  const [history, setHistory] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);   // { label, emoji, prompt_en, cat }
  const [selectedStyle, setSelectedStyle] = useState(null);  // { label, icon, prompt_en }
  const [selectedScene, setSelectedScene] = useState(null);  // { label, prompt_en }
  const [selectedProps, setSelectedProps] = useState([]);     // [{ label, prompt_en }, ...]
  const [sentimentText, setSentimentText] = useState("");     // 웹 전용 자연어 텍스트
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null); // 프롬프트 결과

  const nav = (s) => { setHistory((p) => [...p, step]); setStep(s); };
  const back = () => { if (history.length) { setStep(history.at(-1)); setHistory((h) => h.slice(0, -1)); } };
  const reset = () => {
    setPath(null); setStep("home"); setHistory([]);
    setSelectedBook(null); setSelectedMood(null); setSelectedStyle(null);
    setSelectedScene(null); setSelectedProps([]); setSentimentText("");
    setSearchQuery(""); setMenuOpen(null); setGeneratedPrompt(null);
    setGeneratedImage(null); setGenError(null);
  };

  const toggleProp = (p) => {
    setSelectedProps((prev) => {
      const exists = prev.find((x) => x.label === p.label);
      if (exists) return prev.filter((x) => x.label !== p.label);
      if (prev.length < 2) return [...prev, p];
      return prev;
    });
  };

  const [generatedImage, setGeneratedImage] = useState(null); // { dataUrl, mimeType }
  const [genError, setGenError] = useState(null);

  const startGen = async () => {
    // 프롬프트 빌드
    const result = buildPrompt({
      book: selectedBook,
      mood: selectedMood,
      style: selectedStyle,
      scene: selectedScene,
      props: selectedProps,
      channel: path,
    });
    setGeneratedPrompt(result);
    setGeneratedImage(null);
    setGenError(null);
    console.log("=== 생성 프롬프트 ===", result.prompt);
    console.log("=== 메타 ===", result.meta);
    if (sentimentText) console.log("=== 자연어 텍스트 (로그용) ===", sentimentText);

    nav("loading");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: result.prompt, meta: result.meta }),
      });

      const data = await response.json();

      if (data.success && data.image) {
        setGeneratedImage(data.image);
        console.log("=== 이미지 생성 성공 ===");
      } else {
        console.warn("=== 이미지 생성 실패 ===", data);
        setGenError(data.message || "이미지 생성에 실패했습니다.");
      }
    } catch (err) {
      console.warn("=== API 호출 실패 (시뮬레이션 모드) ===", err.message);
      setGenError(null); // 시뮬레이션 모드로 넘어감
    }

    setHistory((p) => [...p, "loading"]);
    setStep("result");
  };

  // 플로우 인디케이터 매핑
  const stepLabels = path === "kiosk" ? STEPS_KIOSK : STEPS_WEB;
  const stepMap = path === "kiosk"
    ? { search: 0, confirm: 1, mood: 2, style: 3, scene: 4, props: 5, loading: 6, result: 7 }
    : { booklist: 0, mood: 1, textinput: 2, style: 3, scene: 4, props: 5, loading: 6, result: 7 };
  const currentIdx = stepMap[step] ?? -1;

  // ─── 렌더 ───
  const renderPage = () => {
    switch (step) {
      case "home":
        return <PageHome onKiosk={() => { setPath("kiosk"); nav("search"); }} onWeb={() => { setPath("web"); nav("booklist"); }} />;

      // 키오스크
      case "search":
        return <PageSearch query={searchQuery} setQuery={setSearchQuery} onSelect={(b) => { setSelectedBook(b); nav("confirm"); }} onBack={back} />;
      case "confirm":
        return <PageConfirm book={selectedBook} onConfirm={() => nav("mood")} onBack={back} />;

      // 웹
      case "booklist":
        return <PageBookList books={TEMPLATE_BOOKS} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onGenerate={(b) => { setSelectedBook(b); setMenuOpen(null); nav("mood"); }} onBack={reset} />;

      // 감성 선택 (채널별 분기)
      case "mood": {
        const isKiosk = path === "kiosk";
        const moodList = isKiosk ? KIOSK_MOODS : WEB_MOODS;
        return (
          <PageMoodSelect
            stepNum={isKiosk ? "1/4" : "1/4"}
            title={isKiosk ? "이 책에서 어떤 느낌이 왔나요?" : "이 책을 읽으며 어떤 감정이 들었나요?"}
            subtitle={isKiosk ? "첫인상을 하나 골라주세요" : "독서하며 느낀 감정을 하나 골라주세요"}
            book={selectedBook}
            items={moodList}
            selected={selectedMood}
            onSelect={setSelectedMood}
            onBack={back}
            onNext={() => nav(isKiosk ? "style" : "textinput")}
          />
        );
      }

      // 웹 전용: 자연어 텍스트 입력
      case "textinput":
        return (
          <PageTextInput
            book={selectedBook}
            text={sentimentText}
            setText={setSentimentText}
            onBack={back}
            onNext={() => nav("style")}
          />
        );

      // 공통: 스타일
      case "style":
        return (
          <PageChipSelect
            stepNum={path === "kiosk" ? "2/4" : "2/4"}
            title="표현 스타일"
            subtitle="이미지 스타일을 선택하세요"
            book={selectedBook}
            items={STYLES}
            selected={selectedStyle}
            onSelect={setSelectedStyle}
            displayFn={(item) => `${item.icon} ${item.label}`}
            keyFn={(item) => item.label}
            isSelected={(item, sel) => sel?.label === item.label}
            onBack={back}
            onNext={() => nav("scene")}
          />
        );

      // 공통: 장면
      case "scene":
        return (
          <PageChipSelect
            stepNum={path === "kiosk" ? "3/4" : "3/4"}
            title="장면"
            subtitle="어울리는 장면을 하나 골라주세요"
            book={selectedBook}
            items={SCENES}
            selected={selectedScene}
            onSelect={setSelectedScene}
            displayFn={(item) => item.label}
            keyFn={(item) => item.label}
            isSelected={(item, sel) => sel?.label === item.label}
            recommended={selectedBook?.tagPack?.scene_candidates}
            onBack={back}
            onNext={() => nav("props")}
          />
        );

      // 공통: 소품
      case "props":
        return (
          <PageChipSelect
            stepNum="4/4"
            title="소품 (최대 2개)"
            subtitle="장면에 넣고 싶은 소품을 골라주세요"
            book={selectedBook}
            items={PROPS}
            selected={selectedProps}
            onSelect={toggleProp}
            displayFn={(item) => item.label}
            keyFn={(item) => item.label}
            isSelected={(item, sel) => sel.some?.((s) => s.label === item.label)}
            multi
            onBack={back}
            onNext={startGen}
            nextLabel="이미지 생성 ✨"
            optional
          />
        );

      case "loading":
        return <PageLoading book={selectedBook} mood={selectedMood} />;

      case "result":
        return (
          <PageResult
            book={selectedBook} mood={selectedMood} style={selectedStyle}
            scene={selectedScene} props={selectedProps} prompt={generatedPrompt}
            image={generatedImage} error={genError}
            channel={path}
            onRetry={async () => {
              setStep("loading");
              setGeneratedImage(null);
              setGenError(null);
              try {
                const response = await fetch("/api/generate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt: generatedPrompt?.prompt, meta: generatedPrompt?.meta }),
                });
                const data = await response.json();
                if (data.success && data.image) setGeneratedImage(data.image);
                else setGenError(data.message || "재생성 실패");
              } catch { setGenError(null); }
              setStep("result");
            }}
            onReset={reset}
          />
        );

      default:
        return <PageHome onKiosk={() => { setPath("kiosk"); nav("search"); }} onWeb={() => { setPath("web"); nav("booklist"); }} />;
    }
  };

  // 플로우 인디케이터
  const FlowIndicator = () => {
    if (step === "home" || currentIdx < 0) return null;
    return (
      <div className={`flow-indicator ${path === "web" ? "flow-web" : ""}`}>
        {stepLabels.map((label, i) => (
          <div key={i} className="flow-step-wrap">
            <div className={`flow-step ${i === currentIdx ? "active" : i < currentIdx ? "done" : ""}`}>{label}</div>
            {i < stepLabels.length - 1 && <span className="flow-arrow">›</span>}
          </div>
        ))}
      </div>
    );
  };

  // 키오스크 래퍼
  if (path === "kiosk") {
    return (
      <div className="kiosk-page">
        <div className="kiosk-body">
          <div className="kiosk-top-bar"><div className="kiosk-camera" /><span className="kiosk-brand">BOOK MOOD</span></div>
          <FlowIndicator />
          <div className="kiosk-screen-frame"><div className="kiosk-screen">{renderPage()}</div></div>
          <div className="kiosk-bottom"><div className="kiosk-slot"><div className="kiosk-slot-inner" /></div><p className="kiosk-footer-text">교보문고 × AI BookMood</p></div>
        </div>
      </div>
    );
  }

  // 웹 래퍼
  if (path === "web") {
    return (
      <div className="web-page">
        <div className="web-container">
          <div className="web-top-bar"><span className="web-logo">📖 BookMood</span><button className="web-home-btn" onClick={reset}>홈으로</button></div>
          <FlowIndicator />
          <div className="web-content">{renderPage()}</div>
        </div>
      </div>
    );
  }

  return <div className="start-page">{renderPage()}</div>;
}

// ═══════════════════════════════════════════════════════════════
// 6. 페이지 컴포넌트들
// ═══════════════════════════════════════════════════════════════

function PageHome({ onKiosk, onWeb }) {
  return (
    <div className="page-center home-page">
      <div style={{ fontSize: 48 }}>📖</div>
      <h1 className="home-title">AI 북무드<br /><span className="accent">이미지 만들기</span></h1>
      <p className="home-desc">책과 나의 기분을 조합해<br />나만의 북무드 이미지를 만들어보세요</p>
      <div className="home-buttons">
        <button className="btn-primary btn-large" onClick={onKiosk}>🖥 키오스크로 시작</button>
        <button className="btn-outline btn-large" onClick={onWeb}>🌐 웹사이트로 시작</button>
      </div>
      <p className="home-sub">소요시간 약 30초 · 무료 체험</p>
    </div>
  );
}

// 키오스크: 도서 검색
function PageSearch({ query, setQuery, onSelect, onBack }) {
  const [searched, setSearched] = useState(false);
  const filtered = query.trim() ? TEMPLATE_BOOKS.filter((b) => b.title.includes(query) || b.author.includes(query)) : [];
  return (
    <div className="page-full">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>‹</button>
        <div><div className="header-title">도서선택화면</div><div className="header-sub">제목, 저자, ISBN으로 검색하세요</div></div>
      </div>
      <div className="search-bar">
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setSearched(false); }} onKeyDown={(e) => e.key === "Enter" && query.trim() && setSearched(true)} placeholder="제목, 저자, ISBN 검색" className="search-input" autoFocus />
        <button className="search-btn" onClick={() => query.trim() && setSearched(true)}>🔍</button>
      </div>
      {searched && (
        <div style={{ padding: "0 20px 8px" }}>
          <p className="hint-text">검색 결과 {filtered.length}건</p>
          {filtered.map((b) => <BookCard key={b.id} book={b} onClick={() => onSelect(b)} />)}
          {!filtered.length && <p className="hint-text center">결과 없음 — 아래 준비된 도서를 선택하세요</p>}
        </div>
      )}
      <div className="template-section">
        <div className="divider"><span className="divider-line" /><span className="divider-text">📌 준비된 도서</span><span className="divider-line" /></div>
        {TEMPLATE_BOOKS.map((b) => <BookCard key={b.id} book={b} onClick={() => onSelect(b)} showTags />)}
      </div>
      <div className="nav-bar"><button className="btn-outline" onClick={onBack}>이전</button><button className="btn-primary" disabled>다음</button></div>
    </div>
  );
}

// 키오스크: 도서 확인
function PageConfirm({ book, onConfirm, onBack }) {
  if (!book) return null;
  return (
    <div className="page-center" style={{ justifyContent: "flex-start", paddingTop: 20 }}>
      <div className="confirm-cover"><span style={{ fontSize: 40 }}>{book.cover}</span><span className="confirm-cover-title">{book.title}</span><span className="confirm-cover-author">{book.author}</span></div>
      <h2 className="confirm-title">{book.title}</h2>
      <p className="confirm-author">{book.author} · {book.category}</p>
      <div className="tag-row center">{book.tags.map((t) => <span key={t} className="tag">#{t}</span>)}</div>
      <div className="review-box"><p className="review-label">AI 리뷰요약</p><p className="review-text">{book.aiReview.length > 120 ? book.aiReview.slice(0, 120) + "…" : book.aiReview}</p></div>
      <div className="btn-row"><button className="btn-outline" onClick={onBack}>다른 책 선택</button><button className="btn-primary" onClick={onConfirm}>이 책으로 진행</button></div>
    </div>
  );
}

// 웹: 구매 도서 목록
function PageBookList({ books, menuOpen, setMenuOpen, onGenerate, onBack }) {
  return (
    <div className="page-full">
      <div className="page-header"><button className="btn-back" onClick={onBack}>‹</button><div><div className="header-title">내 도서 목록</div><div className="header-sub">구매한 도서에서 AI 북무드 이미지를 만들어보세요</div></div></div>
      <div className="booklist">
        {books.map((book, i) => (
          <div key={book.id} className="booklist-item">
            <div className="booklist-cover"><span>{book.cover}</span></div>
            <div className="booklist-info"><div className="booklist-title">{book.title}</div><div className="booklist-meta">{book.author} · {book.category}</div><div className="booklist-date">구매일: {book.purchaseDate}</div></div>
            <div className="booklist-menu-wrap">
              <button className="booklist-menu-btn" onClick={() => setMenuOpen(menuOpen === i ? null : i)}>⋯</button>
              {menuOpen === i && <div className="booklist-dropdown"><button className="booklist-dropdown-item" onClick={() => onGenerate(book)}>✨ AI 이미지 생성하기</button></div>}
            </div>
          </div>
        ))}
      </div>
      <div className="nav-bar"><button className="btn-outline" onClick={onBack}>이전</button><button className="btn-primary" disabled>다음</button></div>
    </div>
  );
}

// ─── 감성 키워드 선택 (이모지 + 라벨) ───
function PageMoodSelect({ stepNum, title, subtitle, book, items, selected, onSelect, onBack, onNext }) {
  return (
    <div className="page-full">
      {book && <div className="book-banner"><span style={{ fontSize: 18 }}>{book.cover}</span><div><div className="banner-title">{book.title}</div><div className="banner-author">{book.author}</div></div></div>}
      <div className="selection-header"><div className="step-badge">{stepNum}</div><div className="header-title">{title}</div><div className="header-sub">{subtitle}</div></div>
      <div className="chip-grid">
        {items.map((item) => {
          const isSel = selected?.label === item.label;
          return (
            <button key={item.label} className={`chip ${isSel ? "selected" : ""}`} onClick={() => onSelect(item)}>
              <span className="chip-emoji">{item.emoji}</span> {item.label}
            </button>
          );
        })}
      </div>
      <div className="nav-bar">
        <button className="btn-outline" onClick={onBack}>이전</button>
        <button className="btn-primary" onClick={onNext} disabled={!selected} style={{ opacity: selected ? 1 : 0.4 }}>다음</button>
      </div>
    </div>
  );
}

// ─── 웹 전용: 자연어 텍스트 입력 ───
function PageTextInput({ book, text, setText, onBack, onNext }) {
  return (
    <div className="page-full">
      {book && <div className="book-banner"><span style={{ fontSize: 18 }}>{book.cover}</span><div><div className="banner-title">{book.title}</div><div className="banner-author">{book.author}</div></div></div>}
      <div className="selection-header">
        <div className="step-badge">선택 입력</div>
        <div className="header-title">한 줄로 남겨주세요</div>
        <div className="header-sub">이 책을 읽으며 느낀 감상을 자유롭게 적어주세요 (선택)</div>
      </div>
      <div className="text-input-area">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예) 현실적이면서도 따뜻한 조언이 마음에 남았어요"
          className="text-input"
          maxLength={200}
        />
        <p className="text-counter">{text.length}/200</p>
        <div className="text-notice">
          <span className="text-notice-icon">ℹ️</span>
          <span>입력하신 감상은 데이터 분석용으로만 활용되며, 이미지 생성에 직접 반영되지 않습니다.</span>
        </div>
      </div>
      <div className="nav-bar">
        <button className="btn-outline" onClick={onBack}>이전</button>
        <button className="btn-primary" onClick={onNext}>
          {text.trim() ? "다음" : "건너뛰기"}
        </button>
      </div>
    </div>
  );
}

// ─── 범용 칩 선택 (스타일/장면/소품) ───
function PageChipSelect({ stepNum, title, subtitle, book, items, selected, onSelect, displayFn, keyFn, isSelected, multi, onBack, onNext, nextLabel = "다음", recommended, optional }) {
  const canProceed = optional || (multi ? true : !!selected);
  return (
    <div className="page-full">
      {book && <div className="book-banner"><span style={{ fontSize: 18 }}>{book.cover}</span><div><div className="banner-title">{book.title}</div><div className="banner-author">{book.author}</div></div></div>}
      <div className="selection-header"><div className="step-badge">{stepNum}</div><div className="header-title">{title}</div><div className="header-sub">{subtitle}</div></div>
      <div className="chip-grid">
        {items.map((item) => {
          const isSel = isSelected(item, selected);
          const isRec = recommended?.some((r) => item.label === r);
          return (
            <button key={keyFn(item)} className={`chip ${isSel ? "selected" : ""} ${isRec ? "recommended" : ""}`} onClick={() => onSelect(item)}>
              {displayFn(item)}
              {isRec && !isSel && <span className="chip-rec">추천</span>}
            </button>
          );
        })}
      </div>
      {multi && <p className="hint-text center">선택됨: {(selected?.length || 0)}/2{(selected?.length || 0) === 0 && " (선택 안해도 OK)"}</p>}
      <div className="nav-bar">
        <button className="btn-outline" onClick={onBack}>이전</button>
        <button className="btn-primary" onClick={onNext} disabled={!canProceed} style={{ opacity: canProceed ? 1 : 0.4 }}>{nextLabel}</button>
      </div>
    </div>
  );
}

// ─── 로딩 ───
function PageLoading({ book, mood }) {
  return (
    <div className="page-center">
      <div className="spinner" />
      <h3 className="loading-title">북무드 이미지 생성 중...</h3>
      <p className="loading-desc">{book?.title}의 분위기와<br />'{mood?.label}' 감정을 담고 있어요</p>
      <div className="progress-bar"><div className="progress-fill" /></div>
    </div>
  );
}

// ─── 결과 ───
function PageResult({ book, mood, style, scene, props, prompt, image, error, channel, onRetry, onReset }) {
  const allLabels = [mood?.label, style?.label, scene?.label, ...(props?.map((p) => p.label) || [])].filter(Boolean);
  const hash = allLabels.join("").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = hash % 360, h2 = (h1 + 80) % 360;

  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="page-full result-page">
      <h3 className="result-title">나의 북무드 이미지 ✨</h3>

      {error && (
        <div className="gen-error">
          <p>⚠️ {error}</p>
          <p className="gen-error-hint">다른 스타일로 다시 시도해보세요</p>
        </div>
      )}

      {image?.dataUrl ? (
        <div className="result-image-real">
          <img src={image.dataUrl} alt="AI 생성 북무드 이미지" className="result-img" />
        </div>
      ) : (
        <div className="result-image" style={{ background: `linear-gradient(135deg, hsl(${h1},40%,85%), hsl(${h2},35%,75%), hsl(${(h1 + 40) % 360},30%,65%))` }}>
          <span style={{ fontSize: 48 }}>{book?.cover}</span>
          <span className="result-book-title">{book?.title}</span>
          <div className="result-tags">{allLabels.map((t, i) => <span key={i} className="result-tag">{t}</span>)}</div>
          <span className="result-watermark">AI 생성 이미지 (시뮬레이션)</span>
        </div>
      )}

      <div className="result-summary-tags">
        {allLabels.map((t, i) => <span key={i} className="result-tag">{t}</span>)}
      </div>

      <div className="result-actions">
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
          if (image?.dataUrl) {
            const a = document.createElement("a");
            a.href = image.dataUrl;
            a.download = `bookmood-${book?.title || "image"}.png`;
            a.click();
          } else { alert("이미지가 생성되지 않았습니다 (시뮬레이션 모드)"); }
        }}>💾 저장</button>
        <button className="btn-kakao" style={{ flex: 1 }}>💬 카톡 공유</button>
      </div>

      <div className="feedback-row">
        <span className="feedback-label">이 이미지가 내 감정과 잘 맞나요?</span>
        <button className="feedback-btn" onClick={() => alert("👍 피드백 저장됨")}>👍</button>
        <button className="feedback-btn" onClick={() => alert("👎 피드백 저장됨")}>👎</button>
      </div>

      {channel === "web" && (
        <div className="recommend-section">
          <p className="recommend-title">📚 비슷한 분위기의 책</p>
          <p className="recommend-placeholder">감성 데이터 축적 후 추천이 활성화됩니다 (2차 고도화)</p>
        </div>
      )}

      <div className="result-actions">
        <button className="btn-outline" onClick={onRetry} style={{ flex: 1 }}>🔄 다시 생성</button>
        <button className="btn-outline" onClick={onReset} style={{ flex: 1 }}>🏠 처음으로</button>
      </div>

      <button className="prompt-toggle" onClick={() => setShowPrompt(!showPrompt)}>
        {showPrompt ? "프롬프트 숨기기" : "🔧 생성된 프롬프트 보기 (개발용)"}
      </button>
      {showPrompt && prompt && (
        <div className="prompt-debug">
          <p className="prompt-debug-label">Gemini Prompt:</p>
          <pre className="prompt-debug-text">{prompt.prompt}</pre>
          <p className="prompt-debug-label" style={{ marginTop: 8 }}>Meta (로그용):</p>
          <pre className="prompt-debug-text">{JSON.stringify(prompt.meta, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ─── 도서 카드 ───
function BookCard({ book, onClick, showTags }) {
  return (
    <button className="book-card" onClick={onClick}>
      <div className="book-card-cover"><span>{book.cover}</span></div>
      <div className="book-card-info">
        <div className="book-card-title">{book.title}</div>
        <div className="book-card-author">{book.author} · {book.category}</div>
        {showTags && book.tags && <div className="tag-row" style={{ marginTop: 4 }}>{book.tags.slice(0, 3).map((t) => <span key={t} className="tag">#{t}</span>)}</div>}
      </div>
      <span className="book-card-arrow">›</span>
    </button>
  );
}

export default App;