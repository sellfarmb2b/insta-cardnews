import { useState, useCallback, useEffect, useRef } from "react";

/* ——— CSS Styles ——— */
const GLOBAL_CSS = `
/* —————— Hand Tapping Loader (Uiverse.io) —————— */
.hand-loader {
  --skin-color: #E4C560;
  --tap-speed: 0.6s;
  --tap-stagger: 0.1s;
  position: relative;
  width: 80px;
  height: 60px;
  margin-left: 80px;
}
.hand-loader:before {
  content: '';
  display: block;
  width: 180%;
  height: 75%;
  position: absolute;
  top: 70%;
  right: 20%;
  background-color: black;
  border-radius: 40px 10px;
  filter: blur(10px);
  opacity: 0.3;
}
.hand-palm {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--skin-color);
  border-radius: 10px 40px;
}
.hand-thumb {
  position: absolute;
  width: 120%;
  height: 38px;
  background-color: var(--skin-color);
  bottom: -18%;
  right: 1%;
  transform-origin: calc(100% - 20px) 20px;
  transform: rotate(-20deg);
  border-radius: 30px 20px 20px 10px;
  border-bottom: 2px solid rgba(0,0,0,0.1);
  border-left: 2px solid rgba(0,0,0,0.1);
}
.hand-thumb:after {
  width: 20%;
  height: 60%;
  content: '';
  background-color: rgba(255,255,255,0.3);
  position: absolute;
  bottom: -8%;
  left: 5px;
  border-radius: 60% 10% 10% 30%;
  border-right: 2px solid rgba(0,0,0,0.05);
}
.hand-finger {
  position: absolute;
  width: 80%;
  height: 35px;
  background-color: var(--skin-color);
  bottom: 32%;
  right: 64%;
  transform-origin: 100% 20px;
  animation-duration: calc(var(--tap-speed) * 2);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform: rotate(10deg);
}
.hand-finger:before {
  content: '';
  position: absolute;
  width: 140%;
  height: 30px;
  background-color: var(--skin-color);
  bottom: 8%;
  right: 65%;
  transform-origin: calc(100% - 20px) 20px;
  transform: rotate(-60deg);
  border-radius: 20px;
}
.hand-finger:nth-child(1) { animation-delay: 0; filter: brightness(70%); animation-name: tap-upper-1; }
.hand-finger:nth-child(2) { animation-delay: var(--tap-stagger); filter: brightness(80%); animation-name: tap-upper-2; }
.hand-finger:nth-child(3) { animation-delay: calc(var(--tap-stagger)*2); filter: brightness(90%); animation-name: tap-upper-3; }
.hand-finger:nth-child(4) { animation-delay: calc(var(--tap-stagger)*3); filter: brightness(100%); animation-name: tap-upper-4; }

@keyframes tap-upper-1 { 0%,50%,100%{transform:rotate(10deg) scale(0.4)} 40%{transform:rotate(50deg) scale(0.4)} }
@keyframes tap-upper-2 { 0%,50%,100%{transform:rotate(10deg) scale(0.6)} 40%{transform:rotate(50deg) scale(0.6)} }
@keyframes tap-upper-3 { 0%,50%,100%{transform:rotate(10deg) scale(0.8)} 40%{transform:rotate(50deg) scale(0.8)} }
@keyframes tap-upper-4 { 0%,50%,100%{transform:rotate(10deg) scale(1)} 40%{transform:rotate(50deg) scale(1)} }

/* —————— 3D Buttons —————— */
.btn-3d {
  font-family: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 0.5em;
  font-size: 0.85rem;
  padding: 0.5em 1.2em;
  font-weight: 600;
  white-space: nowrap;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.15s ease;
  cursor: pointer;
}
.btn-3d:active {
  translate: 0 0.225em;
  box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
}
.btn-3d-pressed {
  translate: 0 0.3em;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 0.03em 0 0 #e0e0e0;
  background-color: #e2e2e2 !important;
  color: #333 !important;
  text-shadow: none !important;
}
.btn-3d-primary {
  background-color: #4f46e5;
  color: #fff;
  text-shadow: 0 0.0625em 0 rgba(0,0,0,0.2);
  box-shadow: inset 0 0.0625em 0 0 #6366f1, 0 0.0625em 0 0 #4338ca,
    0 0.125em 0 0 #3730a3, 0 0.25em 0 0 #312e81, 0 0.3125em 0 0 #2e2a7a,
    0 0.375em 0 0 #2b2773, 0 0.425em 0 0 #28246c, 0 0.425em 0.5em 0 rgba(79,70,229,0.4);
}
.btn-3d-primary:active {
  box-shadow: inset 0 0.03em 0 0 #6366f1, 0 0.03em 0 0 #4338ca,
    0 0.0625em 0 0 #3730a3, 0 0.125em 0 0 #312e81, 0 0.125em 0 0 #2e2a7a,
    0 0.2em 0 0 #2b2773, 0 0.225em 0 0 #28246c, 0 0.225em 0.375em 0 rgba(79,70,229,0.3);
}
.btn-3d-green {
  background-color: #059669;
  color: #fff;
  text-shadow: 0 0.0625em 0 rgba(0,0,0,0.2);
  box-shadow: inset 0 0.0625em 0 0 #10b981, 0 0.0625em 0 0 #047857,
    0 0.125em 0 0 #065f46, 0 0.25em 0 0 #064e3b, 0 0.3125em 0 0 #054436,
    0 0.375em 0 0 #043b31, 0 0.425em 0 0 #03322c, 0 0.425em 0.5em 0 rgba(5,150,105,0.4);
}
.btn-3d-green:active {
  box-shadow: inset 0 0.03em 0 0 #10b981, 0 0.03em 0 0 #047857,
    0 0.0625em 0 0 #065f46, 0 0.125em 0 0 #064e3b, 0 0.125em 0 0 #054436,
    0 0.2em 0 0 #043b31, 0 0.225em 0 0 #03322c, 0 0.225em 0.375em 0 rgba(5,150,105,0.3);
}

/* —————— Toggle Switch —————— */
.toggle-switch input[type="checkbox"] {
  background-image: linear-gradient(rgba(0,0,0,0.1), rgba(255,255,255,0.1)),
                    linear-gradient(to right, #f66 50%, #6cf 50%);
  background-size: 100% 100%, 200% 100%;
  background-position: 0 0, 15px 0;
  border-radius: 25px;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.5),
              inset 0 0 10px rgba(0,0,0,0.5),
              0 0 0 1px rgba(0,0,0,0.1),
              0 -1px 2px 2px rgba(0,0,0,0.25),
              0 2px 2px 2px rgba(255,255,255,0.75);
  cursor: pointer;
  height: 25px;
  padding-right: 25px;
  width: 75px;
  -webkit-appearance: none;
  appearance: none;
  transition: 0.25s;
  border: none;
  outline: none;
}
.toggle-switch input[type="checkbox"]:after {
  background-color: #eee;
  background-image: linear-gradient(rgba(255,255,255,0.1), rgba(0,0,0,0.1));
  border-radius: 25px;
  box-shadow: inset 0 1px 1px 1px rgba(255,255,255,1),
              inset 0 -1px 1px 1px rgba(0,0,0,0.25),
              0 1px 3px 1px rgba(0,0,0,0.5),
              0 0 2px rgba(0,0,0,0.25);
  content: '';
  display: block;
  height: 25px;
  width: 50px;
}
.toggle-switch input[type="checkbox"]:checked {
  background-position: 0 0, 35px 0;
  padding-left: 25px;
  padding-right: 0;
}

/* —————— Radio Menu —————— */
.radio-menu {
  padding: 0.4rem;
  background-color: #fff;
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 15px;
  box-shadow: 0 10px 25px 0 rgba(0,0,0,0.075);
}
.radio-link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 44px;
  border-radius: 8px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transform-origin: center left;
  transition: width 0.2s ease-in, background 0.2s;
  cursor: pointer;
  border: none;
  background: transparent;
  font-family: inherit;
  color: inherit;
  padding: 0;
}
.radio-link:before {
  position: absolute;
  z-index: -1;
  content: "";
  display: block;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  top: 0;
  transform: translateX(100%);
  transition: transform 0.2s ease-in;
  transform-origin: center right;
  background-color: #eee;
}
.radio-link:hover:before {
  transform: translateX(0);
}
.radio-link:hover {
  width: 120px;
}
.radio-link.active {
  background: #eef2ff;
  border-radius: 8px;
  box-shadow: inset 0 0 0 2px #4f46e5;
}
.radio-link .link-icon {
  width: 22px;
  height: 22px;
  display: block;
  flex-shrink: 0;
  left: 14px;
  position: absolute;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
}
.radio-link .link-title {
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.2s ease-in, opacity 0.15s;
  transform-origin: center right;
  display: block;
  text-align: center;
  text-indent: 22px;
  width: 100%;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.radio-link:hover .link-title {
  transform: translateX(0);
  opacity: 1;
}

/* —————— Misc —————— */
.card-scroll::-webkit-scrollbar { height: 4px; }
.card-scroll::-webkit-scrollbar-track { background: transparent; }
.card-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
.card-scroll::-webkit-scrollbar-thumb:hover { background: #bbb; }

/* —————— Card Modal —————— */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  animation: modal-fade-in 0.2s ease-out;
}
@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-card-wrapper {
  animation: modal-scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes modal-scale-in {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
.modal-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 20px; font-weight: 300;
  transition: background 0.15s, transform 0.15s;
  backdrop-filter: blur(4px);
}
.modal-arrow:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-50%) scale(1.1);
}
.modal-arrow:active {
  transform: translateY(-50%) scale(0.95);
}
.modal-arrow-left { left: 20px; }
.modal-arrow-right { right: 20px; }
.modal-close {
  position: absolute; top: 16px; right: 20px;
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.6); font-size: 28px; font-weight: 300;
  transition: color 0.15s;
  line-height: 1;
}
.modal-close:hover { color: #fff; }
.modal-edit-btn {
  margin-top: 16px; padding: 10px 24px;
  border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  color: #fff; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  backdrop-filter: blur(4px);
}
.modal-edit-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 0.4s ease-out forwards; }

/* —————— Mobile Styles —————— */
@media (max-width: 640px) {
  .mobile-grid-2 { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px !important; }
  .mobile-stack { flex-direction: column !important; }
  .mobile-full { width: 100% !important; min-width: 0 !important; flex: 1 1 100% !important; }
  .mobile-hide { display: none !important; }

  .radio-menu { flex-wrap: wrap; gap: 4px; justify-content: flex-start; }
  .radio-link { width: auto !important; min-width: 44px; height: 38px; display: inline-flex !important; align-items: center !important; gap: 0 !important; padding: 0 10px !important; }
  .radio-link .link-icon { position: static !important; left: auto !important; flex-shrink: 0; }
  .radio-link .link-title { display: none !important; }
  .radio-link.active .link-title {
    display: inline-block !important;
    opacity: 1 !important;
    transform: none !important;
    text-indent: 0 !important;
    margin-left: 4px;
    font-size: 11px;
    width: auto !important;
  }
  .radio-link:hover { width: auto !important; }
  .radio-link:hover .link-title { display: none !important; }

  .modal-arrow { width: 36px; height: 36px; font-size: 18px; }
  .modal-arrow-left { left: 8px; }
  .modal-arrow-right { right: 8px; }
  .modal-close { top: 10px; right: 12px; font-size: 24px; }
}

/* —————— Bottom Sheet —————— */
.bottom-sheet-overlay {
  position: fixed; inset: 0; z-index: 900;
  background: rgba(0,0,0,0.4);
  animation: modal-fade-in 0.15s ease-out;
}
.bottom-sheet {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 901;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 20px 16px 32px;
  max-height: 70vh; overflow-y: auto;
  animation: sheet-up 0.3s cubic-bezier(0.32,0.72,0,1);
  box-shadow: 0 -4px 30px rgba(0,0,0,0.15);
}
@keyframes sheet-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.bottom-sheet-handle {
  width: 36px; height: 4px; border-radius: 2px;
  background: #ddd; margin: 0 auto 16px;
}

/* —————— Mobile Card Swiper —————— */
.mobile-swiper {
  display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; gap: 12px; padding: 8px 4px 16px;
}
.mobile-swiper::-webkit-scrollbar { display: none; }
.mobile-swiper-card { scroll-snap-align: center; flex-shrink: 0; }

/* —————— Mobile Full-Screen Viewer —————— */
.mobile-viewer {
  position: fixed; inset: 0; z-index: 1000;
  background: #000; display: flex; flex-direction: column;
  animation: modal-fade-in 0.2s ease-out;
}
.mobile-viewer-cards {
  flex: 1; display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
}
.mobile-viewer-cards::-webkit-scrollbar { display: none; }
.mobile-viewer-slide {
  min-width: 100%; scroll-snap-align: center;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.mobile-viewer-bar {
  padding: 12px 16px 28px;
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}
`;

