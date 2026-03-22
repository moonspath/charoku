"use client";

import { useState, useEffect, useCallback } from "react";
import type { ZenPhrase, VideoBookmark, AiExplanation, TabId, ZenTypeFilter, ZenSourceFilter, UsageRecord } from "@/lib/types";
import { MONTHS, MONTH_NAMES, CATEGORIES, SEASONAL_GREETINGS, ZENGO_DATA, ZENGO_IMAGES } from "@/lib/data";

export default function Charoku() {
  const [tab, setTab] = useState("home");
  const [videos, setVideos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("charoku_videos")||"[]"); } catch { return []; }
  });
  const [zenFavorites, setZenFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("charoku_zen_fav")||"[]"); } catch { return []; }
  });
  const [customZen, setCustomZen] = useState(() => {
    try { return JSON.parse(localStorage.getItem("charoku_custom_zen")||"[]"); } catch { return []; }
  });
  const [aiResult, setAiResult] = useState<AiExplanation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedZen, setSelectedZen] = useState(null);
  const [zenMonth, setZenMonth] = useState(() => new Date().getMonth());
  const [zenTypeFilter, setZenTypeFilter] = useState("all");
  const [zenSourceFilter, setZenSourceFilter] = useState("all"); // "all" | "builtin" | "custom"
  const [addZenModal, setAddZenModal] = useState(false);
  const [editZenTarget, setEditZenTarget] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [videoDetail, setVideoDetail] = useState(null);
  const [videoCatFilter, setVideoCatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Save to localStorage
  useEffect(() => {
    try { localStorage.setItem("charoku_videos", JSON.stringify(videos)); } catch {}
  }, [videos]);
  useEffect(() => {
    try { localStorage.setItem("charoku_zen_fav", JSON.stringify(zenFavorites)); } catch {}
  }, [zenFavorites]);
  useEffect(() => {
    try { localStorage.setItem("charoku_custom_zen", JSON.stringify(customZen)); } catch {}
  }, [customZen]);

  // Today's zen phrase for home
  const currentMonth = new Date().getMonth();
  const todayZen = ZENGO_DATA.filter(z => z.month === currentMonth || z.month === 12);
  const dailyZen = todayZen[Math.floor(new Date().getDate() % todayZen.length)];

  // ============================================================
  // AI Deep Dive function
  // ============================================================
  const fetchAiExplanation = useCallback(async (zen: ZenPhrase) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const response = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: zen.name,
          reading: zen.reading,
          type: zen.type,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setAiResult({ error: data.error } as AiExplanation);
      } else {
        setAiResult(data as AiExplanation);
      }
    } catch {
      setAiResult({ error: "AI解説の取得に失敗しました。もう一度お試しください。" } as AiExplanation);
    }
    setAiLoading(false);
  }, []);

  // ============================================================
  // Video helpers
  // ============================================================
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const addVideo = (videoData) => {
    setVideos(prev => [{ ...videoData, id: Date.now(), favorite: false, createdAt: new Date().toISOString() }, ...prev]);
    setVideoModal(false);
  };

  const toggleVideoFav = (id) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, favorite: !v.favorite } : v));
  };

  const deleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    setVideoDetail(null);
  };

  const updateVideoMemo = (id, memo) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, memo } : v));
  };

  const toggleZenFav = (name) => {
    setZenFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Custom zen CRUD
  const addCustomZen = (zenData) => {
    setCustomZen(prev => [{ ...zenData, id: Date.now(), custom: true, createdAt: new Date().toISOString(), usedDates: [] }, ...prev]);
    setAddZenModal(false);
  };

  const updateCustomZen = (id, updates) => {
    setCustomZen(prev => prev.map(z => z.id === id ? { ...z, ...updates } : z));
    setEditZenTarget(null);
  };

  const deleteCustomZen = (id) => {
    setCustomZen(prev => prev.filter(z => z.id !== id));
    setSelectedZen(null);
  };

  const addUsedDate = (id, date, note) => {
    setCustomZen(prev => prev.map(z => z.id === id
      ? { ...z, usedDates: [...(z.usedDates || []), { date, note }] }
      : z
    ));
  };

  // For built-in zen: track usage via a separate state stored alongside favorites
  const [zenUsage, setZenUsage] = useState(() => {
    try { return JSON.parse(localStorage.getItem("charoku_zen_usage")||"{}"); } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem("charoku_zen_usage", JSON.stringify(zenUsage)); } catch {}
  }, [zenUsage]);

  const addBuiltinUsedDate = (name, date, note) => {
    setZenUsage(prev => ({
      ...prev,
      [name]: [...(prev[name] || []), { date, note }]
    }));
  };

  // Combined zen data: built-in + custom
  const allZenData = [
    ...ZENGO_DATA.map(z => ({ ...z, custom: false })),
    ...customZen,
  ];

  // Filter zen data
  const filteredZen = allZenData.filter(z => {
    if (zenMonth !== 12 && z.month !== zenMonth && z.month !== 12) return false;
    if (zenTypeFilter !== "all" && z.type !== zenTypeFilter) return false;
    if (zenSourceFilter === "custom" && !z.custom) return false;
    if (zenSourceFilter === "builtin" && z.custom) return false;
    return true;
  });

  // Favorite zen items (from combined)
  const favoriteZenItems = allZenData.filter(z => zenFavorites.includes(z.name));

  // Filter videos
  const filteredVideos = videos.filter(v => {
    if (videoCatFilter !== "all" && v.category !== videoCatFilter) return false;
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase()) && !v.memo?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });


  // ============================================================
  // STYLES
  // ============================================================
  const colors = {
    bg: "#FAFAF8",
    card: "#FFFFFF",
    accent: "#7B8F6B",    // matcha green
    accentLight: "#EEF2EA",
    accentSoft: "#D4DCC9",
    fuji: "#B8A9C9",      // wisteria
    fujiLight: "#F0ECF5",
    sumi: "#5C5C5C",      // charcoal
    sumiLight: "#8A8A8A",
    border: "#E8E6E0",
    textPrimary: "#2C2C2C",
    textSecondary: "#7A7A7A",
    textTertiary: "#ABABAB",
    warm: "#F5F2ED",
    gold: "#C4A35A",
    goldLight: "#FBF6EC",
  };

  const serifFont = '"Zen Old Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif';
  const sansFont = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';

  const s = {
    app: {
      fontFamily: sansFont,
      background: colors.bg,
      color: colors.textPrimary,
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      paddingBottom: 80,
    },
    // Tab bar
    tabBar: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 480,
      display: "flex",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      borderTop: `0.5px solid ${colors.border}`,
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    },
    tabItem: (active) => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "10px 0 8px",
      fontSize: 10,
      fontWeight: active ? 500 : 400,
      color: active ? colors.accent : colors.textTertiary,
      background: "none",
      border: "none",
      cursor: "pointer",
      transition: "color 0.2s",
      gap: 3,
    }),
    // Cards
    card: {
      background: colors.card,
      borderRadius: 14,
      border: `0.5px solid ${colors.border}`,
      padding: "16px 18px",
      marginBottom: 12,
    },
    // Buttons
    btn: (variant = "default") => ({
      padding: variant === "sm" ? "6px 14px" : "10px 20px",
      borderRadius: 10,
      border: variant === "accent" ? "none" : `0.5px solid ${colors.border}`,
      background: variant === "accent" ? colors.accent : variant === "gold" ? colors.gold : colors.card,
      color: variant === "accent" || variant === "gold" ? "#fff" : colors.textPrimary,
      fontSize: variant === "sm" ? 12 : 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.15s",
      fontFamily: "inherit",
    }),
    pill: (active) => ({
      padding: "6px 14px",
      borderRadius: 20,
      border: `0.5px solid ${active ? colors.accent : colors.border}`,
      background: active ? colors.accentLight : "transparent",
      color: active ? colors.accent : colors.textSecondary,
      fontSize: 12,
      fontWeight: active ? 500 : 400,
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontFamily: "inherit",
    }),
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 10,
      border: `0.5px solid ${colors.border}`,
      fontSize: 14,
      fontFamily: "inherit",
      background: colors.card,
      color: colors.textPrimary,
      outline: "none",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 10,
      border: `0.5px solid ${colors.border}`,
      fontSize: 14,
      fontFamily: "inherit",
      background: colors.card,
      color: colors.textPrimary,
      outline: "none",
      resize: "vertical",
      minHeight: 80,
      boxSizing: "border-box",
    },
    // Section
    section: { padding: "0 20px" },
    heading: { fontSize: 18, fontWeight: 500, marginBottom: 14, letterSpacing: "0.02em" },
    subheading: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
    // Modal overlay
    overlay: {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)",
      zIndex: 200,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    },
    modal: {
      background: colors.bg,
      borderRadius: "20px 20px 0 0",
      width: "100%",
      maxWidth: 480,
      maxHeight: "90vh",
      overflow: "auto",
      padding: "24px 20px 40px",
    },
  };

  // ============================================================
  // ICON COMPONENTS (simple SVG)
  // ============================================================
  const Icon = ({ type, size = 22, color = "currentColor" }) => {
    const icons = {
      home: <><circle cx="12" cy="12" r="0" fill="none"/><path d="M3 12l9-8 9 8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v8a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
      video: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><path d="M10 9l5 3-5 3V9z" fill={color}/></>,
      book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
      heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
      heartFill: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={color} stroke={color} strokeWidth="1.5"/>,
      plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
      starFill: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} stroke={color} strokeWidth="1.5"/>,
      search: <><circle cx="11" cy="11" r="7" fill="none" stroke={color} strokeWidth="1.5"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      sparkle: <><path d="M12 3v2m0 14v2m-9-9h2m14 0h2m-4.2-5.8l-1.4 1.4m-7.8 7.8l-1.4 1.4m0-10.6l1.4 1.4m7.8 7.8l1.4 1.4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      x: <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      trash: <><polyline points="3 6 5 6 21 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      ext: <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><polyline points="15 3 21 3 21 9" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="10" y1="14" x2="21" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
      calendar: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/></>,
      user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{icons[type]}</svg>;
  };

  // ============================================================
  // HOME SCREEN
  // ============================================================

  const [kakejikuError, setKakejikuError] = useState(false);

  const HomeScreen = () => {
    const kakejikuUrl = ZENGO_IMAGES[dailyZen.name];

    return (
    <div style={{ padding: "0" }}>
      {/* Hero section */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: colors.warm,
        marginBottom: 0,
      }}>
        {/* Image or fallback */}
        {!kakejikuError && kakejikuUrl ? (
          <img
            src={kakejikuUrl}
            alt={`${dailyZen.name} 掛軸`}
            onError={() => setKakejikuError(true)}
            style={{
              width: "100%",
              height: 380,
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              filter: "brightness(0.88) saturate(0.9)",
            }}
          />
        ) : (
          <div style={{
            height: 380,
            background: `linear-gradient(160deg, #2C2C2C 0%, #4a5240 50%, ${colors.accent} 100%)`,
          }} />
        )}

        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)",
        }} />

        {/* Month badge – top left */}
        <div style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "0.5px solid rgba(255,255,255,0.3)",
          borderRadius: 20,
          padding: "5px 14px",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", letterSpacing: "0.18em" }}>
            {MONTHS[currentMonth].replace("月","")}月 · {MONTH_NAMES[currentMonth]}
          </span>
        </div>

        {/* Zen word overlay – bottom of hero */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          padding: "0 28px 32px",
          textAlign: "center",
        }}>
          {/* Decorative line */}
          <div style={{
            width: 40,
            height: 1,
            background: "rgba(255,255,255,0.4)",
            margin: "0 auto 20px",
          }} />
          <h1 style={{
            fontFamily: serifFont,
            fontSize: 42,
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            lineHeight: 1.3,
            marginBottom: 10,
            textShadow: "0 2px 16px rgba(0,0,0,0.4)",
          }}>
            {dailyZen.name}
          </h1>
          <p style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.15em",
            marginBottom: 0,
          }}>
            {dailyZen.reading}
          </p>
        </div>
      </div>

      {/* Meaning card */}
      <div style={{
        margin: "-1px 20px 0",
        background: colors.card,
        borderRadius: "0 0 20px 20px",
        border: `0.5px solid ${colors.border}`,
        borderTop: "none",
        padding: "22px 24px 24px",
        marginBottom: 24,
      }}>
        <p style={{
          fontFamily: serifFont,
          fontSize: 14,
          color: colors.sumi,
          lineHeight: 2.0,
          textAlign: "center",
          marginBottom: 14,
        }}>
          {dailyZen.meaning}
        </p>
        <p style={{
          fontSize: 11,
          color: colors.textTertiary,
          lineHeight: 1.7,
          textAlign: "center",
          fontStyle: "italic",
          borderTop: `0.5px solid ${colors.border}`,
          paddingTop: 14,
        }}>
          {SEASONAL_GREETINGS[currentMonth]}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, padding: "0 20px" }}>
        <button
          onClick={() => { setSelectedZen(dailyZen); fetchAiExplanation(dailyZen); }}
          style={{
            ...s.card,
            flex: 1,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            border: `0.5px solid ${colors.border}`,
            padding: "18px 12px",
            marginBottom: 0,
          }}
        >
          <Icon type="sparkle" size={20} color={colors.accent} />
          <span style={{ fontSize: 12, color: colors.accent, fontWeight: 500 }}>AIで深掘り</span>
        </button>
        <button
          onClick={() => setTab("zen")}
          style={{
            ...s.card,
            flex: 1,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            border: `0.5px solid ${colors.border}`,
            padding: "18px 12px",
            marginBottom: 0,
          }}
        >
          <Icon type="book" size={20} color={colors.fuji} />
          <span style={{ fontSize: 12, color: colors.fuji, fontWeight: 500 }}>禅語を探す</span>
        </button>
        <button
          onClick={() => setTab("video")}
          style={{
            ...s.card,
            flex: 1,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            border: `0.5px solid ${colors.border}`,
            padding: "18px 12px",
            marginBottom: 0,
          }}
        >
          <Icon type="video" size={20} color={colors.sumi} />
          <span style={{ fontSize: 12, color: colors.sumi, fontWeight: 500 }}>動画を見る</span>
        </button>
      </div>

      {/* Favorites preview */}
      {favoriteZenItems.length > 0 && (
        <div style={{ marginBottom: 24, padding: "0 20px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: colors.textSecondary }}>
            お気に入りの禅語・銘
          </h3>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {favoriteZenItems.slice(0, 5).map(z => (
              <button
                key={z.name}
                onClick={() => { setSelectedZen(z); setTab("zen"); }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: colors.warm,
                  border: "none",
                  fontSize: 14,
                  color: colors.textPrimary,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.05em",
                }}
              >
                {z.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent videos */}
      {videos.length > 0 && (
        <div style={{ padding: "0 20px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: colors.textSecondary }}>
            最近の動画
          </h3>
          {videos.slice(0, 3).map(v => (
            <div key={v.id} onClick={() => { setVideoDetail(v); setTab("video"); }}
              style={{ ...s.card, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
              {getYouTubeId(v.url) && (
                <img
                  src={`https://img.youtube.com/vi/${getYouTubeId(v.url)}/mqdefault.jpg`}
                  style={{ width: 96, height: 54, borderRadius: 8, objectFit: "cover" }}
                  alt=""
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.title}
                </p>
                <p style={{ fontSize: 11, color: colors.textTertiary }}>{v.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    );
  };

  // ============================================================
  // VIDEO SCREEN
  // ============================================================
  const AddVideoModal = () => {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("薄茶");
    const [memo, setMemo] = useState("");
    const [tags, setTags] = useState([]);

    return (
      <div style={s.overlay} onClick={() => setVideoModal(false)}>
        <div style={s.modal} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 500 }}>動画を追加</h2>
            <button onClick={() => setVideoModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Icon type="x" size={20} color={colors.textTertiary} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>YouTube URL</label>
              <input
                style={s.input}
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              {url && getYouTubeId(url) && (
                <img
                  src={`https://img.youtube.com/vi/${getYouTubeId(url)}/mqdefault.jpg`}
                  style={{ width: "100%", borderRadius: 10, marginTop: 10, aspectRatio: "16/9", objectFit: "cover" }}
                  alt="thumbnail"
                />
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>タイトル</label>
              <input style={s.input} placeholder="動画のタイトル" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>カテゴリ</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={s.pill(category === c)}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>メモ</label>
              <textarea style={s.textarea} placeholder="気づいたこと、ポイントなど..." value={memo} onChange={e => setMemo(e.target.value)} />
            </div>
            <button
              onClick={() => { if (url && title) addVideo({ url, title, category, memo, tags }); }}
              style={{ ...s.btn("accent"), width: "100%", opacity: (url && title) ? 1 : 0.4 }}
              disabled={!url || !title}
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VideoDetailModal = () => {
    const v = videoDetail;
    if (!v) return null;
    const [memo, setMemo] = useState(v.memo || "");
    const [editing, setEditing] = useState(false);

    return (
      <div style={s.overlay} onClick={() => setVideoDetail(null)}>
        <div style={s.modal} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 500, flex: 1 }}>{v.title}</h2>
            <button onClick={() => setVideoDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Icon type="x" size={20} color={colors.textTertiary} />
            </button>
          </div>

          {getYouTubeId(v.url) && (
            <img
              src={`https://img.youtube.com/vi/${getYouTubeId(v.url)}/hqdefault.jpg`}
              style={{ width: "100%", borderRadius: 12, marginBottom: 16, aspectRatio: "16/9", objectFit: "cover" }}
              alt=""
            />
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <span style={{
              padding: "4px 12px", borderRadius: 8, background: colors.accentLight,
              fontSize: 12, color: colors.accent, fontWeight: 500,
            }}>{v.category}</span>
            <button onClick={() => toggleVideoFav(v.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon type={v.favorite ? "starFill" : "star"} size={16} color={colors.gold} />
              <span style={{ fontSize: 12, color: colors.gold }}>{v.favorite ? "お気に入り" : "お気に入りに追加"}</span>
            </button>
          </div>

          <a href={v.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 6, color: colors.accent, fontSize: 13, marginBottom: 16, textDecoration: "none" }}>
            <Icon type="ext" size={14} color={colors.accent} />
            YouTubeで見る
          </a>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: colors.textSecondary }}>メモ</span>
              <button onClick={() => { if (editing) { updateVideoMemo(v.id, memo); } setEditing(!editing); }}
                style={{ ...s.btn("sm"), fontSize: 11 }}>
                {editing ? "保存" : "編集"}
              </button>
            </div>
            {editing ? (
              <textarea style={s.textarea} value={memo} onChange={e => setMemo(e.target.value)} />
            ) : (
              <p style={{ fontSize: 14, color: v.memo ? colors.textPrimary : colors.textTertiary, lineHeight: 1.7 }}>
                {v.memo || "メモはまだありません"}
              </p>
            )}
          </div>

          <button onClick={() => deleteVideo(v.id)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#C77", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <Icon type="trash" size={14} color="#C77" />
            この動画を削除
          </button>
        </div>
      </div>
    );
  };

  const VideoScreen = () => (
    <div style={s.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={s.heading}>YouTube動画</h2>
        <button onClick={() => setVideoModal(true)} style={{ ...s.btn("accent"), display: "flex", alignItems: "center", gap: 4, padding: "8px 14px" }}>
          <Icon type="plus" size={16} color="#fff" />
          <span>追加</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <Icon type="search" size={16} color={colors.textTertiary} />
        </div>
        <input
          style={{ ...s.input, paddingLeft: 36 }}
          placeholder="動画を検索..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        <button onClick={() => setVideoCatFilter("all")} style={s.pill(videoCatFilter === "all")}>すべて</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setVideoCatFilter(c)} style={s.pill(videoCatFilter === c)}>{c}</button>
        ))}
      </div>

      {/* Video list */}
      {filteredVideos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: colors.textTertiary }}>
          <Icon type="video" size={32} color={colors.border} />
          <p style={{ marginTop: 12, fontSize: 13 }}>
            {videos.length === 0 ? "まだ動画がありません" : "該当する動画がありません"}
          </p>
          {videos.length === 0 && (
            <button onClick={() => setVideoModal(true)} style={{ ...s.btn("accent"), marginTop: 16 }}>
              最初の動画を追加
            </button>
          )}
        </div>
      ) : (
        filteredVideos.map(v => (
          <div key={v.id} onClick={() => setVideoDetail(v)}
            style={{ ...s.card, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
            {getYouTubeId(v.url) ? (
              <img
                src={`https://img.youtube.com/vi/${getYouTubeId(v.url)}/mqdefault.jpg`}
                style={{ width: 110, height: 62, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                alt=""
              />
            ) : (
              <div style={{ width: 110, height: 62, borderRadius: 8, background: colors.warm, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon type="video" size={24} color={colors.textTertiary} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {v.title}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: colors.accent, background: colors.accentLight, padding: "2px 8px", borderRadius: 6 }}>
                  {v.category}
                </span>
                {v.favorite && <Icon type="starFill" size={12} color={colors.gold} />}
              </div>
              {v.memo && (
                <p style={{ fontSize: 11, color: colors.textTertiary, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.memo}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // ============================================================
  // ZEN SCREEN - ADD / EDIT MODALS
  // ============================================================
  const AddZenModal = () => {
    const isEdit = !!editZenTarget;
    const [name, setName] = useState(isEdit ? editZenTarget.name : "");
    const [reading, setReading] = useState(isEdit ? editZenTarget.reading : "");
    const [month, setMonth] = useState(isEdit ? editZenTarget.month : new Date().getMonth());
    const [type, setType] = useState(isEdit ? editZenTarget.type : "銘");
    const [meaning, setMeaning] = useState(isEdit ? editZenTarget.meaning : "");
    const [source, setSource] = useState(isEdit ? (editZenTarget.source || "") : "");
    const [learnedAt, setLearnedAt] = useState(isEdit ? (editZenTarget.learnedAt || "") : "");

    const handleSave = () => {
      if (!name) return;
      if (isEdit) {
        updateCustomZen(editZenTarget.id, { name, reading, month, type, meaning, source, learnedAt });
      } else {
        addCustomZen({ name, reading, month, type, meaning, source, learnedAt });
      }
    };

    const close = () => { setAddZenModal(false); setEditZenTarget(null); };

    return (
      <div style={s.overlay} onClick={close}>
        <div style={s.modal} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 500 }}>{isEdit ? "禅語・銘を編集" : "禅語・銘を追加"}</h2>
            <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Icon type="x" size={20} color={colors.textTertiary} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>名前 *</label>
              <input style={s.input} placeholder="例：日々是好日" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>読み</label>
              <input style={s.input} placeholder="例：にちにちこれこうにち" value={reading} onChange={e => setReading(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>種類</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["禅語","銘","前後(禅語)","その他"].map(t => (
                  <button key={t} onClick={() => setType(t)} style={s.pill(type === t)}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>季節</label>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                {MONTHS.map((m, i) => (
                  <button key={m} onClick={() => setMonth(i)} style={{ ...s.pill(month === i), minWidth: 36 }}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>意味・メモ</label>
              <textarea style={s.textarea} placeholder="意味や解釈、先生から教わったことなど..." value={meaning} onChange={e => setMeaning(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>出典・由来</label>
              <input style={s.input} placeholder="例：碧巌録、先生のお話など" value={source} onChange={e => setSource(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, display: "block" }}>お稽古で習った日</label>
              <input style={s.input} type="date" value={learnedAt} onChange={e => setLearnedAt(e.target.value)} />
            </div>
            <button
              onClick={handleSave}
              style={{ ...s.btn("accent"), width: "100%", opacity: name ? 1 : 0.4 }}
              disabled={!name}
            >
              {isEdit ? "更新する" : "追加する"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Usage recording sub-component
  const UsageRecorder = ({ zen }) => {
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [note, setNote] = useState("");

    const usedDates = zen.custom
      ? (zen.usedDates || [])
      : (zenUsage[zen.name] || []);

    const handleAdd = () => {
      if (zen.custom) {
        addUsedDate(zen.id, date, note);
      } else {
        addBuiltinUsedDate(zen.name, date, note);
      }
      setShowForm(false);
      setNote("");
    };

    return (
      <div style={{ marginTop: 16, borderTop: `0.5px solid ${colors.border}`, paddingTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: colors.textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon type="calendar" size={14} color={colors.textSecondary} />
            お稽古で使った記録
          </span>
          <button onClick={() => setShowForm(!showForm)} style={{ ...s.btn("sm"), fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon type="plus" size={12} color={colors.textPrimary} />
            記録
          </button>
        </div>

        {showForm && (
          <div style={{ ...s.card, background: colors.warm, border: "none", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input style={{ ...s.input, flex: 1 }} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <input style={{ ...s.input, marginBottom: 8 }} placeholder="メモ（例：初炭で使用）" value={note} onChange={e => setNote(e.target.value)} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={s.btn("sm")}>取消</button>
              <button onClick={handleAdd} style={{ ...s.btn("sm"), background: colors.accent, color: "#fff", border: "none" }}>保存</button>
            </div>
          </div>
        )}

        {usedDates.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {usedDates.slice().reverse().map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span style={{ color: colors.textTertiary, fontSize: 12, minWidth: 80 }}>{u.date}</span>
                <span style={{ color: colors.textSecondary }}>{u.note || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: colors.textTertiary }}>まだ記録がありません</p>
        )}
      </div>
    );
  };

  // ============================================================
  // ZEN DETAIL MODAL (enhanced)
  // ============================================================
  const ZenDetailModal = () => {
    const z = selectedZen;
    if (!z) return null;
    const isFav = zenFavorites.includes(z.name);

    return (
      <div style={s.overlay} onClick={() => { setSelectedZen(null); setAiResult(null); }}>
        <div style={s.modal} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: colors.fuji, fontWeight: 500, background: colors.fujiLight, padding: "4px 10px", borderRadius: 6 }}>
              {z.type}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => toggleZenFav(z.name)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Icon type={isFav ? "heartFill" : "heart"} size={22} color={isFav ? "#D4537E" : colors.textTertiary} />
              </button>
              <button onClick={() => { setSelectedZen(null); setAiResult(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Icon type="x" size={20} color={colors.textTertiary} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "24px 0 20px" }}>
            <h2 style={{ fontFamily: serifFont, fontSize: 32, fontWeight: 400, letterSpacing: "0.15em", marginBottom: 10, lineHeight: 1.4 }}>{z.name}</h2>
            <p style={{ fontSize: 13, color: colors.textSecondary, letterSpacing: "0.1em" }}>{z.reading}</p>
          </div>

          <div style={{ ...s.card, background: colors.warm, marginBottom: 16, border: "none" }}>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: colors.sumi }}>{z.meaning}</p>
          </div>

          <p style={{ fontSize: 12, color: colors.textTertiary, marginBottom: 16 }}>
            季節: {MONTHS[z.month]}  {z.month < 12 && `(${MONTH_NAMES[z.month]})`}
          </p>

          {/* AI deep dive button */}
          {!aiResult && !aiLoading && (
            <button onClick={() => fetchAiExplanation(z)}
              style={{ ...s.btn("gold"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon type="sparkle" size={18} color="#fff" />
              AIで歴史・背景を深掘り
            </button>
          )}

          {/* AI loading */}
          {aiLoading && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: 32, height: 32, border: `2px solid ${colors.border}`, borderTopColor: colors.accent,
                borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
              }} />
              <p style={{ fontSize: 13, color: colors.textSecondary }}>AIが解説を生成中...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* AI result */}
          {aiResult && !aiResult.error && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: colors.gold, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon type="sparkle" size={16} color={colors.gold} />
                AI深掘り解説
              </h3>

              {[
                { key: "interpretation", label: "意味と解釈", icon: "📖" },
                { key: "history", label: "歴史的背景・出典", icon: "📜" },
                { key: "tea_connection", label: "茶道との関わり", icon: "🍵" },
                { key: "season_relation", label: "季節との関連", icon: "🌿" },
              ].map(item => aiResult[item.key] && (
                <div key={item.key} style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: colors.textPrimary }}>
                    {aiResult[item.key]}
                  </p>
                </div>
              ))}
            </div>
          )}

          {aiResult?.error && (
            <div style={{ ...s.card, background: "#FEF0F0", border: "none", marginTop: 16 }}>
              <p style={{ fontSize: 13, color: "#A33" }}>{aiResult.error}</p>
              <button onClick={() => fetchAiExplanation(z)} style={{ ...s.btn("sm"), marginTop: 8 }}>再試行</button>
            </div>
          )}

          {/* Source info for custom entries */}
          {z.custom && z.source && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12, color: colors.textSecondary }}>
                <span style={{ fontWeight: 500 }}>出典: </span>{z.source}
              </p>
            </div>
          )}

          {/* Learned date for custom entries */}
          {z.custom && z.learnedAt && (
            <p style={{ fontSize: 12, color: colors.textTertiary, marginTop: 6 }}>
              お稽古で習った日: {z.learnedAt}
            </p>
          )}

          {/* Usage recorder */}
          <UsageRecorder zen={z} />

          {/* Custom item actions */}
          {z.custom && (
            <div style={{ display: "flex", gap: 12, marginTop: 16, borderTop: `0.5px solid ${colors.border}`, paddingTop: 16 }}>
              <button
                onClick={() => { setEditZenTarget(z); setAddZenModal(true); setSelectedZen(null); setAiResult(null); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: colors.accent, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <Icon type="edit" size={14} color={colors.accent} />
                編集
              </button>
              <button
                onClick={() => { if (confirm("この禅語・銘を削除しますか？")) deleteCustomZen(z.id); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#C77", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <Icon type="trash" size={14} color="#C77" />
                削除
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ZenScreen = () => (
    <div style={s.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={s.heading}>禅語・茶杓の銘</h2>
        <button onClick={() => { setEditZenTarget(null); setAddZenModal(true); }} style={{ ...s.btn("accent"), display: "flex", alignItems: "center", gap: 4, padding: "8px 14px" }}>
          <Icon type="plus" size={16} color="#fff" />
          <span>追加</span>
        </button>
      </div>
      <p style={s.subheading}>季節の言葉を学び、お稽古に活かしましょう</p>

      {/* Month selector */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setZenMonth(i)}
            style={{
              ...s.pill(zenMonth === i),
              minWidth: 40,
              ...(i === currentMonth && zenMonth !== i ? { borderColor: colors.accentSoft } : {}),
            }}>
            {m}
          </button>
        ))}
      </div>

      {/* Type filter + source filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={() => setZenTypeFilter("all")} style={s.pill(zenTypeFilter === "all")}>すべて</button>
        <button onClick={() => setZenTypeFilter("禅語")} style={s.pill(zenTypeFilter === "禅語")}>禅語</button>
        <button onClick={() => setZenTypeFilter("銘")} style={s.pill(zenTypeFilter === "銘")}>銘</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button onClick={() => setZenSourceFilter("all")} style={s.pill(zenSourceFilter === "all")}>全て表示</button>
        <button onClick={() => setZenSourceFilter("custom")} style={{
          ...s.pill(zenSourceFilter === "custom"),
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon type="user" size={12} color={zenSourceFilter === "custom" ? colors.accent : colors.textSecondary} />
          自分の銘
          {customZen.length > 0 && <span style={{ fontSize: 10, opacity: 0.7 }}>({customZen.length})</span>}
        </button>
        <button onClick={() => setZenSourceFilter("builtin")} style={s.pill(zenSourceFilter === "builtin")}>収録済み</button>
      </div>

      {/* Zen list */}
      {filteredZen.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: colors.textTertiary }}>
          <Icon type="book" size={32} color={colors.border} />
          <p style={{ marginTop: 12, fontSize: 13 }}>
            {zenSourceFilter === "custom" ? "自分の禅語・銘はまだありません" : "該当する禅語・銘がありません"}
          </p>
          {zenSourceFilter === "custom" && (
            <button onClick={() => { setEditZenTarget(null); setAddZenModal(true); }} style={{ ...s.btn("accent"), marginTop: 16 }}>
              最初の銘を追加
            </button>
          )}
        </div>
      ) : (
        filteredZen.map(z => {
          const isFav = zenFavorites.includes(z.name);
          const usageCount = z.custom
            ? (z.usedDates || []).length
            : (zenUsage[z.name] || []).length;
          return (
            <div key={(z.custom ? "c-"+z.id : z.name) + z.month} onClick={() => setSelectedZen(z)}
              style={{ ...s.card, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: serifFont, fontSize: 17, fontWeight: 400, letterSpacing: "0.08em" }}>{z.name}</span>
                  <span style={{
                    fontSize: 10, color: z.type === "禅語" ? colors.fuji : colors.accent,
                    background: z.type === "禅語" ? colors.fujiLight : colors.accentLight,
                    padding: "2px 8px", borderRadius: 6,
                  }}>{z.type}</span>
                  {z.custom && (
                    <span style={{
                      fontSize: 10, color: colors.gold, background: colors.goldLight,
                      padding: "2px 8px", borderRadius: 6,
                    }}>自分の銘</span>
                  )}
                  {usageCount > 0 && (
                    <span style={{ fontSize: 10, color: colors.textTertiary }}>
                      使用{usageCount}回
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: colors.textTertiary }}>{z.reading}</p>
                <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 1.5,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
                  {z.meaning}
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleZenFav(z.name); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 8, flexShrink: 0 }}
              >
                <Icon type={isFav ? "heartFill" : "heart"} size={20} color={isFav ? "#D4537E" : colors.border} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );

  // ============================================================
  // FAVORITES SCREEN
  // ============================================================
  const FavoritesScreen = () => {
    const favVideos = videos.filter(v => v.favorite);
    return (
      <div style={s.section}>
        <h2 style={s.heading}>お気に入り</h2>

        {/* Zen favorites */}
        {favoriteZenItems.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: colors.textSecondary, marginBottom: 12 }}>禅語・銘</h3>
            {favoriteZenItems.map(z => (
              <div key={z.name} onClick={() => { setSelectedZen(z); }}
                style={{ ...s.card, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: serifFont, fontSize: 17, letterSpacing: "0.08em" }}>{z.name}</span>
                    <span style={{ fontSize: 10, color: colors.fuji, background: colors.fujiLight, padding: "2px 8px", borderRadius: 6 }}>{z.type}</span>
                  </div>
                  <p style={{ fontSize: 12, color: colors.textTertiary }}>{z.reading}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleZenFav(z.name); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
                  <Icon type="heartFill" size={20} color="#D4537E" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Video favorites */}
        {favVideos.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: colors.textSecondary, marginBottom: 12 }}>動画</h3>
            {favVideos.map(v => (
              <div key={v.id} onClick={() => { setVideoDetail(v); setTab("video"); }}
                style={{ ...s.card, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
                {getYouTubeId(v.url) && (
                  <img src={`https://img.youtube.com/vi/${getYouTubeId(v.url)}/mqdefault.jpg`}
                    style={{ width: 96, height: 54, borderRadius: 8, objectFit: "cover" }} alt="" />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
                  <p style={{ fontSize: 11, color: colors.textTertiary }}>{v.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {favoriteZenItems.length === 0 && favVideos.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: colors.textTertiary }}>
            <Icon type="heart" size={32} color={colors.border} />
            <p style={{ marginTop: 12, fontSize: 13 }}>お気に入りはまだありません</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>禅語や動画のハートをタップして追加しましょう</p>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={s.app}>
      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: tab !== "home" ? `0.5px solid ${colors.border}` : "none",
      }}>
        <h1 style={{
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "0.15em",
          color: colors.textPrimary,
        }}>
          茶録
        </h1>
        <span style={{ fontSize: 11, color: colors.textTertiary, letterSpacing: "0.05em" }}>Charoku</span>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 8 }}>
        {tab === "home" && <HomeScreen />}
        {tab === "video" && <VideoScreen />}
        {tab === "zen" && <ZenScreen />}
        {tab === "fav" && <FavoritesScreen />}
      </div>

      {/* Modals */}
      {videoModal && <AddVideoModal />}
      {videoDetail && <VideoDetailModal />}
      {selectedZen && <ZenDetailModal />}
      {(addZenModal || editZenTarget) && <AddZenModal />}

      {/* Tab Bar */}
      <div style={s.tabBar}>
        {[
          { id: "home", label: "ホーム", icon: "home" },
          { id: "video", label: "動画", icon: "video" },
          { id: "zen", label: "禅語・銘", icon: "book" },
          { id: "fav", label: "お気に入り", icon: "heart" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={s.tabItem(tab === t.id)}>
            <Icon type={t.icon} size={22} color={tab === t.id ? colors.accent : colors.textTertiary} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
