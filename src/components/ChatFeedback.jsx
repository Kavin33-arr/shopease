// ChatFeedback.jsx — FINAL (payload shape confirmed)

import { useEffect, useRef, useState, useCallback } from "react";

const ENDPOINT = "https://hibizdemo.my.site.com/apex/FeedbackProxy";
;

const REASONS = ["Inaccurate", "Unhelpful", "Off-topic", "Too long", "Other"];

export default function ChatFeedback() {
  const [pending, setPending]         = useState(null);
  const [showReasons, setShowReasons] = useState(false);
  const [reasonText, setReasonText]   = useState("");
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const rated = useRef(new Set());

  useEffect(() => {
    const onMessageSent = (e) => {
      // ✅ Confirmed payload shape:
      // e.detail = { conversationEntry: { identifier, sender: { role }, entryPayload: "JSON string" } }
      const entry = e.detail?.conversationEntry;
      if (!entry) return;

      const role  = entry.sender?.role;   // confirmed: "Chatbot"
      const msgId = entry.identifier;     // confirmed: "1773678268745-REQ-1"

      if (
        (role === "Chatbot" || role === "Bot" || role === "Agent") &&
        msgId &&
        !rated.current.has(msgId)
      ) {
        // ✅ entryPayload is a JSON string — must parse it
        let text = "";
        try {
          const parsed = JSON.parse(entry.entryPayload);
          text =
            parsed?.abstractMessage?.staticContent?.message ||
            parsed?.abstractMessage?.text ||
            "";
        } catch {
          text = "";
        }

        setTimeout(() => {
          setPending({ id: msgId, generationId: msgId, text });
          setSubmitted(false);
          setShowReasons(false);
          setReasonText("");
        }, 700);
      }
    };

    window.addEventListener("onEmbeddedMessageSent", onMessageSent);
    return () => window.removeEventListener("onEmbeddedMessageSent", onMessageSent);
  }, []);

  const submitFeedback = useCallback(
    async (sentiment) => {
      if (!pending) return;
      setSubmitting(true);
      try {
        const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    body: JSON.stringify({
      id:           crypto.randomUUID(),
      generationId: pending.generationId,
      sentiment:    sentiment,
      reasonText:   reasonText || null,
    })
  })
});
        const data = await res.json();
        if (data.success) {
          rated.current.add(pending.id);
          setSubmitted(true);
          setTimeout(() => setPending(null), 2200);
        }
      } catch (err) {
        console.error("Feedback error:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [pending, reasonText]
  );

  const onThumb        = (dir) => dir === "down" ? setShowReasons(true) : submitFeedback("Positive");
  const onReasonSubmit = () => { setShowReasons(false); submitFeedback("Negative"); };
  const onDismiss      = () => { if (pending) rated.current.add(pending.id); setPending(null); };

  if (!pending) return null;

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        {submitted && (
          <div style={S.row}>
            <span style={S.check}>✓</span>
            <span style={S.thanksTxt}>Thanks for your feedback!</span>
          </div>
        )}
        {!submitted && showReasons && (
          <div style={S.col}>
            <span style={S.label}>What went wrong?</span>
            <div style={S.chipRow}>
              {REASONS.map((r) => (
                <button
                  key={r}
                  style={{ ...S.chip, ...(reasonText === r ? S.chipOn : {}) }}
                  onClick={() => setReasonText(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              style={S.ta}
              rows={2}
              placeholder="Additional details (optional)"
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />
            <div style={S.row}>
              <button style={S.ghost} onClick={() => setShowReasons(false)}>Cancel</button>
              <button style={S.primary} disabled={submitting} onClick={onReasonSubmit}>
                {submitting ? "Sending…" : "Submit"}
              </button>
            </div>
          </div>
        )}
        {!submitted && !showReasons && (
          <div style={S.row}>
            <span style={S.question}>Was this helpful?</span>
            <button style={S.thumb} title="Yes" onClick={() => onThumb("up")}>👍</button>
            <button style={S.thumb} title="No"  onClick={() => onThumb("down")}>👎</button>
            <button style={S.close} onClick={onDismiss}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  wrap:     { position:"fixed", bottom:96, right:20, zIndex:9999, fontFamily:"system-ui,sans-serif" },
  card:     { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, boxShadow:"0 4px 20px rgba(0,0,0,.10)", padding:"12px 16px", minWidth:240, maxWidth:320 },
  row:      { display:"flex", alignItems:"center", gap:8 },
  col:      { display:"flex", flexDirection:"column", gap:10 },
  question: { flex:1, fontSize:13, color:"#475569", fontWeight:500 },
  thumb:    { background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"4px 10px", fontSize:18, cursor:"pointer", lineHeight:1.3 },
  close:    { background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:13, padding:"2px 4px" },
  check:    { background:"#dcfce7", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#16a34a", flexShrink:0 },
  thanksTxt:{ fontSize:13, color:"#16a34a", fontWeight:500 },
  label:    { fontSize:13, fontWeight:600, color:"#1e293b", margin:0 },
  chipRow:  { display:"flex", flexWrap:"wrap", gap:6 },
  chip:     { background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:20, padding:"3px 10px", fontSize:12, cursor:"pointer", color:"#475569" },
  chipOn:   { background:"#dbeafe", border:"1px solid #93c5fd", color:"#1d4ed8" },
  ta:       { width:"100%", padding:8, border:"1px solid #e2e8f0", borderRadius:8, fontSize:12, boxSizing:"border-box", resize:"vertical", outline:"none", color:"#1e293b" },
  ghost:    { background:"none", border:"1px solid #e2e8f0", borderRadius:8, padding:"5px 14px", fontSize:12, cursor:"pointer", color:"#64748b" },
  primary:  { background:"#2563eb", border:"none", borderRadius:8, padding:"5px 14px", fontSize:12, cursor:"pointer", color:"#fff", fontWeight:600, marginLeft:"auto" },
};