const CATEGORIES = [
  { id: "news", label: "뉴스/트렌드", icon: "📰" },
  { id: "education", label: "교육/정보", icon: "📚" },
  { id: "marketing", label: "마케팅", icon: "📢" },
  { id: "lifestyle", label: "라이프스타일", icon: "🌿" },
];

const STYLES = [
  { id: "varo", label: "뉴스형", desc: "이미지+하단 텍스트", gradient: "linear-gradient(180deg,#4a6741 0%,#1a1a1a 100%)" },
  { id: "moond", label: "매거진형", desc: "이미지+오버레이", gradient: "linear-gradient(135deg,#8B6914 0%,#2a1a0a 100%)" },
  { id: "poly", label: "볼드형", desc: "배지+대형 텍스트", gradient: "linear-gradient(180deg,#1a3a5c 0%,#0a0a1a 100%)" },
  { id: "minimal", label: "미니멀", desc: "단순+타이포", gradient: "linear-gradient(135deg,#fafafa,#e8e8e8)" },
];

const CARD_COUNTS = [5, 7, 10];

const AWARENESS_LEVELS = [
  { id: "unaware", label: "무인지", desc: "문제를 모름" },
  { id: "problem-aware", label: "문제인지", desc: "문제는 알지만 해결책 모름" },
  { id: "solution-aware", label: "솔루션인지", desc: "해결책은 알지만 제품 모름" },
  { id: "product-aware", label: "제품인지", desc: "제품은 알지만 확신 없음" },
];

const ANGLE_TYPES = [
  { id: "empathy", label: "공감", icon: "💛", desc: "타겟의 감정에 공감하는 접근" },
  { id: "fear", label: "공포", icon: "😨", desc: "놓치면 안 되는 위기감 자극" },
  { id: "benefit", label: "이익", icon: "💰", desc: "얻을 수 있는 혜택 강조" },
  { id: "convenience", label: "편의", icon: "✨", desc: "쉽고 간편한 해결 방법" },
  { id: "social-proof", label: "사회증거", icon: "👥", desc: "다른 사람들의 경험/수치" },
];

// Simulated photo backgrounds for preview
const PHOTO_BG = [
  "linear-gradient(135deg,#3a4a3a 0%,#6a8a5a 40%,#4a6a4a 100%)",
  "linear-gradient(135deg,#4a5568 0%,#718096 50%,#2d3748 100%)",
  "linear-gradient(135deg,#5a4a3a 0%,#8a7a6a 40%,#3a2a1a 100%)",
  "linear-gradient(135deg,#2d4a6a 0%,#4a7a9a 40%,#1a3a5a 100%)",
  "linear-gradient(135deg,#6a4a5a 0%,#9a7a8a 40%,#4a2a3a 100%)",
  "linear-gradient(135deg,#4a6a5a 0%,#7a9a8a 40%,#2a4a3a 100%)",
  "linear-gradient(135deg,#5a5a4a 0%,#8a8a7a 40%,#3a3a2a 100%)",
  "linear-gradient(135deg,#3a5a6a 0%,#6a8a9a 40%,#1a3a4a 100%)",
  "linear-gradient(135deg,#6a5a3a 0%,#9a8a6a 40%,#4a3a1a 100%)",
  "linear-gradient(135deg,#4a3a5a 0%,#7a6a8a 40%,#2a1a3a 100%)",
];

const COLOR_PALETTES = {
  varo: PHOTO_BG,
  moond: PHOTO_BG,
  poly: PHOTO_BG,
  minimal: ["#111", "#fafafa", "#f5f5f5", "#eaeaea", "#f0f0f0", "#fafafa", "#f5f5f5", "#eaeaea", "#f0f0f0", "#111"],
};

// —— Background media layer ——
function CardBgImage({ imageUrl, mediaType }) {
  if (!imageUrl) return null;
  const isVideo = mediaType === "video" || /\.(mp4|webm|mov)$/i.test(imageUrl);
  const style = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 };
  if (isVideo) return <video src={imageUrl} style={style} autoPlay loop muted playsInline />;
  return <img src={imageUrl} alt="" style={style} />;
}

// —— Card Preview (4:5 = 172x215) ——
function CardPreview({ card, styleId, isSelected, onClick }) {
  const idx = (card.cardNumber - 1) % PHOTO_BG.length;
  const photoBg = PHOTO_BG[idx];
  const hasImage = !!card.imageUrl;

  const base = {
    width: 172, height: 215, borderRadius: 14, overflow: "hidden",
    position: "relative", display: "flex", flexDirection: "column",
    boxShadow: isSelected ? "0 8px 30px rgba(79,70,229,0.3), 0 0 0 2.5px #4f46e5" : "0 2px 12px rgba(0,0,0,0.08)",
    transform: isSelected ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
  };

  // ★ VARO (@varo_magazine) style ★
  if (styleId === "varo") {
    return (
      <div onClick={onClick} style={{ cursor: "pointer", flexShrink: 0, scrollSnapAlign: "start" }}>
        <div style={{ ...base, background: photoBg, justifyContent: "flex-end", padding: 0 }}>
          <CardBgImage imageUrl={card.imageUrl} mediaType={card.mediaType} />
          {/* Simulated photo noise */}
          {!hasImage && <div style={{ position: "absolute", inset: 0, opacity: 0.08, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)" }} />}
          {/* Watermark */}
          <div style={{ position: "absolute", top: 10, left: 10, fontSize: 7, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>@cardnews</div>
          {/* Bottom gradient */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />
          {/* Text */}
          <div style={{ position: "relative", padding: "0 12px 24px", zIndex: 1 }}>
            {card.type === "cover" && (
              <>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", lineHeight: 1.3, letterSpacing: -0.5, wordBreak: "keep-all" }}>{card.headline}</div>
                {card.subtext && <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{card.subtext}</div>}
              </>
            )}
            {card.type === "content" && (
              <>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.3, letterSpacing: -0.3, wordBreak: "keep-all" }}>{card.headline}</div>
                {card.body && <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.55)", marginTop: 3, lineHeight: 1.5 }}>{card.body.length > 55 ? card.body.slice(0, 55) + "..." : card.body}</div>}
              </>
            )}
            {card.type === "closing" && (
              <>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{card.cta || "더 알아보기"}</div>
                {card.hashtags && <div style={{ fontSize: 7, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{card.hashtags.slice(0,3).join(" ")}</div>}
              </>
            )}
          </div>
          {/* Engagement icons */}
          {card.type === "cover" && (
            <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", gap: 6, zIndex: 1 }}>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.5)" }}>♥ 243</span>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.5)" }}>💬 49</span>
            </div>
          )}
          {/* Page dots */}
          <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>
            {Array.from({ length: Math.min(card.totalCards, 8) }, (_, i) => (
              <div key={i} style={{ width: i === card.cardNumber - 1 ? 8 : 3, height: 3, borderRadius: 1.5, background: i === card.cardNumber - 1 ? "#fff" : "rgba(255,255,255,0.25)", transition: "all 0.2s" }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9.5, fontWeight: 600, color: isSelected ? "#4f46e5" : "#aaa" }}>
          {card.type === "cover" ? "표지" : card.type === "closing" ? "마무리" : `${card.cardNumber}p`}
        </div>
      </div>
    );
  }

  // ★ MOOND style ★
  if (styleId === "moond") {
    return (
      <div onClick={onClick} style={{ cursor: "pointer", flexShrink: 0, scrollSnapAlign: "start" }}>
        <div style={{ ...base, background: photoBg, justifyContent: "flex-end", padding: 0 }}>
          <CardBgImage imageUrl={card.imageUrl} mediaType={card.mediaType} />
          {!hasImage && <div style={{ position: "absolute", inset: 0, opacity: 0.06, background: "repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(255,255,255,0.02) 3px,rgba(255,255,255,0.02) 6px)" }} />}
          {/* Lighter overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
          {/* Bookmark icon */}
          {card.cardNumber <= 2 && (
            <div style={{ position: "absolute", top: 10, right: 10, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>★</div>
          )}
          {/* Text - left aligned, casual */}
          <div style={{ position: "relative", padding: "0 14px 22px", zIndex: 1 }}>
            {card.type === "cover" && (
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.25, letterSpacing: -0.5, wordBreak: "keep-all" }}>{card.headline}</div>
            )}
            {card.type === "content" && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3, wordBreak: "keep-all" }}>{card.headline}</div>
                {card.body && <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.5)", marginTop: 3, lineHeight: 1.5 }}>{card.body.length > 50 ? card.body.slice(0, 50) + "..." : card.body}</div>}
              </>
            )}
            {card.type === "closing" && (
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{card.cta || "더 알아보기"}</div>
            )}
          </div>
          {/* Watermark */}
          <div style={{ position: "absolute", bottom: 8, right: 10, fontSize: 7, color: "rgba(255,255,255,0.3)", fontStyle: "italic", zIndex: 1 }}>moond</div>
          <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>
            {Array.from({ length: Math.min(card.totalCards, 8) }, (_, i) => (
              <div key={i} style={{ width: i === card.cardNumber - 1 ? 8 : 3, height: 3, borderRadius: 1.5, background: i === card.cardNumber - 1 ? "#fff" : "rgba(255,255,255,0.2)", transition: "all 0.2s" }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9.5, fontWeight: 600, color: isSelected ? "#4f46e5" : "#aaa" }}>
          {card.type === "cover" ? "표지" : card.type === "closing" ? "마무리" : `${card.cardNumber}p`}
        </div>
      </div>
    );
  }

  // ★ POLY (Polymarket) style ★
  if (styleId === "poly") {
    const badgeColors = ["#e53e3e", "#dd6b20", "#38a169", "#3182ce", "#805ad5", "#d53f8c", "#e53e3e", "#dd6b20", "#38a169", "#3182ce"];
    const badgeTexts = ["TRENDING", "HOT", "BREAKING", "NEW", "INSIGHT", "ISSUE", "TRENDING", "HOT", "BREAKING", "NEW"];
    return (
      <div onClick={onClick} style={{ cursor: "pointer", flexShrink: 0, scrollSnapAlign: "start" }}>
        <div style={{ ...base, background: photoBg, justifyContent: "flex-end", padding: 0 }}>
          <CardBgImage imageUrl={card.imageUrl} mediaType={card.mediaType} />
          {!hasImage && <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "repeating-linear-gradient(90deg,transparent,transparent 1px,rgba(255,255,255,0.02) 1px,rgba(255,255,255,0.02) 3px)" }} />}
          {/* Logo area */}
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 4, zIndex: 1 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.8)" }} />
            <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>CardNews</span>
          </div>
          {/* Heavy gradient */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)" }} />
          {/* Badge + Giant text */}
          <div style={{ position: "relative", padding: "0 12px 22px", zIndex: 1 }}>
            {card.type !== "closing" && (
              <div style={{
                display: "inline-block", fontSize: 7, fontWeight: 800, padding: "2px 7px", borderRadius: 3, marginBottom: 6,
                background: badgeColors[idx], color: "#fff", letterSpacing: 1,
              }}>
                {card.type === "cover" ? badgeTexts[idx] : `0${card.cardNumber}`}
              </div>
            )}
            {card.type === "cover" && (
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: -0.5, textTransform: "uppercase", wordBreak: "keep-all" }}>
                {card.headline}
              </div>
            )}
            {card.type === "content" && (
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: -0.3, wordBreak: "keep-all" }}>
                {card.headline}
              </div>
            )}
            {card.type === "closing" && (
              <>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{card.cta || "MORE →"}</div>
                {card.hashtags && <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)" }}>{card.hashtags.slice(0,3).join(" ")}</div>}
              </>
            )}
          </div>
          <div style={{ position: "absolute", bottom: 5, right: 10, display: "flex", gap: 2 }}>
            {Array.from({ length: Math.min(card.totalCards, 8) }, (_, i) => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: i === card.cardNumber - 1 ? "#fff" : "rgba(255,255,255,0.3)", transition: "all 0.2s" }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9.5, fontWeight: 600, color: isSelected ? "#4f46e5" : "#aaa" }}>
          {card.type === "cover" ? "표지" : card.type === "closing" ? "마무리" : `${card.cardNumber}p`}
        </div>
      </div>
    );
  }

  // ★ MINIMAL style ★
  const isEdge = card.type === "cover" || card.type === "closing";
  const minBg = isEdge ? "#111" : card.bgColor || "#fafafa";
  const minTxt = isEdge ? "#fff" : "#111";
  const minSub = isEdge ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  return (
    <div onClick={onClick} style={{ cursor: "pointer", flexShrink: 0, scrollSnapAlign: "start" }}>
      <div style={{ ...base, background: minBg, justifyContent: "center", alignItems: "center", padding: 16 }}>
        {hasImage && isEdge && <CardBgImage imageUrl={card.imageUrl} mediaType={card.mediaType} />}
        {hasImage && isEdge && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 0 }} />}
        {card.type === "cover" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: 3, opacity: 0.35, color: minTxt }}>CARD NEWS</div>
            <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.25, color: minTxt, letterSpacing: -0.3 }}>{card.headline}</div>
            {card.subtext && <div style={{ fontSize: 8.5, color: minSub, lineHeight: 1.4 }}>{card.subtext}</div>}
            <div style={{ width: 24, height: 2, borderRadius: 1, marginTop: 4, background: "rgba(255,255,255,0.25)" }} />
          </div>
        )}
        {card.type === "content" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", position: "relative", width: "100%" }}>
            <div style={{ position: "absolute", top: -8, right: 0, fontSize: 44, fontWeight: 900, opacity: 0.05, color: minTxt, lineHeight: 1 }}>
              {String(card.cardNumber).padStart(2, "0")}
            </div>
            {card.accent && (
              <div style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: "rgba(0,0,0,0.06)", color: "#333" }}>{card.accent}</div>
            )}
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, color: minTxt }}>{card.headline}</div>
            {card.body && <div style={{ fontSize: 8, color: minSub, lineHeight: 1.6, padding: "0 4px", wordBreak: "keep-all" }}>{card.body.length > 65 ? card.body.slice(0, 65) + "..." : card.body}</div>}
          </div>
        )}
        {card.type === "closing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 18 }}>👋</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: minTxt }}>{card.cta || "더 알아보기"}</div>
            {card.hashtags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                {card.hashtags.slice(0, 3).map((t, i) => (
                  <span key={i} style={{ fontSize: 7, padding: "2px 5px", borderRadius: 3, background: "rgba(255,255,255,0.12)", color: minSub }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2.5 }}>
          {Array.from({ length: card.totalCards }, (_, i) => (
            <div key={i} style={{
              width: i === card.cardNumber - 1 ? 10 : 3.5, height: 3.5, borderRadius: 2,
              background: isEdge ? (i === card.cardNumber - 1 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.18)") : (i === card.cardNumber - 1 ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.08)"),
              transition: "all 0.2s",
            }} />
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 6, fontSize: 9.5, fontWeight: 600, color: isSelected ? "#4f46e5" : "#aaa" }}>
        {card.type === "cover" ? "표지" : card.type === "closing" ? "마무리" : `${card.cardNumber}p`}
      </div>
    </div>
  );
}

// —— Pipeline Progress (4 steps) ——
function PipelineProgress({ current }) {
  const steps = ["주제 분석", "앵글 생성", "카피 작성", "미리보기"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "12px 0 16px" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700,
            background: i < current ? "#10b981" : i === current ? "#4f46e5" : "#e5e7eb",
            color: i <= current ? "#fff" : "#aaa",
          }}>{i < current ? "✓" : i + 1}</div>
          <span style={{ fontSize: 11, fontWeight: i === current ? 700 : 400, color: i <= current ? "#333" : "#bbb" }}>{s}</span>
          {i < steps.length - 1 && <div style={{ width: 20, height: 1.5, borderRadius: 1, background: i < current ? "#10b981" : "#e5e7eb" }} />}
        </div>
      ))}
    </div>
  );
}

