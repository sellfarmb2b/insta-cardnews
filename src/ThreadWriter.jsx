import { useState, useCallback, useEffect } from "react";

const THREAD_CATEGORIES = [
  { id: "economy", label: "경제/비즈니스", icon: "💼", color: "#4f46e5" },
  { id: "investment", label: "재테크", icon: "💰", color: "#059669" },
  { id: "realestate", label: "부동산", icon: "🏠", color: "#d97706" },
  { id: "stock", label: "주식", icon: "📈", color: "#dc2626" },
];

const THREAD_TONES = [
  { id: "insight", label: "인사이트", desc: "깊이 있는 분석" },
  { id: "news", label: "뉴스 정리", desc: "핵심만 간결하게" },
  { id: "tip", label: "실전 팁", desc: "바로 써먹는 정보" },
  { id: "opinion", label: "개인 의견", desc: "의견+근거" },
];

const THREAD_LENGTHS = [
  { id: "short", label: "짧게", posts: "3-5개", desc: "핵심만" },
  { id: "medium", label: "보통", posts: "5-8개", desc: "적당한 깊이" },
  { id: "long", label: "길게", posts: "8-12개", desc: "심층 분석" },
];

export default function ThreadWriter({ apiKey }) {
  const [step, setStep] = useState(0); // 0=input, 1=loading, 2=preview
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("economy");
  const [tone, setTone] = useState("insight");
  const [length, setLength] = useState("medium");
  const [threads, setThreads] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [evalScore, setEvalScore] = useState(null);

  const generateDemoThreads = (topicText, cat, toneId, len) => {
    const catLabel = THREAD_CATEGORIES.find(c => c.id === cat)?.label || "경제";
    const count = len === "short" ? 4 : len === "medium" ? 6 : 10;
    const posts = [];

    posts.push({
      id: 1,
      type: "hook",
      text: `솔직히 ${topicText} 얘기 요즘 너무 많은데\n\n진짜 중요한 건 아무도 안 알려줌\n\n내가 직접 파본 거 공유함`,
    });

    const bodies = [
      `1/ 일단 지금 상황부터 보면\n\n${topicText} 쪽이 예전이랑 완전 달라짐\n\n숫자만 봐도 느껴지는데\n작년 이맘때랑 비교하면 흐름 자체가 바뀜`,
      `2/ 근데 사람들이 잘 모르는 게 있음\n\n${catLabel} 쪽에서 ${topicText} 이슈가 커진 건\n단순히 유행이 아니라\n구조 자체가 바뀌고 있어서임\n\n이게 핵심`,
      `3/ 내 주변에서 실제로 있던 일인데\n\n이걸 빨리 캐치한 사람은 이미 움직였고\n늦은 사람은 지금 후회하는 중\n\n타이밍이 진짜 중요함`,
      `4/ 근데 여기서 함정이 있음\n\n다들 "지금 해야 하나?" 물어보는데\n\n솔직히 답 없음\n중요한 건 지금이 아니라\n본인 상황에 맞는지가 먼저`,
      `5/ 내가 보는 관점은 이거임\n\n- 단기로 보면 변동 큼\n- 근데 6개월~1년 보면 방향은 나옴\n- 지금은 공부할 타이밍\n\n조급하면 무조건 손해봄`,
      `6/ 자주 하는 실수 3가지\n\n① 남들 한다고 따라감\n② 한 곳에 몰빵\n③ 뉴스 헤드라인만 보고 판단\n\n이 3개만 안 해도 상위 30%`,
      `7/ 그래서 나는 이렇게 하고 있음\n\n복잡하게 안 함\n\n기본만 지키되\n변할 때 빨리 알아챌 수 있게\n정보 루틴을 깔아놓는 게 핵심`,
      `8/ 요약하면\n\n${topicText}은 지금 무시하면 안 되는 흐름이고\n근데 조급하게 접근하면 더 위험\n\n차분하게 공부하면서\n자기 기준을 잡는 게 최선`,
    ];

    for (let i = 0; i < count - 2; i++) {
      posts.push({
        id: i + 2,
        type: "body",
        text: bodies[i % bodies.length],
      });
    }

    posts.push({
      id: count,
      type: "cta",
      text: `도움 됐으면 리포스트 한번만\n\n이런 글 매일 올리고 있으니까\n팔로우 해두면 타임라인에서 볼 수 있음\n\n${catLabel} 관련 궁금한 거 댓글로 남겨줘`,
    });

    return posts;
  };

  const callClaudeForThreads = async (topicText, cat, toneId, len) => {
    const catLabel = THREAD_CATEGORIES.find(c => c.id === cat)?.label || "경제";
    const toneLabel = THREAD_TONES.find(t => t.id === toneId)?.label || "인사이트";
    const count = len === "short" ? "3-5" : len === "medium" ? "5-8" : "8-12";

    const prompt = `당신은 스레드(Threads)에 ${catLabel} 글을 쓰는 실제 사람입니다. AI가 아닙니다.

주제: "${topicText}"
카테고리: ${catLabel}
톤: ${toneLabel}
글 수: ${count}개

아래 JSON 형식으로만 응답하세요:

{
  "posts": [
    { "id": 1, "type": "hook", "text": "첫 번째 글" },
    { "id": 2, "type": "body", "text": "본문 글" },
    ...
    { "id": N, "type": "cta", "text": "마지막 CTA 글" }
  ],
  "score": 8.5
}

필수 문체 규칙 (가장 중요):
- 반말 또는 ~임/~함/~인듯/~해봄 체를 사용. "~합니다", "~입니다" 절대 사용 금지
- "핵심 포인트", "정리했습니다", "살펴보겠습니다" 같은 AI 냄새 나는 표현 금지
- 실제 2030이 스레드에 쓰는 것처럼. 짧은 문장. 줄바꿈 많이
- "솔직히", "근데", "진짜", "ㄹㅇ", "개인적으론" 같은 구어체 자연스럽게 섞기
- 한 문장은 15자 이내가 이상적. 길어도 25자 넘기지 않기
- 이모티콘/이모지 절대 사용 금지. 텍스트만 사용. 하나도 쓰지 말 것
- "많은 분들이", "중요합니다", "~할 수 있습니다" = AI 티나는 표현. 절대 쓰지 말 것

구조 규칙:
- 첫 글(hook): 호기심 유발. 뻔한 정보 나열 X, 궁금증 유발
- 이모티콘/이모지 절대 사용 금지. 글자와 줄바꿈만으로 구성
- 본문(body): 번호(1/, 2/...)로 시작. 각 280자 이내. 개인 경험/의견 섞기
- 마지막(cta): 자연스러운 팔로우/리포 유도. "도움 됐으면 리포 한번만" 같은 톤
- score는 1-10점 (후킹력, 자연스러움, 전문성, CTA 자연스러움 기준)

나쁜 예: "금리 인상이 부동산 시장에 미치는 영향을 분석해보겠습니다"
좋은 예: "금리 올랐는데 집값은 왜 안 떨어짐?\n\n이유 찾아봤는데 생각보다 단순함"`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API 오류 (${response.status})`);
    }

    const data = await response.json();
    const text = data.content[0].text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    return JSON.parse(jsonMatch[1].trim());
  };

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setStep(1);

    if (apiKey) {
      try {
        setLoadingMsg("AI가 스레드를 작성하고 있습니다...");
        const result = await callClaudeForThreads(topic, category, tone, length);
        setThreads(result.posts || []);
        setEvalScore(result.score || null);
      } catch (err) {
        console.error("Thread API error:", err);
        setLoadingMsg("API 오류 — 데모 모드로 전환...");
        await new Promise(r => setTimeout(r, 1000));
        setThreads(generateDemoThreads(topic, category, tone, length));
        setEvalScore(7.5);
      }
    } else {
      setLoadingMsg("스레드를 생성하고 있습니다... (데모 모드)");
      await new Promise(r => setTimeout(r, 600));
      setThreads(generateDemoThreads(topic, category, tone, length));
      setEvalScore(7.5);
    }
    setStep(2);
  }, [topic, category, tone, length, apiKey]);

  const updatePost = (idx, newText) => {
    setThreads(prev => prev.map((p, i) => i === idx ? { ...p, text: newText } : p));
  };

  const copyAll = () => {
    const text = threads.map(p => p.text).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    alert("전체 스레드가 클립보드에 복사되었습니다!");
  };

  const copySingle = (idx) => {
    navigator.clipboard.writeText(threads[idx].text);
  };

  const catColor = THREAD_CATEGORIES.find(c => c.id === category)?.color || "#4f46e5";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px" }}>

      {/* Step 0: Input */}
      {step === 0 && (
        <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Topic */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>주제 입력</label>
            <input
              value={topic} onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()}
              placeholder="예: 2026 하반기 금리 전망, 비트코인 반감기 영향, 강남 재건축..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = catColor}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Category */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>카테고리</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {THREAD_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  style={{
                    padding: "12px 8px", borderRadius: 12, border: category === c.id ? `2px solid ${c.color}` : "2px solid #e5e7eb",
                    background: category === c.id ? `${c.color}10` : "#fff", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.15s",
                  }}>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: category === c.id ? c.color : "#888" }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone + Length */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>톤</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {THREAD_TONES.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)}
                    className={`btn-3d ${tone === t.id ? "btn-3d-pressed" : ""}`}
                    style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 200px", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>길이</label>
              <div style={{ display: "flex", gap: 6 }}>
                {THREAD_LENGTHS.map(l => (
                  <button key={l.id} onClick={() => setLength(l.id)}
                    className={`btn-3d ${length === l.id ? "btn-3d-pressed" : ""}`}
                    style={{ fontSize: "0.75rem", padding: "6px 12px", flex: 1 }}>
                    {l.label}<br /><span style={{ fontSize: "0.65rem", opacity: 0.6 }}>{l.posts}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate */}
          <button
            className={`btn-3d ${topic.trim() ? "btn-3d-primary" : ""}`}
            onClick={generate}
            disabled={!topic.trim()}
            style={{ width: "100%", padding: "0.65em 1.5em", fontSize: "0.95rem", cursor: topic.trim() ? "pointer" : "not-allowed", opacity: topic.trim() ? 1 : 0.5 }}
          >
            스레드 생성하기
            <span style={{ marginLeft: 8, fontSize: "0.7rem", padding: "2px 8px", borderRadius: 10, background: apiKey ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)", color: apiKey ? "#d1fae5" : "#fef3c7" }}>
              {apiKey ? "AI 모드" : "데모 모드"}
            </span>
          </button>
        </div>
      )}

      {/* Step 1: Loading */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#333", marginBottom: 24 }}>Threads</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 6 }}>{loadingMsg}</div>
          <div style={{ fontSize: 11, color: "#aaa" }}>잠시만 기다려주세요</div>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>스레드 미리보기</span>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: `${catColor}15`, color: catColor, fontWeight: 600 }}>
                {THREAD_CATEGORIES.find(c => c.id === category)?.label}
              </span>
              {evalScore && (
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: evalScore >= 7 ? "#f0fdf4" : "#fef3c7", color: evalScore >= 7 ? "#059669" : "#d97706", fontWeight: 700 }}>
                  평가 {evalScore}/10
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: "#bbb" }}>{threads.length}개 글</span>
          </div>

          {/* Thread posts */}
          {threads.map((post, idx) => (
            <div key={post.id} style={{
              background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              borderLeft: post.type === "hook" ? `4px solid ${catColor}` : post.type === "cta" ? "4px solid #059669" : "4px solid transparent",
            }}>
              {/* Post header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>
                    {post.type === "hook" ? "🪝" : post.type === "cta" ? "📢" : idx}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#aaa" }}>
                    {post.type === "hook" ? "후킹" : post.type === "cta" ? "CTA" : `본문 ${idx}`}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                    style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: editingIdx === idx ? "#eef2ff" : "#fff", color: editingIdx === idx ? "#4f46e5" : "#888", cursor: "pointer" }}>
                    {editingIdx === idx ? "완료" : "편집"}
                  </button>
                  <button onClick={() => copySingle(idx)}
                    style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#888", cursor: "pointer" }}>
                    복사
                  </button>
                </div>
              </div>

              {/* Post content */}
              {editingIdx === idx ? (
                <textarea
                  value={post.text}
                  onChange={e => updatePost(idx, e.target.value)}
                  style={{ width: "100%", minHeight: 120, padding: 12, borderRadius: 10, border: "1.5px solid #4f46e5", fontSize: 14, lineHeight: 1.7, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              ) : (
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "#222", whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                  {post.text}
                </div>
              )}

              {/* Character count */}
              <div style={{ textAlign: "right", marginTop: 6, fontSize: 10, color: post.text.length > 280 ? "#dc2626" : "#ccc" }}>
                {post.text.length}/280
              </div>
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-3d" onClick={() => { setStep(0); setThreads([]); setEvalScore(null); }}
              style={{ fontSize: "0.8rem" }}>
              ← 처음부터
            </button>
            <button className="btn-3d" onClick={generate} style={{ fontSize: "0.8rem" }}>
              🔄 재생성
            </button>
            <button className="btn-3d btn-3d-primary" onClick={copyAll}
              style={{ flex: 1, fontSize: "0.85rem" }}>
              📋 전체 복사 ({threads.length}개)
            </button>
          </div>

          {/* CSV export */}
          <button className="btn-3d btn-3d-green" style={{ width: "100%", fontSize: "0.85rem", padding: "0.6em 1.5em" }}
            onClick={() => {
              const csv = "\uFEFF" + "순서,유형,내용,글자수\n" +
                threads.map(p => `${p.id},"${p.type}","${p.text.replace(/"/g, '""')}",${p.text.length}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `thread-${topic.slice(0,10)}.csv`;
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
            }}>
            📥 CSV 내보내기
          </button>
        </div>
      )}
    </div>
  );
}
