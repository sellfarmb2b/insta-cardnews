import { useState } from 'react'
import InstaCardNews from './InstaCardNews'
import ThreadWriter from './ThreadWriter'

const TABS = [
  { id: "cardnews", label: "인스타 카드뉴스", icon: "📱", color: "#dc2743" },
  { id: "threads", label: "스레드 글 발행", icon: "🧵", color: "#000" },
];

function App() {
  const [activeTab, setActiveTab] = useState("cardnews");
  // Read API key from localStorage (ThreadWriter uses this, InstaCardNews manages its own)
  const apiKey = localStorage.getItem("cardnews_api_key") || "";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f7", fontFamily: "'Pretendard',-apple-system,sans-serif" }}>
      {/* Global Tab Bar */}
      <div style={{
        background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0", borderBottom: "1px solid #222",
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, maxWidth: 260, padding: "14px 20px",
              background: activeTab === tab.id ? "#1a1a1a" : "transparent",
              border: "none", borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : "3px solid transparent",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 16 }}>{tab.icon}</span>
            <span style={{
              fontSize: 13, fontWeight: activeTab === tab.id ? 800 : 500,
              color: activeTab === tab.id ? "#fff" : "#666",
              transition: "color 0.2s",
            }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "cardnews" && <InstaCardNews />}
      {activeTab === "threads" && <ThreadWriter apiKey={apiKey} />}
    </div>
  )
}

export default App