// —— Score Badge ——
function ScoreBadge({ score, size = "normal" }) {
  if (score == null) return null;
  const color = score >= 8 ? "#10b981" : score >= 7 ? "#3b82f6" : score >= 5 ? "#f59e0b" : "#ef4444";
  const bg = score >= 8 ? "#ecfdf5" : score >= 7 ? "#eff6ff" : score >= 5 ? "#fffbeb" : "#fef2f2";
  const sz = size === "small" ? { fontSize: 10, padding: "2px 6px" } : { fontSize: 12, padding: "3px 10px" };
  return (
    <span style={{ ...sz, borderRadius: 20, background: bg, color, fontWeight: 800, whiteSpace: "nowrap" }}>
      {score.toFixed(1)}점
    </span>
  );
}

// —— Settings Panel ——
function SettingsPanel({ open, onClose, apiKey, onApiKeyChange, unsplashKey, onUnsplashKeyChange, pexelsKey, onPexelsKeyChange, serperKey, onSerperKeyChange, openaiKey, onOpenaiKeyChange }) {
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempUnsplash, setTempUnsplash] = useState(unsplashKey);
  const [tempPexels, setTempPexels] = useState(pexelsKey);
  const [tempSerper, setTempSerper] = useState(serperKey);
  const [tempOpenai, setTempOpenai] = useState(openaiKey);
  const [showKey, setShowKey] = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [showPexels, setShowPexels] = useState(false);
  const [showSerper, setShowSerper] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);

  useEffect(() => {
    if (open) { setTempKey(apiKey); setTempUnsplash(unsplashKey); setTempPexels(pexelsKey); setTempSerper(serperKey); setTempOpenai(openaiKey); }
  }, [open, apiKey, unsplashKey, pexelsKey, serperKey, openaiKey]);

  if (!open) return null;

  const handleSave = () => {
    onApiKeyChange(tempKey.trim());
    onUnsplashKeyChange(tempUnsplash.trim());
    onPexelsKeyChange(tempPexels.trim());
    onSerperKeyChange(tempSerper.trim());
    onOpenaiKeyChange(tempOpenai.trim());
    onClose();
  };

  const inputRow = (label, value, onChange, placeholder, show, toggleShow, desc) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#333" }}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
        />
        <button onClick={toggleShow} style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fafafa", cursor: "pointer", fontSize: 13 }}>
          {show ? "🙈" : "👁"}
        </button>
      </div>
      {desc && <div style={{ fontSize: 9, color: "#bbb", marginTop: 3 }}>{desc}</div>}
    </div>
  );

  const partial = tempKey.trim() || tempUnsplash.trim() || tempPexels.trim() || tempSerper.trim() || tempOpenai.trim();

  const statusDot = (ok) => ({ width: 6, height: 6, borderRadius: "50%", background: ok ? "#10b981" : "#d1d5db", flexShrink: 0 });
  const statusRow = (label, ok) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: ok ? "#065f46" : "#aaa" }}>
      <div style={statusDot(ok)} />{label}
    </div>
  );

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1101,
        background: "#fff", borderRadius: 20, padding: 24, width: "min(460px, 94vw)", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "modal-scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Settings</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#aaa" }}>✕</button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>AI 문구 생성</div>
        {inputRow("Anthropic API Key", tempKey, setTempKey, "sk-ant-api03-...", showKey, () => setShowKey(!showKey))}

        <div style={{ height: 1, background: "#f0f0f0", margin: "16px 0" }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>AI 이미지 생성</div>
        {inputRow("OpenAI API Key (DALL-E)", tempOpenai, setTempOpenai, "sk-...", showOpenai, () => setShowOpenai(!showOpenai), "platform.openai.com 에서 발급 — DALL-E 3 이미지 생성")}

        <div style={{ height: 1, background: "#f0f0f0", margin: "16px 0" }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>이미지 검색</div>
        {inputRow("Unsplash Access Key", tempUnsplash, setTempUnsplash, "Unsplash Access Key...", showUnsplash, () => setShowUnsplash(!showUnsplash), "unsplash.com/developers 에서 발급")}
        {inputRow("Pexels API Key", tempPexels, setTempPexels, "Pexels API Key...", showPexels, () => setShowPexels(!showPexels), "pexels.com/api 에서 발급")}
        {inputRow("Serper API Key (Google 이미지)", tempSerper, setTempSerper, "Serper API Key...", showSerper, () => setShowSerper(!showSerper), "serper.dev 에서 발급 (무료 2,500건) — 실제 Google 이미지 검색 결과")}

        <div style={{ fontSize: 9, color: "#bbb", marginBottom: 12 }}>키는 브라우저 localStorage에만 저장됩니다.</div>

        {/* Status */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", padding: "12px 14px", borderRadius: 10, background: "#f9fafb", marginBottom: 16 }}>
          {statusRow("Anthropic", tempKey.trim())}
          {statusRow("OpenAI", tempOpenai.trim())}
          {statusRow("Unsplash", tempUnsplash.trim())}
          {statusRow("Pexels", tempPexels.trim())}
          {statusRow("Google 이미지", tempSerper.trim())}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {partial && (
            <button className="btn-3d" onClick={() => { setTempKey(""); setTempUnsplash(""); setTempPexels(""); setTempSerper(""); setTempOpenai(""); }} style={{ fontSize: "0.75rem", color: "#ef4444" }}>전체 삭제</button>
          )}
          <button className="btn-3d" onClick={onClose} style={{ fontSize: "0.75rem" }}>취소</button>
          <button className="btn-3d btn-3d-primary" onClick={handleSave} style={{ fontSize: "0.75rem" }}>저장</button>
        </div>
      </div>
    </>
  );
}

// —— Media Picker Modal (with DALL-E tab) ——
function MediaPickerModal({ open, onClose, unsplashKey, pexelsKey, serperKey, openaiKey, onSelect }) {
  const [tab, setTab] = useState("file");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [dallePrompt, setDallePrompt] = useState("");
  const [dalleGenerating, setDalleGenerating] = useState(false);
  const [dalleResult, setDalleResult] = useState(null);

  // Pick default tab when reopened
  useEffect(() => {
    if (open) {
      setResults([]); setQuery(""); setError(""); setDalleResult(null); setDallePrompt("");
      setTab(unsplashKey ? "unsplash" : pexelsKey ? "pexels" : serperKey ? "google" : openaiKey ? "dalle" : "file");
    }
  }, [open, unsplashKey, pexelsKey, serperKey, openaiKey]);

  if (!open) return null;

  const searchUnsplash = async () => {
    if (!query.trim() || !unsplashKey) return;
    setSearching(true); setError("");
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait`,
        { headers: { Authorization: `Client-ID ${unsplashKey}` } }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.errors?.[0] || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults((data.results || []).map(img => ({ url: img.urls.regular, thumb: img.urls.small, type: "image" })));
      if (!data.results?.length) setError("검색 결과가 없습니다");
    } catch (err) {
      console.error("Unsplash error:", err);
      setError(`Unsplash 오류: ${err.message}`);
      setResults([]);
    }
    setSearching(false);
  };

  const searchPexels = async () => {
    if (!query.trim() || !pexelsKey) return;
    setSearching(true); setError("");
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=portrait`,
        { headers: { Authorization: pexelsKey } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults((data.photos || []).map(p => ({ url: p.src.large2x, thumb: p.src.medium, type: "image" })));
      if (!data.photos?.length) setError("검색 결과가 없습니다");
    } catch (err) {
      console.error("Pexels error:", err);
      setError(`Pexels 오류: ${err.message}`);
      setResults([]);
    }
    setSearching(false);
  };

  const searchGoogle = async () => {
    if (!query.trim() || !serperKey) return;
    setSearching(true); setError("");
    try {
      const res = await fetch("https://google.serper.dev/images", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num: 15 }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults((data.images || []).map(img => ({ url: img.imageUrl, thumb: img.thumbnailUrl || img.imageUrl, type: "image" })));
      if (!data.images?.length) setError("검색 결과가 없습니다");
    } catch (err) {
      console.error("Serper error:", err);
      setError(`Google 이미지 오류: ${err.message}`);
      setResults([]);
    }
    setSearching(false);
  };

  const generateDalle = async () => {
    if (!dallePrompt.trim() || !openaiKey) return;
    setDalleGenerating(true); setError(""); setDalleResult(null);
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: dallePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const url = data.data?.[0]?.url;
      if (!url) throw new Error("이미지 URL을 받지 못했습니다");
      setDalleResult(url);
    } catch (err) {
      console.error("DALL-E error:", err);
      setError(`DALL-E 오류: ${err.message}`);
    }
    setDalleGenerating(false);
  };

  const handleSearch = () => {
    setResults([]); setError("");
    if (tab === "unsplash") searchUnsplash();
    else if (tab === "pexels") searchPexels();
    else if (tab === "google") searchGoogle();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    onSelect(url, mediaType);
  };

  const tabs = [
    { id: "unsplash", label: "Unsplash", disabled: !unsplashKey },
    { id: "pexels", label: "Pexels", disabled: !pexelsKey },
    { id: "google", label: "Google 이미지", disabled: !serperKey },
    { id: "dalle", label: "AI 생성", disabled: !openaiKey },
    { id: "file", label: "파일 첨부" },
  ];

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1201,
        background: "#fff", borderRadius: 20, padding: 24, width: "min(540px, 94vw)", maxHeight: "82vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", animation: "modal-scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>배경 미디어 선택</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#aaa" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setResults([]); setError(""); setDalleResult(null); }}
              disabled={t.disabled}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: t.disabled ? "not-allowed" : "pointer",
                fontSize: 11, fontWeight: 700, transition: "all 0.15s", minWidth: 70,
                background: tab === t.id ? "#4f46e5" : t.disabled ? "#f3f4f6" : "#eef2ff",
                color: tab === t.id ? "#fff" : t.disabled ? "#ccc" : "#4f46e5",
                opacity: t.disabled ? 0.5 : 1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search bar for unsplash/pexels/google */}
        {(tab === "unsplash" || tab === "pexels" || tab === "google") && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="검색어 입력... (예: nature, office, food)"
              style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
            <button className="btn-3d btn-3d-primary" onClick={handleSearch} disabled={searching}
              style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
              {searching ? "..." : "검색"}
            </button>
          </div>
        )}

        {/* DALL-E tab */}
        {tab === "dalle" && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={dallePrompt} onChange={e => setDallePrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && generateDalle()}
                placeholder="이미지 설명 입력... (예: modern office workspace, clean and minimal)"
                style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
              <button className="btn-3d btn-3d-primary" onClick={generateDalle} disabled={dalleGenerating || !dallePrompt.trim()}
                style={{ fontSize: "0.8rem", whiteSpace: "nowrap", opacity: (!dallePrompt.trim() || dalleGenerating) ? 0.5 : 1 }}>
                {dalleGenerating ? "생성중..." : "생성"}
              </button>
            </div>
            {dalleGenerating && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa", fontSize: 13 }}>
                DALL-E 3로 이미지를 생성하고 있습니다... (약 15-30초)
              </div>
            )}
            {dalleResult && (
              <div style={{ textAlign: "center" }}>
                <div
                  onClick={() => onSelect(dalleResult, "image")}
                  style={{
                    display: "inline-block", borderRadius: 12, overflow: "hidden", cursor: "pointer",
                    border: "3px solid transparent", transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#4f46e5"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                >
                  <img src={dalleResult} alt="DALL-E generated" style={{ width: 300, height: 300, objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>클릭하여 배경으로 적용</div>
              </div>
            )}
            {!dalleGenerating && !dalleResult && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb", fontSize: 13 }}>
                이미지 설명을 입력하고 생성 버튼을 누르세요
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fef2f2", color: "#dc2626", fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Results grid */}
        {(tab === "unsplash" || tab === "pexels" || tab === "google") && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {results.map((r, i) => (
              <div key={i} onClick={() => onSelect(r.url, r.type)}
                style={{
                  aspectRatio: "4/5", borderRadius: 10, overflow: "hidden", cursor: "pointer",
                  border: "2px solid transparent", transition: "border-color 0.15s", background: "#f3f4f6",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#4f46e5"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
              >
                <img src={r.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }} />
              </div>
            ))}
            {results.length === 0 && !searching && !error && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "32px 0", color: "#bbb", fontSize: 13 }}>
                키워드를 입력하고 검색하세요
              </div>
            )}
            {searching && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "32px 0", color: "#aaa", fontSize: 13 }}>
                검색 중...
              </div>
            )}
          </div>
        )}

        {/* File upload tab */}
        {tab === "file" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <label style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12,
              padding: "32px 48px", borderRadius: 16, border: "2px dashed #d1d5db", cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.background = "#eef2ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 32 }}>📁</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>이미지 또는 동영상 선택</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>JPG, PNG, GIF, MP4, WebM, MOV</span>
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
        )}
      </div>
    </>
  );
}

// —— Full-Size Card for PNG Rendering ——
function FullSizeCard({ card, styleId }) {
  const idx = (card.cardNumber - 1) % PHOTO_BG.length;
  const photoBg = PHOTO_BG[idx];
  const hasImage = !!card.imageUrl;
  const W = 1080;
  const H = 1350;

  const base = {
    width: W, height: H, overflow: "hidden",
    position: "relative", display: "flex", flexDirection: "column",
    fontFamily: "'Pretendard',-apple-system,sans-serif",
  };

  if (styleId === "varo") {
    return (
      <div style={{ ...base, background: photoBg, justifyContent: "flex-end" }}>
        {hasImage && <img src={card.imageUrl} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        {!hasImage && <div style={{ position: "absolute", inset: 0, opacity: 0.08, background: "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(255,255,255,0.03) 4px,rgba(255,255,255,0.03) 8px)" }} />}
        <div style={{ position: "absolute", top: 60, left: 60, fontSize: 44, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>@cardnews</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />
        <div style={{ position: "relative", padding: "0 75px 150px", zIndex: 1 }}>
          {card.type === "cover" && (
            <>
              <div style={{ fontSize: 88, fontWeight: 900, color: "#fff", lineHeight: 1.3, letterSpacing: -3, wordBreak: "keep-all" }}>{card.headline}</div>
              {card.subtext && <div style={{ fontSize: 50, color: "rgba(255,255,255,0.6)", marginTop: 18 }}>{card.subtext}</div>}
            </>
          )}
          {card.type === "content" && (
            <>
              <div style={{ fontSize: 82, fontWeight: 800, color: "#fff", lineHeight: 1.3, letterSpacing: -2, wordBreak: "keep-all" }}>{card.headline}</div>
              {card.body && <div style={{ fontSize: 47, color: "rgba(255,255,255,0.55)", marginTop: 18, lineHeight: 1.5 }}>{card.body}</div>}
            </>
          )}
          {card.type === "closing" && (
            <>
              <div style={{ fontSize: 75, fontWeight: 800, color: "#fff" }}>{card.cta || "더 알아보기"}</div>
              {card.hashtags && <div style={{ fontSize: 44, color: "rgba(255,255,255,0.45)", marginTop: 24 }}>{card.hashtags.slice(0,3).join(" ")}</div>}
            </>
          )}
        </div>
      </div>
    );
  }

  if (styleId === "moond") {
    return (
      <div style={{ ...base, background: photoBg, justifyContent: "flex-end" }}>
        {hasImage && <img src={card.imageUrl} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        {!hasImage && <div style={{ position: "absolute", inset: 0, opacity: 0.06, background: "repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(255,255,255,0.02) 6px,rgba(255,255,255,0.02) 12px)" }} />}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        <div style={{ position: "relative", padding: "0 88px 140px", zIndex: 1 }}>
          {card.type === "cover" && (
            <div style={{ fontSize: 94, fontWeight: 800, color: "#fff", lineHeight: 1.25, letterSpacing: -3, wordBreak: "keep-all" }}>{card.headline}</div>
          )}
          {card.type === "content" && (
            <>
              <div style={{ fontSize: 82, fontWeight: 700, color: "#fff", lineHeight: 1.3, wordBreak: "keep-all" }}>{card.headline}</div>
              {card.body && <div style={{ fontSize: 47, color: "rgba(255,255,255,0.5)", marginTop: 18, lineHeight: 1.5 }}>{card.body}</div>}
            </>
          )}
          {card.type === "closing" && (
            <div style={{ fontSize: 75, fontWeight: 700, color: "#fff" }}>{card.cta || "더 알아보기"}</div>
          )}
        </div>
        <div style={{ position: "absolute", bottom: 50, right: 62, fontSize: 44, color: "rgba(255,255,255,0.3)", fontStyle: "italic", zIndex: 1 }}>moond</div>
      </div>
    );
  }

  if (styleId === "poly") {
    const badgeColors = ["#e53e3e", "#dd6b20", "#38a169", "#3182ce", "#805ad5", "#d53f8c", "#e53e3e", "#dd6b20", "#38a169", "#3182ce"];
    const badgeTexts = ["TRENDING", "HOT", "BREAKING", "NEW", "INSIGHT", "ISSUE", "TRENDING", "HOT", "BREAKING", "NEW"];
    return (
      <div style={{ ...base, background: photoBg, justifyContent: "flex-end" }}>
        {hasImage && <img src={card.imageUrl} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        {!hasImage && <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,0.02) 2px,rgba(255,255,255,0.02) 6px)" }} />}
        <div style={{ position: "absolute", top: 62, left: 62, display: "flex", alignItems: "center", gap: 25, zIndex: 1 }}>
          <div style={{ width: 62, height: 62, borderRadius: 12, background: "rgba(255,255,255,0.8)" }} />
          <span style={{ fontSize: 44, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>CardNews</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)" }} />
        <div style={{ position: "relative", padding: "0 75px 140px", zIndex: 1 }}>
          {card.type !== "closing" && (
            <div style={{
              display: "inline-block", fontSize: 44, fontWeight: 800, padding: "12px 44px", borderRadius: 18, marginBottom: 38,
              background: badgeColors[idx], color: "#fff", letterSpacing: 6,
            }}>
              {card.type === "cover" ? badgeTexts[idx] : `0${card.cardNumber}`}
            </div>
          )}
          {card.type === "cover" && (
            <div style={{ fontSize: 100, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: -3, textTransform: "uppercase", wordBreak: "keep-all" }}>
              {card.headline}
            </div>
          )}
          {card.type === "content" && (
            <div style={{ fontSize: 82, fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: -2, wordBreak: "keep-all" }}>
              {card.headline}
            </div>
          )}
          {card.type === "closing" && (
            <>
              <div style={{ fontSize: 82, fontWeight: 900, color: "#fff", marginBottom: 25 }}>{card.cta || "MORE →"}</div>
              {card.hashtags && <div style={{ fontSize: 44, color: "rgba(255,255,255,0.4)" }}>{card.hashtags.slice(0,3).join(" ")}</div>}
            </>
          )}
        </div>
      </div>
    );
  }

  // MINIMAL
  const isEdge = card.type === "cover" || card.type === "closing";
  const minBg = isEdge ? "#111" : card.bgColor || "#fafafa";
  const minTxt = isEdge ? "#fff" : "#111";
  const minSub = isEdge ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  return (
    <div style={{ ...base, background: minBg, justifyContent: "center", alignItems: "center", padding: 100 }}>
      {hasImage && isEdge && <img src={card.imageUrl} alt="" crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      {hasImage && isEdge && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />}
      {card.type === "cover" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: 18, opacity: 0.35, color: minTxt }}>CARD NEWS</div>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.25, color: minTxt, letterSpacing: -2 }}>{card.headline}</div>
          {card.subtext && <div style={{ fontSize: 53, color: minSub, lineHeight: 1.4 }}>{card.subtext}</div>}
          <div style={{ width: 150, height: 12, borderRadius: 6, marginTop: 25, background: "rgba(255,255,255,0.25)" }} />
        </div>
      )}
      {card.type === "content" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38, textAlign: "center", position: "relative", width: "100%" }}>
          <div style={{ position: "absolute", top: -50, right: 0, fontSize: 275, fontWeight: 900, opacity: 0.05, color: minTxt, lineHeight: 1 }}>
            {String(card.cardNumber).padStart(2, "0")}
          </div>
          {card.accent && (
            <div style={{ fontSize: 53, fontWeight: 700, padding: "12px 56px", borderRadius: 125, background: "rgba(0,0,0,0.06)", color: "#333" }}>{card.accent}</div>
          )}
          <div style={{ fontSize: 75, fontWeight: 700, lineHeight: 1.3, color: minTxt }}>{card.headline}</div>
          {card.body && <div style={{ fontSize: 50, color: minSub, lineHeight: 1.6, padding: "0 25px", wordBreak: "keep-all" }}>{card.body}</div>}
        </div>
      )}
      {card.type === "closing" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 112 }}>👋</div>
          <div style={{ fontSize: 69, fontWeight: 700, color: minTxt }}>{card.cta || "더 알아보기"}</div>
          {card.hashtags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
              {card.hashtags.slice(0, 3).map((t, i) => (
                <span key={i} style={{ fontSize: 44, padding: "12px 31px", borderRadius: 18, background: "rgba(255,255,255,0.12)", color: minSub }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// —— Main App ——
export default function InstaCardNews() {
  const [step, setStep] = useState(0); // 0=input, 1=loading, 2=angles, 3=preview
  const [persona, setPersona] = useState("");
  const [desire, setDesire] = useState("");
  const [awareness, setAwareness] = useState("problem-aware");
  const [category, setCategory] = useState("news");
  const [styleId, setStyleId] = useState("varo");
  const [cardCount, setCardCount] = useState(7);
  const [analysis, setAnalysis] = useState(null);
  const [cards, setCards] = useState([]);
  const [, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [editBackup, setEditBackup] = useState(null);
  const [autoHashtag, setAutoHashtag] = useState(true);
  const [viewingCard, setViewingCard] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("cardnews_api_key") || "");
  const [unsplashKey, setUnsplashKey] = useState(() => localStorage.getItem("cardnews_unsplash_key") || "");
  const [pexelsKey, setPexelsKey] = useState(() => localStorage.getItem("cardnews_pexels_key") || "");
  const [serperKey, setSerperKey] = useState(() => localStorage.getItem("cardnews_serper_key") || "");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("cardnews_openai_key") || "");
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);

  // New states for angles & evaluation
  const [angles, setAngles] = useState([]);
  const [selectedAngle, setSelectedAngle] = useState(null);
  const [evalScore, setEvalScore] = useState(null);

  // PNG download state
  const [downloading, setDownloading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const viewerRef = useRef(null);

  // Persist API keys
  const handleApiKeyChange = (key) => {
    setApiKey(key);
    if (key) localStorage.setItem("cardnews_api_key", key);
    else localStorage.removeItem("cardnews_api_key");
  };
  const handleUnsplashKeyChange = (key) => {
    setUnsplashKey(key);
    if (key) localStorage.setItem("cardnews_unsplash_key", key);
    else localStorage.removeItem("cardnews_unsplash_key");
  };
  const handlePexelsKeyChange = (key) => {
    setPexelsKey(key);
    if (key) localStorage.setItem("cardnews_pexels_key", key);
    else localStorage.removeItem("cardnews_pexels_key");
  };
  const handleSerperKeyChange = (key) => {
    setSerperKey(key);
    if (key) localStorage.setItem("cardnews_serper_key", key);
    else localStorage.removeItem("cardnews_serper_key");
  };
  const handleOpenaiKeyChange = (key) => {
    setOpenaiKey(key);
    if (key) localStorage.setItem("cardnews_openai_key", key);
    else localStorage.removeItem("cardnews_openai_key");
  };

  // Handle media selection from picker
  const handleMediaSelect = async (url, mediaType) => {
    if (mediaPickerTarget === null) return;
    // Convert external URL to blob URL immediately for reliable Canvas rendering later
    let finalUrl = url;
    if (url && !url.startsWith("blob:") && !url.startsWith("data:")) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        finalUrl = URL.createObjectURL(blob);
      } catch {
        finalUrl = url; // fallback to original if fetch fails
      }
    }
    setCards(prev => prev.map((c, i) => i === mediaPickerTarget ? { ...c, imageUrl: finalUrl, mediaType: mediaType || "image" } : c));
    setMediaPickerTarget(null);
  };

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile viewer: scroll to card when viewingCard changes
  useEffect(() => {
    if (isMobile && viewingCard !== null && viewerRef.current) {
      const slide = viewerRef.current.children[viewingCard];
      if (slide) slide.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [viewingCard, isMobile]);

  // Mobile viewer: sync scroll position to viewingCard
  const handleViewerScroll = useCallback(() => {
    if (!viewerRef.current) return;
    const el = viewerRef.current;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== viewingCard && idx >= 0 && idx < cards.length) {
      setViewingCard(idx);
    }
  }, [viewingCard, cards.length]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (viewingCard === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setViewingCard(null);
      if (e.key === "ArrowLeft" && viewingCard > 0) setViewingCard(v => v - 1);
      if (e.key === "ArrowRight" && viewingCard < cards.length - 1) setViewingCard(v => v + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewingCard, cards.length]);

  // Open editor: save backup
  const openEditor = (idx) => {
    setSelectedCard(idx);
    setEditBackup({ ...cards[idx] });
  };

  // Live update card field
  const liveUpdate = (key, value) => {
    if (selectedCard === null) return;
    setCards(prev => prev.map((c, i) => i === selectedCard ? { ...c, [key]: value } : c));
  };

  // 적용: just close (changes already live)
  const confirmEdit = () => {
    setSelectedCard(null);
    setEditBackup(null);
  };

  // 취소: restore backup
  const cancelEdit = () => {
    if (selectedCard !== null && editBackup) {
      setCards(prev => prev.map((c, i) => i === selectedCard ? { ...editBackup } : c));
    }
    setSelectedCard(null);
    setEditBackup(null);
  };

  // Combine persona + desire into topic string
  // Detect if input is English (simple heuristic: mostly ASCII letters)
  const isEnglish = (text) => {
    if (!text) return false;
    const ascii = text.replace(/[^a-zA-Z]/g, "").length;
    return ascii / Math.max(text.replace(/\s/g, "").length, 1) > 0.6;
  };
  const lang = isEnglish(persona) || isEnglish(desire) ? "en" : "ko";

  const getTopicText = () => {
    const parts = [];
    if (persona.trim()) parts.push(persona.trim());
    if (desire.trim()) parts.push(desire.trim());
    return parts.join(" - ") || (lang === "en" ? "Card News" : "카드뉴스");
  };

  // Demo data generator (fallback when API unavailable)
  const generateDemoData = (topicText, cat, count) => {
    if (lang === "en") {
      const tag = topicText.replace(/\s/g, "");
      const base = { title: topicText.slice(0, 20), subtitle: `Everything about ${topicText}`, tone: "Informative", hashtags: [`#${tag}`, "#cardnews", "#trending", "#tips", "#insight"] };
      const points = ["Key Changes & Trends", "Expert Opinions", "Data-Driven Insights", "Don't Miss This Point", "Future Outlook", "How to Apply This", "Essential Background", "Pros & Cons Compared"];
      const analysisObj = { ...base, keyPoints: points.slice(0, count - 2) };
      const cardsArr = [
        { cardNumber: 1, type: "cover", headline: analysisObj.title, subtext: analysisObj.subtitle },
        ...analysisObj.keyPoints.map((pt, i) => ({
          cardNumber: i + 2, type: "content", headline: pt,
          body: `Why ${pt.toLowerCase()} matters for ${topicText}.`,
          accent: `Point ${i + 1}`,
        })),
        { cardNumber: count, type: "closing", cta: "Save & Share!", hashtags: analysisObj.hashtags.slice(0, 3) },
      ];
      return { analysis: analysisObj, cards: cardsArr };
    }
    const demoAnalysis = {
      "뉴스/트렌드": { title: topicText.slice(0,15), subtitle: `${topicText}의 핵심 정리`, tone: "정보전달", hashtags: [`#${topicText.replace(/\s/g,"")}`, "#카드뉴스", "#트렌드", "#이슈", "#정보"] },
      "교육/정보": { title: topicText.slice(0,15), subtitle: `알아두면 좋은 ${topicText}`, tone: "정보전달", hashtags: [`#${topicText.replace(/\s/g,"")}`, "#지식", "#교육", "#꿀팁", "#정보"] },
      "마케팅": { title: topicText.slice(0,15), subtitle: `${topicText} 완벽 가이드`, tone: "감성", hashtags: [`#${topicText.replace(/\s/g,"")}`, "#마케팅", "#브랜딩", "#인사이트", "#전략"] },
      "라이프스타일": { title: topicText.slice(0,15), subtitle: `${topicText}로 달라지는 일상`, tone: "감성", hashtags: [`#${topicText.replace(/\s/g,"")}`, "#일상", "#라이프", "#추천", "#꿀팁"] },
    };
    const catLabel = CATEGORIES.find(c=>c.id===cat)?.label || "뉴스/트렌드";
    const base = demoAnalysis[catLabel] || demoAnalysis["뉴스/트렌드"];
    const points = ["핵심 변화와 트렌드 분석", "전문가들의 의견 정리", "실제 데이터로 보는 현황", "놓치면 안되는 포인트", "앞으로의 전망과 예측", "실전에 적용 방법", "꼭 알아야 할 배경지식", "비교 분석과 장단점"];
    const analysisObj = { ...base, keyPoints: points.slice(0, count-2) };
    const cardsArr = [
      { cardNumber: 1, type: "cover", headline: analysisObj.title, subtext: analysisObj.subtitle },
      ...analysisObj.keyPoints.map((pt, i) => ({
        cardNumber: i + 2, type: "content", headline: pt,
        body: `${topicText}에서 ${pt.toLowerCase()}이(가) 중요한 이유를 알아봅니다.`,
        accent: `포인트 ${i + 1}`,
      })),
      { cardNumber: count, type: "closing", cta: "저장하고 공유하세요!", hashtags: analysisObj.hashtags.slice(0, 3) },
    ];
    return { analysis: analysisObj, cards: cardsArr };
  };

  // Generate demo angle data
  const generateDemoAngles = (topicText) => {
    const personaText = persona.trim() || (lang === "en" ? "Target Reader" : "타겟 독자");
    const desireText = desire.trim() || topicText;
    return ANGLE_TYPES.map(angle => {
      const headlines = lang === "en" ? {
        empathy: `"${personaText}, been there too"`,
        fear: `"Ignoring ${desireText}? Here's the cost"`,
        benefit: `"5 benefits of ${desireText}"`,
        convenience: `"${desireText} in 3 minutes"`,
        "social-proof": `"8 out of 10 ${personaText}s chose this"`,
      } : {
        empathy: `"${personaText}, 이런 고민 있으셨죠?"`,
        fear: `"${desireText} 모르면 뒤처집니다"`,
        benefit: `"${desireText}로 얻는 5가지 혜택"`,
        convenience: `"3분이면 끝! ${desireText} 쉽게 시작하기"`,
        "social-proof": `"${personaText} 10명 중 8명이 선택한 방법"`,
      };
      return {
        id: angle.id,
        label: angle.label,
        icon: angle.icon,
        desc: angle.desc,
        headline: headlines[angle.id] || `${desireText} - ${angle.label} 앵글`,
        score: parseFloat((Math.random() * 3 + 6).toFixed(1)),
        evaluation: {
          hooking: parseFloat((Math.random() * 3 + 6).toFixed(1)),
          empathy: parseFloat((Math.random() * 3 + 6).toFixed(1)),
          clarity: parseFloat((Math.random() * 3 + 6).toFixed(1)),
          ruleCompliance: parseFloat((Math.random() * 3 + 6).toFixed(1)),
          chipFit: parseFloat((Math.random() * 3 + 6).toFixed(1)),
        }
      };
    });
  };

  // Claude API call for angles
  const callClaudeAngles = async (topicText, cat) => {
    const catLabel = CATEGORIES.find(c => c.id === cat)?.label || "뉴스/트렌드";
    const awarenessLabel = AWARENESS_LEVELS.find(a => a.id === awareness)?.label || "문제인지";
    const langInstr = lang === "en"
      ? "IMPORTANT: All headlines and content MUST be written in English. The target audience is English-speaking."
      : "모든 헤드라인과 콘텐츠는 한국어로 작성하세요.";

    const prompt = `당신은 인스타그램 카드뉴스 전문 마케팅 카피라이터입니다.

${langInstr}

페르소나: "${persona.trim() || (lang === "en" ? "General Reader" : "일반 독자")}"
욕구: "${desire.trim() || topicText}"
인지단계: ${awarenessLabel}
카테고리: ${catLabel}

5가지 마케팅 앵글로 각각 다른 헤드라인을 작성하고, 각 헤드라인의 품질을 자체 평가하세요.

5가지 앵글:
1. 공감(empathy) - 타겟의 감정에 공감
2. 공포(fear) - 놓치면 안 되는 위기감
3. 이익(benefit) - 얻을 수 있는 혜택
4. 편의(convenience) - 쉽고 간편한 방법
5. 사회증거(social-proof) - 다른 사람들의 경험/수치

각 앵글별로 다음 5가지 기준(1-10점)으로 자체 평가:
- 후킹력: 스크롤을 멈출 만한 힘
- 공감도: 타겟이 "나의 이야기"라고 느끼는 정도
- 명확성: 메시지의 명확함
- 규칙준수: 인스타 카드뉴스 규칙 준수도
- 칩적합성: 해당 앵글과의 적합도

아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 순수 JSON만 출력하세요:

{
  "angles": [
    {
      "id": "empathy",
      "headline": "헤드라인 문구",
      "evaluation": {
        "hooking": 8,
        "empathy": 9,
        "clarity": 7,
        "ruleCompliance": 8,
        "chipFit": 9
      }
    },
    {
      "id": "fear",
      "headline": "헤드라인 문구",
      "evaluation": { "hooking": 8, "empathy": 7, "clarity": 8, "ruleCompliance": 8, "chipFit": 9 }
    },
    {
      "id": "benefit",
      "headline": "헤드라인 문구",
      "evaluation": { "hooking": 7, "empathy": 7, "clarity": 9, "ruleCompliance": 8, "chipFit": 8 }
    },
    {
      "id": "convenience",
      "headline": "헤드라인 문구",
      "evaluation": { "hooking": 7, "empathy": 8, "clarity": 9, "ruleCompliance": 8, "chipFit": 8 }
    },
    {
      "id": "social-proof",
      "headline": "헤드라인 문구",
      "evaluation": { "hooking": 8, "empathy": 8, "clarity": 8, "ruleCompliance": 8, "chipFit": 9 }
    }
  ]
}

규칙:
- headline은 인스타그램 카드뉴스 표지에 적합한 짧고 임팩트 있는 문구 (20자 이내)
- 각 앵글의 특성을 잘 반영
- 페르소나와 욕구, 인지단계에 맞춰 작성`;

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
        max_tokens: 2048,
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
    const parsed = JSON.parse(jsonMatch[1].trim());
    return parsed;
  };

  // Claude API call for full cards (with angle + self-evaluation)
  const callClaudeCards = async (topicText, cat, count, hashtagEnabled, angle, retryCount = 0) => {
    const catLabel = CATEGORIES.find(c => c.id === cat)?.label || "뉴스/트렌드";
    const awarenessLabel = AWARENESS_LEVELS.find(a => a.id === awareness)?.label || "문제인지";
    const angleLabel = ANGLE_TYPES.find(a => a.id === angle.id)?.label || angle.label;

    const langInstr2 = lang === "en"
      ? "IMPORTANT: All card text (headlines, body, subtext, CTA, hashtags) MUST be written in English. The target audience is English-speaking."
      : "모든 카드 텍스트는 한국어로 작성하세요.";

    const prompt = `당신은 인스타그램 카드뉴스 전문 카피라이터입니다.

${langInstr2}

페르소나: "${persona.trim() || (lang === "en" ? "General Reader" : "일반 독자")}"
욕구: "${desire.trim() || topicText}"
인지단계: ${awarenessLabel}
카테고리: ${catLabel}
선택된 앵글: ${angleLabel} (${angle.headline})
카드 수: ${count}장 (표지 1장 + 본문 ${count - 2}장 + 마무리 1장)
해시태그 자동생성: ${hashtagEnabled ? "예" : "아니오"}

선택된 앵글(${angleLabel})을 기반으로 ${count}장의 카드뉴스를 작성하고, 작성된 카피의 품질을 자체 평가하세요.

평가 기준 (1-10점):
- 후킹력(hooking): 스크롤을 멈출 만한 힘
- 공감도(empathy): 타겟이 "나의 이야기"라고 느끼는 정도
- 명확성(clarity): 메시지의 명확함
- 규칙준수(ruleCompliance): 인스타 카드뉴스 작성 규칙 준수도
- 칩적합성(chipFit): 선택된 앵글과의 적합도

아래 JSON 형식으로만 응답하세요:

{
  "analysis": {
    "title": "카드뉴스 제목 (15자 이내)",
    "subtitle": "부제목 (20자 이내)",
    "tone": "톤 (예: 정보전달, 감성, 유머 등)",
    "hashtags": ["#해시태그1", "#해시태그2", "#해시태그3", "#해시태그4", "#해시태그5"],
    "concept": "이 카드뉴스의 핵심 컨셉 (한 문장)",
    "expectedReaction": "기대 반응 (한 문장)"
  },
  "cards": [
    { "cardNumber": 1, "type": "cover", "headline": "표지 헤드라인", "subtext": "표지 부제목" },
    { "cardNumber": 2, "type": "content", "headline": "본문 헤드라인", "body": "본문 내용 (40자 이내)", "accent": "강조 키워드" },
    ...본문 카드 반복...
    { "cardNumber": ${count}, "type": "closing", "cta": "CTA 문구", "hashtags": ["#태그1", "#태그2", "#태그3"] }
  ],
  "evaluation": {
    "hooking": 8,
    "empathy": 8,
    "clarity": 9,
    "ruleCompliance": 8,
    "chipFit": 9
  }
}

규칙:
- headline은 짧고 임팩트 있게 (15자 이내)
- body는 핵심만 간결하게 (40자 이내)
- accent는 해당 카드의 핵심 키워드 (2~4자)
- ${angleLabel} 앵글의 특성을 전체 카드에 일관되게 반영
- 인스타그램 감성에 맞는 톤으로 작성
- 총 ${count}장의 카드를 생성
- 평가는 정직하게 — 7점 미만이면 재생성됩니다`;

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
        max_tokens: 3000,
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
    const parsed = JSON.parse(jsonMatch[1].trim());

    // Self-evaluation check
    if (parsed.evaluation) {
      const evalScores = parsed.evaluation;
      const avg = (evalScores.hooking + evalScores.empathy + evalScores.clarity + evalScores.ruleCompliance + evalScores.chipFit) / 5;
      parsed._avgScore = avg;

      // Auto-retry if score < 7 and retries left
      if (avg < 7 && retryCount < 2) {
        setLoadingMsg(`품질 점수 ${avg.toFixed(1)}점 — 재생성 중... (${retryCount + 1}/2)`);
        return callClaudeCards(topicText, cat, count, hashtagEnabled, angle, retryCount + 1);
      }
    }

    return parsed;
  };

  // Generate angles
  const generate = useCallback(async () => {
    const topicText = getTopicText();
    if (!topicText.trim() || (!persona.trim() && !desire.trim())) return;
    setLoading(true); setStep(1); setSelectedCard(null); setAngles([]); setSelectedAngle(null); setEvalScore(null);

    if (apiKey) {
      try {
        setLoadingMsg("주제를 분석하고 있습니다...");
        await new Promise(r => setTimeout(r, 300));
        setLoadingMsg("5가지 마케팅 앵글을 생성하고 있습니다...");

        const result = await callClaudeAngles(topicText, category);

        // Map API results to angle objects
        const angleResults = result.angles.map(a => {
          const meta = ANGLE_TYPES.find(at => at.id === a.id) || {};
          const evalObj = a.evaluation || {};
          const avg = ((evalObj.hooking || 7) + (evalObj.empathy || 7) + (evalObj.clarity || 7) + (evalObj.ruleCompliance || 7) + (evalObj.chipFit || 7)) / 5;
          return {
            id: a.id,
            label: meta.label || a.id,
            icon: meta.icon || "📌",
            desc: meta.desc || "",
            headline: a.headline,
            score: parseFloat(avg.toFixed(1)),
            evaluation: evalObj,
          };
        });

        setAngles(angleResults);
        setStep(2);
      } catch (err) {
        console.error("API Error:", err);
        setLoadingMsg(`API 오류: ${err.message}\n데모 모드로 전환합니다...`);
        await new Promise(r => setTimeout(r, 1500));
        setAngles(generateDemoAngles(topicText));
        setStep(2);
      }
    } else {
      setLoadingMsg("앵글을 생성하고 있습니다... (데모 모드)");
      await new Promise(r => setTimeout(r, 600));
      setAngles(generateDemoAngles(topicText));
      setStep(2);
    }

    setLoading(false);
  }, [persona, desire, awareness, category, styleId, cardCount, apiKey, autoHashtag]);

  // Select angle and generate full cards
  const selectAngle = useCallback(async (angle) => {
    setSelectedAngle(angle);
    setLoading(true); setStep(1); setLoadingMsg("선택된 앵글로 카드 카피를 작성하고 있습니다...");
    const topicText = getTopicText();

    let analysisResult, cardsResult, evalResult;

    if (apiKey) {
      try {
        const result = await callClaudeCards(topicText, category, cardCount, autoHashtag, angle);
        analysisResult = result.analysis;
        cardsResult = result.cards;
        if (result.evaluation) {
          const avg = result._avgScore || ((result.evaluation.hooking + result.evaluation.empathy + result.evaluation.clarity + result.evaluation.ruleCompliance + result.evaluation.chipFit) / 5);
          evalResult = { ...result.evaluation, avg: parseFloat(avg.toFixed(1)) };
        }
      } catch (err) {
        console.error("API Error:", err);
        setLoadingMsg(`API 오류: ${err.message}\n데모 모드로 전환합니다...`);
        await new Promise(r => setTimeout(r, 1500));
        const demo = generateDemoData(topicText, category, cardCount);
        analysisResult = demo.analysis;
        cardsResult = demo.cards;
      }
    } else {
      await new Promise(r => setTimeout(r, 600));
      const demo = generateDemoData(topicText, category, cardCount);
      analysisResult = demo.analysis;
      cardsResult = demo.cards;
      evalResult = { hooking: 7.5, empathy: 7.2, clarity: 8.0, ruleCompliance: 7.8, chipFit: 8.1, avg: 7.7 };
    }

    setAnalysis(analysisResult);
    setEvalScore(evalResult);
    const pal = COLOR_PALETTES[styleId] || COLOR_PALETTES.minimal;
    setCards(cardsResult.map((c, i) => ({
      ...c,
      totalCards: cardCount,
      bgColor: pal[i % pal.length],
      imageUrl: null,
      mediaType: null,
    })));
    setStep(3);
    setLoading(false);
  }, [category, styleId, cardCount, apiKey, autoHashtag, persona, desire, awareness]);

  // Load image as HTMLImageElement
  const loadImage = (url) => new Promise((resolve, reject) => {
    if (!url) return reject(new Error("no url"));
    // For external URLs, fetch as blob first to bypass CORS
    if (!url.startsWith("blob:") && !url.startsWith("data:")) {
      fetch(url).then(r => r.blob()).then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = blobUrl;
      }).catch(reject);
    } else {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    }
  });

  // Draw card on Canvas with style support
  const drawCardToCanvas = async (card, style) => {
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const idx = (card.cardNumber - 1) % PHOTO_BG.length;
    const isMinimal = style === "minimal";
    const isEdge = card.type === "cover" || card.type === "closing";

    // --- Background ---
    if (isMinimal && !isEdge) {
      // Minimal content cards: light bg
      ctx.fillStyle = card.bgColor || "#fafafa";
      ctx.fillRect(0, 0, W, H);
    } else if (card.imageUrl) {
      try {
        const img = await loadImage(card.imageUrl);
        const scale = Math.max(W / img.width, H / img.height);
        const sw = W / scale, sh = H / scale;
        const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      } catch (imgErr) {
        console.error("[PNG] Image load failed:", imgErr);
        const grd = ctx.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, "#3a4a3a"); grd.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
      }
    } else if (isMinimal && isEdge) {
      ctx.fillStyle = "#111"; ctx.fillRect(0, 0, W, H);
    } else {
      const colors = [["#3a4a3a","#4a6a4a"],["#4a5568","#2d3748"],["#5a4a3a","#3a2a1a"],["#2d4a6a","#1a3a5a"],["#6a4a5a","#4a2a3a"],["#4a6a5a","#2a4a3a"],["#5a5a4a","#3a3a2a"],["#3a5a6a","#1a3a4a"],["#6a5a3a","#4a3a1a"],["#4a3a5a","#2a1a3a"]];
      const c = colors[idx % colors.length];
      const grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, c[0]); grd.addColorStop(1, c[1]);
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    }

    // --- Overlays (not for minimal content) ---
    if (!isMinimal || isEdge) {
      // Darken overlay for image + minimal edge
      if (isMinimal && isEdge && card.imageUrl) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, W, H);
      }
      // Bottom gradient
      const oy = style === "poly" ? 0.35 : style === "moond" ? 0.55 : 0.45;
      const overlay = ctx.createLinearGradient(0, H * oy, 0, H);
      overlay.addColorStop(0, "rgba(0,0,0,0)");
      overlay.addColorStop(0.5, "rgba(0,0,0,0.4)");
      overlay.addColorStop(1, style === "poly" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.85)");
      ctx.fillStyle = overlay; ctx.fillRect(0, H * oy, W, H * (1 - oy));
    }

    // --- Style-specific decorations ---
    const txtColor = (isMinimal && !isEdge) ? "#111" : "#fff";
    const subColor = (isMinimal && !isEdge) ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.55)";
    ctx.textBaseline = "top";

    if (style === "varo") {
      ctx.font = "600 40px Pretendard, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText("@cardnews", 60, 55);
    } else if (style === "moond") {
      ctx.font = "italic 44px Pretendard, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText("moond", W - 200, H - 60);
    } else if (style === "poly") {
      // Logo
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillRect(62, 62, 50, 50);
      ctx.font = "700 40px Pretendard, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("CardNews", 128, 72);
      // Badge
      if (card.type !== "closing") {
        const badgeColors = ["#e53e3e","#dd6b20","#38a169","#3182ce","#805ad5","#d53f8c"];
        const badgeTexts = ["TRENDING","HOT","BREAKING","NEW","INSIGHT","ISSUE"];
        ctx.fillStyle = badgeColors[idx % badgeColors.length];
        ctx.fillRect(75, H - 480, 200, 50);
        ctx.font = "800 28px Pretendard, sans-serif"; ctx.fillStyle = "#fff";
        ctx.fillText(card.type === "cover" ? badgeTexts[idx % badgeTexts.length] : `0${card.cardNumber}`, 90, H - 470);
      }
    } else if (isMinimal) {
      if (card.type === "cover") {
        ctx.font = "600 30px Pretendard, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.textAlign = "center"; ctx.fillText("CARD NEWS", W / 2, 200); ctx.textAlign = "left";
      }
      if (card.type === "content") {
        ctx.font = "900 280px Pretendard, sans-serif"; ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillText(String(card.cardNumber).padStart(2, "0"), W - 380, 40);
      }
    }

    // --- Text content ---
    const centerY = isMinimal && !isEdge;
    const px = isMinimal ? 100 : 75;

    if (card.type === "cover") {
      const headY = isMinimal ? H / 2 - 80 : H - 380;
      ctx.font = `900 ${isMinimal ? 82 : style === "poly" ? 96 : 88}px Pretendard, -apple-system, sans-serif`;
      ctx.fillStyle = txtColor;
      if (isMinimal) ctx.textAlign = "center";
      wrapText(ctx, card.headline || "", isMinimal ? W / 2 : px, headY, W - px * 2, style === "poly" ? 120 : 115);
      if (card.subtext) {
        ctx.font = `400 ${isMinimal ? 44 : 48}px Pretendard, sans-serif`;
        ctx.fillStyle = isMinimal ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.6)";
        ctx.fillText(card.subtext, isMinimal ? W / 2 : px, isMinimal ? H / 2 + 80 : H - 140);
      }
      if (isMinimal) ctx.textAlign = "left";
    } else if (card.type === "content") {
      const baseY = centerY ? H / 2 - 100 : H - 400;
      if (card.accent && !isMinimal) {
        ctx.font = "700 42px Pretendard, sans-serif"; ctx.fillStyle = subColor;
        ctx.fillText(card.accent, px, baseY - 50);
      }
      if (isMinimal && card.accent) {
        ctx.font = "700 38px Pretendard, sans-serif"; ctx.fillStyle = "#555";
        ctx.textAlign = "center"; ctx.fillText(card.accent, W / 2, baseY - 40); ctx.textAlign = "left";
      }
      ctx.font = `${style === "poly" ? 900 : 800} ${isMinimal ? 68 : 78}px Pretendard, -apple-system, sans-serif`;
      ctx.fillStyle = txtColor;
      if (isMinimal) ctx.textAlign = "center";
      wrapText(ctx, card.headline || "", isMinimal ? W / 2 : px, baseY, W - px * 2, 100);
      if (card.body) {
        ctx.font = `400 ${isMinimal ? 40 : 46}px Pretendard, sans-serif`;
        ctx.fillStyle = subColor;
        wrapText(ctx, card.body, isMinimal ? W / 2 : px, baseY + 180, W - px * 2, 60);
      }
      if (isMinimal) ctx.textAlign = "left";
    } else if (card.type === "closing") {
      const ctaY = isMinimal ? H / 2 - 40 : H - 280;
      ctx.font = `800 ${isMinimal ? 64 : 72}px Pretendard, -apple-system, sans-serif`;
      ctx.fillStyle = txtColor;
      if (isMinimal) ctx.textAlign = "center";
      ctx.fillText(card.cta || (style === "poly" ? "MORE" : "더 알아보기"), isMinimal ? W / 2 : px, ctaY);
      if (card.hashtags) {
        ctx.font = "400 40px Pretendard, sans-serif"; ctx.fillStyle = isMinimal ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.45)";
        ctx.fillText(card.hashtags.slice(0, 3).join("  "), isMinimal ? W / 2 : px, ctaY + 100);
      }
      if (isMinimal) ctx.textAlign = "left";
    }

    // --- Page dots ---
    const dotY = H - 40;
    const totalDots = Math.min(card.totalCards || 7, 8);
    const dotStartX = style === "poly" ? W - totalDots * 20 - 30 : (W - totalDots * 20) / 2;
    for (let i = 0; i < totalDots; i++) {
      const isCurrent = i === card.cardNumber - 1;
      ctx.beginPath();
      ctx.arc(dotStartX + i * 20 + (isCurrent ? 10 : 5), dotY, isCurrent ? 8 : 4, 0, Math.PI * 2);
      const dotActive = (isMinimal && !isEdge) ? "rgba(0,0,0,0.35)" : "#fff";
      const dotInactive = (isMinimal && !isEdge) ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.3)";
      ctx.fillStyle = isCurrent ? dotActive : dotInactive;
      ctx.fill();
    }

    return canvas;
  };

  // Canvas text wrapping helper
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split("");
    let line = "";
    let curY = y;
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, curY);
        line = chars[i];
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  // PNG Download
  const downloadPNG = async (cardIndex) => {
    setDownloading(true);
    try {
      const card = cards[cardIndex];
      const canvas = await drawCardToCanvas(card, styleId);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `card-${String(cardIndex + 1).padStart(2, "0")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("PNG download error:", err);
      alert(`PNG 다운로드 오류: ${err.message}`);
    }
    setDownloading(false);
  };

  const downloadAllPNG = async () => {
    setDownloading(true);
    for (let i = 0; i < cards.length; i++) {
      await downloadPNG(i);
      await new Promise(r => setTimeout(r, 300));
    }
    setDownloading(false);
  };

  // CSV Export
  const exportCSV = () => {
    const today = new Date().toISOString().split("T")[0];
    const awarenessLabel = AWARENESS_LEVELS.find(a => a.id === awareness)?.label || awareness;
    const angleLabel = selectedAngle?.label || "";

    const headers = ["날짜", "페르소나", "욕구", "인지단계", "앵글"];
    const row = [today, persona, desire, awarenessLabel, angleLabel];

    cards.forEach((c, i) => {
      const num = String(i + 1).padStart(2, "0");
      headers.push(`Card${num} 헤드라인`);
      row.push(c.headline || c.cta || "");
      if (c.type === "content") {
        headers.push(`Card${num} 본문`);
        row.push(c.body || "");
        headers.push(`Card${num} 키워드`);
        row.push(c.accent || "");
      }
    });

    headers.push("컨셉", "기대반응");
    row.push(analysis?.concept || "", analysis?.expectedReaction || "");

    const csvContent = [headers.join(","), row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cardnews-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clipboard copy (tab-separated for Google Sheets)
  const copyToClipboard = () => {
    const today = new Date().toISOString().split("T")[0];
    const awarenessLabel = AWARENESS_LEVELS.find(a => a.id === awareness)?.label || awareness;
    const angleLabel = selectedAngle?.label || "";

    const headers = ["날짜", "페르소나", "욕구", "인지단계", "앵글"];
    const row = [today, persona, desire, awarenessLabel, angleLabel];

    cards.forEach((c, i) => {
      const num = String(i + 1).padStart(2, "0");
      headers.push(`Card${num} 헤드라인`);
      row.push(c.headline || c.cta || "");
      if (c.type === "content") {
        headers.push(`Card${num} 본문`);
        row.push(c.body || "");
        headers.push(`Card${num} 키워드`);
        row.push(c.accent || "");
      }
    });

    headers.push("컨셉", "기대반응");
    row.push(analysis?.concept || "", analysis?.expectedReaction || "");

    const tsvContent = headers.join("\t") + "\n" + row.join("\t");
    navigator.clipboard.writeText(tsvContent).then(() => {
      alert("클립보드에 복사되었습니다! Google Sheets에 Ctrl+V로 붙여넣기 하세요.");
    }).catch(() => {
      alert("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    });
  };

  const canGenerate = persona.trim() || desire.trim();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f7", fontFamily: "'Pretendard',-apple-system,sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Hidden render target for PNG export */}

      {/* —— Header —— */}
      <div style={{ background: "#111", color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
          background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
        }}>📱</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.5 }}>카드뉴스 오토봇</div>
          <div style={{ fontSize: 10, color: "#555" }}>AI-Powered · 1080×1350 · PNG Export</div>
        </div>
        <button onClick={() => setShowSettings(true)} style={{
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <span style={{ fontSize: 14 }}>⚙️</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>설정</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: (apiKey && (unsplashKey || pexelsKey || serperKey || openaiKey)) ? "#10b981" : (apiKey || unsplashKey || pexelsKey || serperKey || openaiKey) ? "#3b82f6" : "#f59e0b", marginLeft: 2 }} />
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} apiKey={apiKey} onApiKeyChange={handleApiKeyChange} unsplashKey={unsplashKey} onUnsplashKeyChange={handleUnsplashKeyChange} pexelsKey={pexelsKey} onPexelsKeyChange={handlePexelsKeyChange} serperKey={serperKey} onSerperKeyChange={handleSerperKeyChange} openaiKey={openaiKey} onOpenaiKeyChange={handleOpenaiKeyChange} />

      {/* Media Picker Modal */}
      <MediaPickerModal open={mediaPickerTarget !== null} onClose={() => setMediaPickerTarget(null)} unsplashKey={unsplashKey} pexelsKey={pexelsKey} serperKey={serperKey} openaiKey={openaiKey} onSelect={handleMediaSelect} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px" }}>
        {step > 0 && <PipelineProgress current={step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 3 : 0} />}

        {/* ════════ STEP 0: INPUT (Persona-Based) ════════ */}
        {step === 0 && (
          <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Persona & Desire */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>타겟 설정</label>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", marginBottom: 4 }}>페르소나</label>
                  <input
                    value={persona} onChange={e => setPersona(e.target.value)}
                    placeholder='예: 20대 대학생, 3년차 마케터, 30대 워킹맘...'
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#4f46e5"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", marginBottom: 4 }}>욕구</label>
                  <input
                    value={desire} onChange={e => setDesire(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && generate()}
                    placeholder='예: AI를 어떻게 더 잘 활용할까?, 이직 준비...'
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#4f46e5"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>
            </div>

            {/* Awareness Level */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>인지단계</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {AWARENESS_LEVELS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAwareness(a.id)}
                    style={{
                      flex: "1 1 120px", padding: "10px 12px", borderRadius: 12,
                      border: awareness === a.id ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                      background: awareness === a.id ? "#eef2ff" : "#fff",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: awareness === a.id ? "#4f46e5" : "#333" }}>{a.label}</div>
                    <div style={{ fontSize: 9, color: "#999", marginTop: 2 }}>{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>카테고리</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={()=>setCategory(c.id)}
                    style={{
                      padding: "8px 14px", borderRadius: 10, border: category===c.id ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                      background: category===c.id ? "#eef2ff" : "#fff", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                      fontSize: 12, fontWeight: category===c.id ? 700 : 500, color: category===c.id ? "#4f46e5" : "#666",
                    }}>
                    <span style={{ fontSize: 15 }}>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style + Count row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {/* Template Style — Radio Menu */}
              <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>템플릿 스타일</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {STYLES.map(s => (
                    <button key={s.id} onClick={()=>setStyleId(s.id)}
                      style={{
                        padding: "8px 14px", borderRadius: 10, border: styleId===s.id ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                        background: styleId===s.id ? "#eef2ff" : "#fff", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                        fontSize: 12, fontWeight: styleId===s.id ? 700 : 500, color: styleId===s.id ? "#4f46e5" : "#666",
                      }}>
                      <span style={{ display: "inline-block", width: 14, height: 17, borderRadius: 3, background: s.gradient }} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Count */}
              <div style={{ flex: "1 1 160px", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>카드 매수</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {CARD_COUNTS.map(n => (
                    <button
                      key={n}
                      className={`btn-3d ${cardCount===n ? "btn-3d-pressed" : ""}`}
                      onClick={()=>setCardCount(n)}
                      style={{
                        flex: 1, minWidth: 52,
                        fontWeight: 800, fontSize: "0.9rem",
                      }}
                    >
                      {n}장
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Options + Auto Hashtag toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {/* Size badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 18, height: 22.5, borderRadius: 3, background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 10, height: 12.5, borderRadius: 2, background: "#999" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>1080 × 1350</div>
                  <div style={{ fontSize: 9, color: "#999" }}>4:5 세로형</div>
                </div>
              </div>

              {/* Auto hashtag toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>해시태그 자동생성</div>
                  <div style={{ fontSize: 9, color: "#999" }}>마지막 카드에 추가</div>
                </div>
                <label className="toggle-switch" style={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" checked={autoHashtag} onChange={e=>setAutoHashtag(e.target.checked)} />
                </label>
              </div>

              {/* Generate Button — 3D Primary */}
              <button
                className={`btn-3d ${canGenerate?"btn-3d-primary":""}`}
                onClick={generate}
                disabled={!canGenerate}
                style={{
                  flex: "1 1 100%", padding: "0.65em 1.5em", fontSize: "0.95rem",
                  cursor: canGenerate?"pointer":"not-allowed",
                  opacity: canGenerate?1:0.5,
                }}
              >
                🚀 앵글 생성하기
                <span style={{ marginLeft: 8, fontSize: "0.7rem", padding: "2px 8px", borderRadius: 10, background: apiKey ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)", color: apiKey ? "#d1fae5" : "#fef3c7" }}>
                  {apiKey ? "AI 모드" : "데모 모드"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ════════ STEP 1: LOADING (Hand Animation) ════════ */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, paddingBottom: 80, gap: 0 }}>
            <div style={{ width: 200, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ transform: "scale(1.3)" }}>
                <div className="hand-loader">
                  <div className="hand-finger"></div>
                  <div className="hand-finger"></div>
                  <div className="hand-finger"></div>
                  <div className="hand-finger"></div>
                  <div className="hand-palm"></div>
                  <div className="hand-thumb"></div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 6, whiteSpace: "pre-line" }}>{loadingMsg}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>AI가 카드뉴스를 준비하고 있습니다</div>
            </div>
          </div>
        )}

        {/* ════════ STEP 2: ANGLE SELECTION ════════ */}
        {step === 2 && (
          <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Context bar */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>🎯 {persona.trim() || "타겟"}</span>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#eef2ff", color: "#4f46e5", fontWeight: 600 }}>{desire.trim() || "욕구"}</span>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#f0fdf4", color: "#059669", fontWeight: 600 }}>
                  {AWARENESS_LEVELS.find(a => a.id === awareness)?.label || awareness}
                </span>
              </div>
            </div>

            {/* Angle Cards */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                🔥 마케팅 앵글 선택 <span style={{ color: "#bbb", fontWeight: 400 }}>(5가지 앵글 중 하나를 선택하세요)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {angles.map((angle) => (
                  <div
                    key={angle.id}
                    onClick={() => selectAngle(angle)}
                    style={{
                      padding: 16, borderRadius: 14,
                      border: "2px solid #e5e7eb",
                      background: "#fafafa",
                      cursor: "pointer", transition: "all 0.2s",
                      position: "relative",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 20 }}>{angle.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{angle.label}</span>
                      </div>
                      <ScoreBadge score={angle.score} size="small" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, color: "#333", marginBottom: 8, wordBreak: "keep-all" }}>
                      {angle.headline}
                    </div>
                    <div style={{ fontSize: 10, color: "#999" }}>{angle.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back button */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn-3d" onClick={() => { setStep(0); setAngles([]); setSelectedAngle(null); }}
                style={{ fontSize: "0.8rem", flex: isMobile ? "1 1 45%" : "0 0 auto" }}>
                ← 처음부터
              </button>
              <button className="btn-3d" onClick={generate} style={{ fontSize: "0.8rem", flex: isMobile ? "1 1 45%" : "0 0 auto" }}>
                🔄 다시 생성
              </button>
            </div>
          </div>
        )}

        {/* ════════ STEP 3: PREVIEW ════════ */}
        {step === 3 && (
          <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Analysis badge + Eval Score */}
            {analysis && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>📊 {analysis.title}</span>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#eef2ff", color: "#4f46e5", fontWeight: 600 }}>{analysis.tone}</span>
                  {selectedAngle && (
                    <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#fef3c7", color: "#d97706", fontWeight: 600 }}>
                      {selectedAngle.icon} {selectedAngle.label}
                    </span>
                  )}
                  {evalScore && <ScoreBadge score={evalScore.avg} />}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {analysis.hashtags?.slice(0,4).map((t,i)=>(
                    <span key={i} style={{ fontSize: 9.5, padding: "2px 8px", borderRadius: 6, background: "#f3f4f6", color: "#888" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation Detail */}
            {evalScore && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>📋 품질 자체 평가</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { key: "hooking", label: "후킹력" },
                    { key: "empathy", label: "공감도" },
                    { key: "clarity", label: "명확성" },
                    { key: "ruleCompliance", label: "규칙준수" },
                    { key: "chipFit", label: "칩적합성" },
                  ].map(item => (
                    <div key={item.key} style={{ flex: "1 1 80px", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>{item.label}</div>
                      <div style={{
                        fontSize: 16, fontWeight: 800,
                        color: (evalScore[item.key] || 0) >= 8 ? "#10b981" : (evalScore[item.key] || 0) >= 7 ? "#3b82f6" : (evalScore[item.key] || 0) >= 5 ? "#f59e0b" : "#ef4444",
                      }}>
                        {(evalScore[item.key] || 0).toFixed(1)}
                      </div>
                    </div>
                  ))}
                  <div style={{ flex: "1 1 80px", textAlign: "center", borderLeft: "2px solid #f0f0f0", paddingLeft: 12 }}>
                    <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>평균</div>
                    <div style={{
                      fontSize: 18, fontWeight: 900,
                      color: evalScore.avg >= 8 ? "#10b981" : evalScore.avg >= 7 ? "#3b82f6" : evalScore.avg >= 5 ? "#f59e0b" : "#ef4444",
                    }}>
                      {evalScore.avg.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Style switcher */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "14px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#999" }}>스타일</span>
              <div style={{ display: "flex", gap: 6 }}>
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyleId(s.id)}
                    style={{
                      padding: "6px 14px", borderRadius: 8, border: styleId === s.id ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                      background: styleId === s.id ? "#eef2ff" : "#fff", cursor: "pointer",
                      fontSize: 11, fontWeight: 700, color: styleId === s.id ? "#4f46e5" : "#999", transition: "all 0.15s",
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card carousel */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>카드 미리보기 <span style={{ color: "#bbb", fontWeight: 400 }}>({cards.length}장 · 1080×1350)</span></div>
                <div style={{ fontSize: 10, color: "#bbb" }}>클릭하여 크게 보기</div>
              </div>
              <div className="card-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 12, scrollSnapType: "x mandatory" }}>
                {cards.map((card,i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <CardPreview card={card} styleId={styleId} isSelected={selectedCard===i}
                      onClick={()=>setViewingCard(i)}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setMediaPickerTarget(i); }}
                      style={{
                        fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                        border: "1px solid #e5e7eb", background: card.imageUrl ? "#eef2ff" : "#fff", color: card.imageUrl ? "#4f46e5" : "#888",
                        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#4f46e5"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = card.imageUrl ? "#eef2ff" : "#fff"; e.currentTarget.style.color = card.imageUrl ? "#4f46e5" : "#888"; }}
                    >
                      {card.imageUrl ? (card.mediaType === "video" ? "🎬 변경" : "🖼 변경") : "🖼 배경 추가"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor (desktop only — mobile uses bottom sheet) */}
            {selectedCard !== null && cards[selectedCard] && !isMobile && (
              <div className="animate-fade-up" style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", borderLeft: "4px solid #4f46e5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    ✏️ 카드 {selectedCard+1}
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "#aaa" }}>
                      ({cards[selectedCard].type==="cover"?"표지":cards[selectedCard].type==="closing"?"마무리":"본문"})
                    </span>
                  </div>
                  <button onClick={cancelEdit} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#ccc" }}>✕</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", marginBottom: 4 }}>
                      {cards[selectedCard].type==="closing"?"CTA 문구":"헤드라인"}
                    </label>
                    <input
                      value={cards[selectedCard].type==="closing"?(cards[selectedCard].cta||""):(cards[selectedCard].headline||"")}
                      onChange={e=>cards[selectedCard].type==="closing" ? liveUpdate("cta",e.target.value) : liveUpdate("headline",e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  {cards[selectedCard].type==="cover" && (
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", marginBottom: 4 }}>부제목</label>
                      <input value={cards[selectedCard].subtext||""} onChange={e=>liveUpdate("subtext",e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  )}
                  {cards[selectedCard].type==="content" && (
                    <>
                      <div>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", marginBottom: 4 }}>본문</label>
                        <textarea value={cards[selectedCard].body||""} onChange={e=>liveUpdate("body",e.target.value)} rows={2}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", marginBottom: 4 }}>강조 키워드</label>
                        <input value={cards[selectedCard].accent||""} onChange={e=>liveUpdate("accent",e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                    <button className="btn-3d" onClick={cancelEdit} style={{ fontSize: "0.75rem" }}>취소</button>
                    <button className="btn-3d btn-3d-primary" onClick={confirmEdit} style={{ fontSize: "0.75rem" }}>적용</button>
                  </div>
                </div>
              </div>
            )}

            {/* Action bar — 3D Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button className="btn-3d" onClick={()=>{ setStep(0); setCards([]); setAnalysis(null); setSelectedCard(null); setAngles([]); setSelectedAngle(null); setEvalScore(null); }}
                style={{ fontSize: "0.8rem", flex: isMobile ? "1 1 45%" : "0 0 auto" }}>
                ← 처음부터
              </button>
              <button className="btn-3d" onClick={()=>{ setStep(2); }}
                style={{ fontSize: "0.8rem", flex: isMobile ? "1 1 45%" : "0 0 auto" }}>
                ← 앵글 선택
              </button>
              <button className="btn-3d" onClick={() => selectedAngle && selectAngle(selectedAngle)} style={{ fontSize: "0.8rem", flex: isMobile ? "1 1 45%" : "0 0 auto" }}>
                🔄 재생성
              </button>
            </div>

            {/* Download + Export bar */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                className="btn-3d btn-3d-green"
                onClick={downloadAllPNG}
                disabled={downloading}
                style={{ flex: "1 1 100%", fontSize: "0.9rem", padding: "0.6em 1.5em", opacity: downloading ? 0.6 : 1 }}
              >
                {downloading ? "⏳ 다운로드 중..." : `📥 전체 PNG 다운로드 (${cards.length}장 · 1080×1350)`}
              </button>
              <button
                className="btn-3d btn-3d-primary"
                onClick={exportCSV}
                style={{ flex: "1 1 45%", fontSize: "0.8rem", padding: "0.5em 1em" }}
              >
                📄 시트 내보내기 (CSV)
              </button>
              <button
                className="btn-3d"
                onClick={copyToClipboard}
                style={{ flex: "1 1 45%", fontSize: "0.8rem", padding: "0.5em 1em" }}
              >
                📋 클립보드 복사
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════ DESKTOP CARD VIEWER ════════ */}
      {viewingCard !== null && cards[viewingCard] && !isMobile && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setViewingCard(null); }}>
          <button className="modal-close" onClick={() => setViewingCard(null)}>✕</button>
          {viewingCard > 0 && (
            <button className="modal-arrow modal-arrow-left" onClick={(e) => { e.stopPropagation(); setViewingCard(v => v - 1); }}>‹</button>
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="modal-card-wrapper" style={{ transform: "scale(2.1)", transformOrigin: "center center" }}>
              <CardPreview card={cards[viewingCard]} styleId={styleId} isSelected={false} onClick={() => {}} />
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 140 }}>
              {cards.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setViewingCard(i); }}
                  style={{ width: i === viewingCard ? 20 : 8, height: 8, borderRadius: 4, background: i === viewingCard ? "#fff" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600 }}>{viewingCard + 1} / {cards.length}</span>
              <button className="modal-edit-btn" onClick={(e) => { e.stopPropagation(); openEditor(viewingCard); setViewingCard(null); }}>✏️ 편집하기</button>
              <button className="modal-edit-btn" onClick={(e) => { e.stopPropagation(); downloadPNG(viewingCard); }}
                style={{ background: "rgba(16,185,129,0.2)", borderColor: "rgba(16,185,129,0.3)" }}>
                📥 PNG
              </button>
            </div>
          </div>
          {viewingCard < cards.length - 1 && (
            <button className="modal-arrow modal-arrow-right" onClick={(e) => { e.stopPropagation(); setViewingCard(v => v + 1); }}>›</button>
          )}
        </div>
      )}

      {/* ════════ MOBILE FULL-SCREEN VIEWER (swipe) ════════ */}
      {viewingCard !== null && isMobile && (
        <div className="mobile-viewer">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(0,0,0,0.6)" }}>
            <button onClick={() => setViewingCard(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}>← 닫기</button>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600 }}>{viewingCard + 1} / {cards.length}</span>
            <button onClick={() => { openEditor(viewingCard); setViewingCard(null); }} style={{ background: "none", border: "none", color: "#6ee7b7", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 0" }}>편집</button>
          </div>
          <div className="mobile-viewer-cards" ref={viewerRef} onScroll={handleViewerScroll}>
            {cards.map((card, i) => (
              <div key={i} className="mobile-viewer-slide">
                <div style={{ transform: "scale(1.55)", transformOrigin: "center center" }}>
                  <CardPreview card={card} styleId={styleId} isSelected={false} onClick={() => {}} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "12px 0 28px", background: "rgba(0,0,0,0.6)" }}>
            {cards.map((_, i) => (
              <div key={i} style={{ width: i === viewingCard ? 16 : 6, height: 6, borderRadius: 3, background: i === viewingCard ? "#fff" : "rgba(255,255,255,0.3)", transition: "all 0.2s" }} />
            ))}
          </div>
        </div>
      )}

      {/* ════════ MOBILE BOTTOM SHEET EDITOR ════════ */}
      {selectedCard !== null && cards[selectedCard] && isMobile && (
        <>
          <div className="bottom-sheet-overlay" onClick={cancelEdit} />
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                ✏️ 카드 {selectedCard + 1}
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 400, color: "#aaa" }}>
                  ({cards[selectedCard].type === "cover" ? "표지" : cards[selectedCard].type === "closing" ? "마무리" : "본문"})
                </span>
              </div>
              <button onClick={confirmEdit} style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>완료</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 4 }}>
                  {cards[selectedCard].type === "closing" ? "CTA 문구" : "헤드라인"}
                </label>
                <input
                  value={cards[selectedCard].type === "closing" ? (cards[selectedCard].cta || "") : (cards[selectedCard].headline || "")}
                  onChange={e => cards[selectedCard].type === "closing" ? liveUpdate("cta", e.target.value) : liveUpdate("headline", e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              {cards[selectedCard].type === "cover" && (
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 4 }}>부제목</label>
                  <input value={cards[selectedCard].subtext || ""} onChange={e => liveUpdate("subtext", e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              {cards[selectedCard].type === "content" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 4 }}>본문</label>
                    <textarea value={cards[selectedCard].body || ""} onChange={e => liveUpdate("body", e.target.value)} rows={3}
                      style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", resize: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 4 }}>강조 키워드</label>
                    <input value={cards[selectedCard].accent || ""} onChange={e => liveUpdate("accent", e.target.value)}
                      style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                  </div>
                </>
              )}
              <button onClick={cancelEdit} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#888" }}>취소 (원래대로)</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
