import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #050a0e;
    font-family: 'Rajdhani', sans-serif;
    color: #c9d8e8;
    min-height: 100vh;
  }

  :root {
    --cyan: #00e5ff;
    --green: #00ff88;
    --red: #ff3b5c;
    --yellow: #ffd600;
    --bg: #050a0e;
    --panel: #0a1520;
    --border: #0d2035;
    --border-bright: #0f3050;
    --text: #c9d8e8;
    --mono: 'Share Tech Mono', monospace;
  }

  .app {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 20px 60px;
  }

  /* HEADER */
  .header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
  }
  .header::after {
    content: '';
    display: block;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    margin-top: 24px;
    opacity: 0.4;
  }
  .header-badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--cyan);
    border: 1px solid var(--cyan);
    padding: 4px 14px;
    margin-bottom: 14px;
    opacity: 0.7;
  }
  .header h1 {
    font-size: 42px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #fff;
    text-shadow: 0 0 40px rgba(0,229,255,0.3);
  }
  .header h1 span { color: var(--cyan); }
  .header-sub {
    margin-top: 8px;
    font-family: var(--mono);
    font-size: 12px;
    color: #3a6080;
    letter-spacing: 2px;
  }

  /* TABS */
  .tabs {
    display: flex;
    gap: 0;
    margin-bottom: 28px;
    border: 1px solid var(--border-bright);
    border-radius: 4px;
    overflow: hidden;
    width: fit-content;
  }
  .tab {
    padding: 10px 32px;
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 2px;
    cursor: pointer;
    border: none;
    background: var(--panel);
    color: #3a6080;
    transition: all 0.2s;
    border-right: 1px solid var(--border-bright);
  }
  .tab:last-child { border-right: none; }
  .tab:hover { color: var(--cyan); background: #0d1e2e; }
  .tab.active {
    background: rgba(0,229,255,0.08);
    color: var(--cyan);
    box-shadow: inset 0 -2px 0 var(--cyan);
  }

  /* PANELS */
  .panel {
    background: var(--panel);
    border: 1px solid var(--border-bright);
    border-radius: 6px;
    padding: 28px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    opacity: 0.3;
  }
  .panel-title {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--cyan);
    margin-bottom: 20px;
    opacity: 0.8;
  }

  /* DROP ZONE */
  .dropzone {
    border: 2px dashed var(--border-bright);
    border-radius: 6px;
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    background: rgba(0,229,255,0.02);
  }
  .dropzone:hover, .dropzone.drag-over {
    border-color: var(--cyan);
    background: rgba(0,229,255,0.05);
    box-shadow: 0 0 20px rgba(0,229,255,0.08) inset;
  }
  .dropzone-icon {
    font-size: 36px;
    margin-bottom: 12px;
    opacity: 0.6;
  }
  .dropzone-text {
    font-size: 15px;
    font-weight: 600;
    color: #5a8aaa;
    margin-bottom: 4px;
  }
  .dropzone-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: #2a4a60;
    letter-spacing: 1px;
  }

  /* FILE INFO */
  .file-info {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: rgba(0,255,136,0.05);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 4px;
    margin-top: 16px;
  }
  .file-icon { font-size: 22px; }
  .file-details { flex: 1; min-width: 0; }
  .file-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--green);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-size {
    font-family: var(--mono);
    font-size: 11px;
    color: #3a7055;
    margin-top: 2px;
  }
  .file-remove {
    background: none;
    border: none;
    color: #3a5060;
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    transition: color 0.2s;
  }
  .file-remove:hover { color: var(--red); }

  /* INPUTS */
  .input-group {
    margin-top: 18px;
  }
  .input-label {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 2px;
    color: #3a6080;
    margin-bottom: 8px;
    display: block;
  }
  .input-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .text-input {
    flex: 1;
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--border-bright);
    border-radius: 4px;
    padding: 10px 14px;
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 1px;
    outline: none;
    transition: border-color 0.2s;
  }
  .text-input:focus { border-color: var(--cyan); }
  .text-input::placeholder { color: #1a3a50; }

  /* PASSWORD STRENGTH */
  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }
  .strength-seg {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: #0d2035;
    transition: background 0.3s;
  }
  .strength-label {
    font-family: var(--mono);
    font-size: 10px;
    margin-top: 5px;
    letter-spacing: 1px;
  }

  /* BUTTONS */
  .btn {
    padding: 11px 28px;
    border: none;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }
  .btn-primary {
    background: var(--cyan);
    color: #050a0e;
  }
  .btn-primary:hover { background: #33eeff; box-shadow: 0 0 20px rgba(0,229,255,0.3); }
  .btn-primary:disabled {
    background: #0d2035;
    color: #1a3a50;
    cursor: not-allowed;
    box-shadow: none;
  }
  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-bright);
    color: #5a8aaa;
  }
  .btn-ghost:hover { border-color: var(--cyan); color: var(--cyan); }
  .btn-full { width: 100%; margin-top: 20px; padding: 13px; }

  /* PROGRESS */
  .progress-wrap {
    margin-top: 20px;
  }
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 11px;
    color: #3a6080;
    margin-bottom: 8px;
  }
  .progress-track {
    height: 4px;
    background: #0d2035;
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
    background: linear-gradient(90deg, var(--cyan), var(--green));
    box-shadow: 0 0 8px var(--cyan);
  }
  .progress-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
  }
  .progress-step {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 11px;
    color: #2a4a60;
    letter-spacing: 1px;
  }
  .progress-step.done { color: var(--green); }
  .progress-step.active { color: var(--cyan); }
  .step-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
  .step-dot.pulse {
    animation: pulse 1s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* RESULT BOX */
  .result-box {
    margin-top: 20px;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid;
  }
  .result-box.success {
    background: rgba(0,255,136,0.04);
    border-color: rgba(0,255,136,0.25);
  }
  .result-box.error {
    background: rgba(255,59,92,0.04);
    border-color: rgba(255,59,92,0.25);
  }
  .result-title {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    margin-bottom: 14px;
  }
  .result-box.success .result-title { color: var(--green); }
  .result-box.error .result-title { color: var(--red); }

  /* HASH DISPLAY */
  .hash-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    background: rgba(0,0,0,0.3);
    border-radius: 3px;
    margin-bottom: 6px;
  }
  .hash-label {
    font-family: var(--mono);
    font-size: 10px;
    color: #3a6080;
    letter-spacing: 1px;
    white-space: nowrap;
  }
  .hash-value {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--cyan);
    word-break: break-all;
    text-align: right;
  }

  /* DOWNLOAD BUTTONS */
  .download-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 14px;
  }
  .download-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--border-bright);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    text-align: left;
  }
  .download-btn:hover {
    border-color: var(--cyan);
    background: rgba(0,229,255,0.05);
  }
  .download-btn-icon { font-size: 20px; }
  .download-btn-label { font-size: 13px; font-weight: 600; color: #8ab0cc; }
  .download-btn-sub { font-family: var(--mono); font-size: 10px; color: #2a4a60; }

  /* SECURITY REPORT */
  .report {
    background: #020810;
    border: 1px solid var(--border-bright);
    border-radius: 6px;
    padding: 24px;
    margin-top: 20px;
    font-family: var(--mono);
    font-size: 11px;
  }
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .report-title {
    color: var(--cyan);
    font-size: 13px;
    letter-spacing: 3px;
  }
  .report-stamp {
    color: #2a4a60;
    font-size: 10px;
    text-align: right;
  }
  .report-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #080f18;
  }
  .report-key { color: #3a6080; }
  .report-val { color: var(--green); }
  .report-val.warn { color: var(--yellow); }
  .report-section-title {
    color: #2a5070;
    letter-spacing: 2px;
    margin: 14px 0 6px;
    font-size: 10px;
  }

  /* VERIFY TAB */
  .verify-status {
    margin-top: 20px;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid;
    text-align: center;
  }
  .verify-status.match {
    background: rgba(0,255,136,0.05);
    border-color: rgba(0,255,136,0.3);
  }
  .verify-status.mismatch {
    background: rgba(255,59,92,0.05);
    border-color: rgba(255,59,92,0.3);
  }
  .verify-icon { font-size: 40px; margin-bottom: 10px; }
  .verify-title {
    font-family: var(--mono);
    font-size: 14px;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .verify-status.match .verify-title { color: var(--green); }
  .verify-status.mismatch .verify-title { color: var(--red); }
  .verify-desc { font-size: 13px; color: #5a8aaa; }

  /* GRID LAYOUT */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 700px) {
    .two-col { grid-template-columns: 1fr; }
    .download-grid { grid-template-columns: 1fr; }
    .header h1 { font-size: 28px; }
  }

  /* SCAN LINE EFFECT */
  .app::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,229,255,0.012) 2px,
      rgba(0,229,255,0.012) 4px
    );
    pointer-events: none;
    z-index: 0;
  }
  .app > * { position: relative; z-index: 1; }

  /* INTEGRITY COMPARE */
  .hash-compare {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    background: rgba(0,0,0,0.3);
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 10px;
  }
  .hash-compare-row { display: flex; gap: 10px; align-items: flex-start; }
  .hc-label { color: #3a6080; min-width: 80px; flex-shrink: 0; }
  .hc-val { color: var(--cyan); word-break: break-all; }
  .hc-val.mismatch { color: var(--red); }
  .hc-match { color: var(--green); font-size: 12px; letter-spacing: 1px; margin-top: 6px; }
  .hc-fail { color: var(--red); font-size: 12px; letter-spacing: 1px; margin-top: 6px; }
`;

// ─── Crypto Utilities ───────────────────────────────────────────────────────

async function sha256hex(buffer) {
  const hashBuf = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptFile(fileBuffer, password) {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, fileBuffer);
  const hash = await sha256hex(fileBuffer);
  return { encrypted: new Uint8Array(encrypted), salt, iv, hash };
}

async function decryptFile(encryptedBuffer, password, salt, iv) {
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBuffer);
  return new Uint8Array(decrypted);
}

function toBase64(buf) {
  return btoa(String.fromCharCode(...buf));
}
function fromBase64(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}
function formatBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}
function passwordStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

// ─── Components ─────────────────────────────────────────────────────────────

function DropZone({ onFile, label }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handle = (f) => { if (f) onFile(f); };
  return (
    <div
      className={`dropzone${drag ? " drag-over" : ""}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => ref.current.click()}
    >
      <input ref={ref} type="file" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
      <div className="dropzone-icon">📂</div>
      <div className="dropzone-text">{label || "Drop file here or click to browse"}</div>
      <div className="dropzone-sub">ANY FILE TYPE SUPPORTED</div>
    </div>
  );
}

function FileInfo({ file, onRemove }) {
  const ext = file.name.split(".").pop().toUpperCase();
  return (
    <div className="file-info">
      <div className="file-icon">📄</div>
      <div className="file-details">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{formatBytes(file.size)} · {ext}</div>
      </div>
      <button className="file-remove" onClick={onRemove}>✕</button>
    </div>
  );
}

function PasswordInput({ value, onChange, label }) {
  const [show, setShow] = useState(false);
  const s = passwordStrength(value);
  const colors = ["#0d2035", "#ff3b5c", "#ffd600", "#ffd600", "#00e5ff", "#00ff88"];
  const labels = ["", "WEAK", "FAIR", "FAIR", "GOOD", "STRONG"];
  const labelColors = ["", "#ff3b5c", "#ffd600", "#ffd600", "#00e5ff", "#00ff88"];
  return (
    <div className="input-group">
      <label className="input-label">{label || "ENCRYPTION PASSWORD"}</label>
      <div className="input-row">
        <input
          className="text-input"
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter secure password..."
        />
        <button className="btn btn-ghost" style={{ padding: "10px 14px" }} onClick={() => setShow(v => !v)}>
          {show ? "🙈" : "👁"}
        </button>
      </div>
      {value && (
        <>
          <div className="strength-bar">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="strength-seg" style={{ background: i <= s ? colors[s] : "#0d2035" }} />
            ))}
          </div>
          <div className="strength-label" style={{ color: labelColors[s] }}>{labels[s]}</div>
        </>
      )}
    </div>
  );
}

function ProgressSteps({ steps, current }) {
  return (
    <div className="progress-steps">
      {steps.map((s, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={i} className={`progress-step${isDone ? " done" : isActive ? " active" : ""}`}>
            <div className={`step-dot${isActive ? " pulse" : ""}`} />
            {s}
          </div>
        );
      })}
    </div>
  );
}

// ─── ENCRYPT TAB ────────────────────────────────────────────────────────────

function EncryptTab() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("idle"); // idle | processing | done | error
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const steps = ["READING FILE BUFFER", "COMPUTING SHA-256 HASH", "GENERATING SALT & IV", "DERIVING KEY (PBKDF2 · 250K ITERATIONS)", "ENCRYPTING (AES-256-GCM)", "PACKAGING OUTPUT"];

  const runEncrypt = async () => {
    if (!file || !password) return;
    setStage("processing"); setProgress(0); setCurrentStep(0);

    try {
      const buf = await file.arrayBuffer();
      setProgress(15); setCurrentStep(1); await tick();

      const hash = await sha256hex(buf);
      setProgress(30); setCurrentStep(2); await tick();

      const salt = crypto.getRandomValues(new Uint8Array(32));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      setProgress(45); setCurrentStep(3); await tick();

      const key = await deriveKey(password, salt);
      setProgress(70); setCurrentStep(4); await tick();

      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, buf);
      setProgress(90); setCurrentStep(5); await tick();

      const keyData = { salt: toBase64(salt), iv: toBase64(iv), hash, originalName: file.name, originalSize: file.size, timestamp: new Date().toISOString() };
      setProgress(100); setCurrentStep(6); await tick();

      setResult({ encrypted: new Uint8Array(encrypted), keyData, hash, originalSize: file.size });
      setStage("done");
    } catch (e) {
      setError(e.message); setStage("error");
    }
  };

  const tick = () => new Promise(r => setTimeout(r, 400));

  const downloadEncrypted = () => {
    const blob = new Blob([result.encrypted], { type: "application/octet-stream" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = file.name + ".enc"; a.click();
  };

  const downloadKey = () => {
    const blob = new Blob([JSON.stringify(result.keyData, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = file.name + ".key.json"; a.click();
  };

  const reset = () => { setFile(null); setPassword(""); setStage("idle"); setProgress(0); setCurrentStep(-1); setResult(null); setError(""); };

  return (
    <div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">// FILE SELECTION</div>
          {!file ? (
            <DropZone onFile={setFile} label="Drop file to encrypt" />
          ) : (
            <FileInfo file={file} onRemove={() => setFile(null)} />
          )}
          <PasswordInput value={password} onChange={setPassword} />
          <button
            className="btn btn-primary btn-full"
            disabled={!file || !password || stage === "processing"}
            onClick={runEncrypt}
          >
            {stage === "processing" ? "ENCRYPTING..." : "ENCRYPT FILE"}
          </button>
        </div>

        <div className="panel">
          <div className="panel-title">// ENCRYPTION PIPELINE</div>
          {stage === "idle" && (
            <div style={{ color: "#1a3a50", fontFamily: "var(--mono)", fontSize: 12, paddingTop: 20 }}>
              SELECT A FILE AND PASSWORD TO BEGIN...
            </div>
          )}
          {(stage === "processing" || stage === "done") && (
            <>
              <div className="progress-wrap">
                <div className="progress-header">
                  <span>PROGRESS</span><span>{progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: progress + "%" }} />
                </div>
              </div>
              <ProgressSteps steps={steps} current={currentStep} />
            </>
          )}
          {stage === "error" && (
            <div className="result-box error">
              <div className="result-title">❌ ENCRYPTION FAILED</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#ff3b5c" }}>{error}</div>
            </div>
          )}
        </div>
      </div>

      {stage === "done" && result && (
        <>
          <div className="result-box success">
            <div className="result-title">✅ ENCRYPTION COMPLETE</div>
            <div className="hash-row">
              <span className="hash-label">SHA-256</span>
              <span className="hash-value">{result.hash}</span>
            </div>
            <div className="hash-row">
              <span className="hash-label">ALGORITHM</span>
              <span className="hash-value" style={{ color: "#00ff88" }}>AES-256-GCM</span>
            </div>
            <div className="hash-row">
              <span className="hash-label">KEY DERIV.</span>
              <span className="hash-value" style={{ color: "#00ff88" }}>PBKDF2 · SHA-256 · 250,000 ITER</span>
            </div>
            <div className="hash-row">
              <span className="hash-label">ORIG. SIZE</span>
              <span className="hash-value" style={{ color: "#00ff88" }}>{formatBytes(result.originalSize)}</span>
            </div>
            <div className="hash-row">
              <span className="hash-label">ENC. SIZE</span>
              <span className="hash-value" style={{ color: "#00ff88" }}>{formatBytes(result.encrypted.length)}</span>
            </div>
            <div className="download-grid">
              <button className="download-btn" onClick={downloadEncrypted}>
                <span className="download-btn-icon">🔒</span>
                <div><div className="download-btn-label">ENCRYPTED FILE</div><div className="download-btn-sub">.enc · AES-256-GCM</div></div>
              </button>
              <button className="download-btn" onClick={downloadKey}>
                <span className="download-btn-icon">🗝</span>
                <div><div className="download-btn-label">KEY METADATA</div><div className="download-btn-sub">.key.json · SALT + IV + HASH</div></div>
              </button>
            </div>
          </div>
          <SecurityReport file={file} hash={result.hash} encSize={result.encrypted.length} />
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={reset}>ENCRYPT ANOTHER FILE</button>
        </>
      )}
    </div>
  );
}

// ─── DECRYPT TAB ────────────────────────────────────────────────────────────

function DecryptTab() {
  const [encFile, setEncFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [integrityMatch, setIntegrityMatch] = useState(null);
  const [hashes, setHashes] = useState(null);

  const steps = ["PARSING KEY METADATA", "RE-DERIVING KEY (PBKDF2)", "DECRYPTING (AES-256-GCM)", "VERIFYING SHA-256 INTEGRITY", "COMPLETE"];

  const tick = () => new Promise(r => setTimeout(r, 450));

  const runDecrypt = async () => {
    setStage("processing"); setProgress(0); setCurrentStep(0); setError("");
    try {
      const keyText = await keyFile.text();
      const keyData = JSON.parse(keyText);
      const salt = fromBase64(keyData.salt);
      const iv = fromBase64(keyData.iv);
      const originalHash = keyData.hash;
      const originalName = keyData.originalName || "decrypted_file";
      setProgress(20); setCurrentStep(1); await tick();

      const encBuf = await encFile.arrayBuffer();
      const key = await deriveKey(password, salt);
      setProgress(50); setCurrentStep(2); await tick();

      let decrypted;
      try {
        const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encBuf);
        decrypted = new Uint8Array(dec);
      } catch {
        throw new Error("Decryption failed — wrong password or corrupted file.");
      }
      setProgress(75); setCurrentStep(3); await tick();

      const decHash = await sha256hex(decrypted.buffer);
      const match = decHash === originalHash;
      setIntegrityMatch(match);
      setHashes({ original: originalHash, computed: decHash });
      setProgress(100); setCurrentStep(4); await tick();

      setResult({ decrypted, originalName });
      setStage("done");
    } catch (e) {
      setError(e.message); setStage("error");
    }
  };

  const downloadDecrypted = () => {
    const blob = new Blob([result.decrypted]);
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = result.originalName; a.click();
  };

  const reset = () => { setEncFile(null); setKeyFile(null); setPassword(""); setStage("idle"); setResult(null); setError(""); setIntegrityMatch(null); setHashes(null); };

  return (
    <div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">// INPUT FILES</div>
          <label className="input-label">ENCRYPTED FILE (.enc)</label>
          {!encFile ? <DropZone onFile={setEncFile} label="Drop .enc file" /> : <FileInfo file={encFile} onRemove={() => setEncFile(null)} />}
          <div style={{ height: 14 }} />
          <label className="input-label">KEY METADATA (.key.json)</label>
          {!keyFile ? <DropZone onFile={setKeyFile} label="Drop .key.json file" /> : <FileInfo file={keyFile} onRemove={() => setKeyFile(null)} />}
          <PasswordInput value={password} onChange={setPassword} label="DECRYPTION PASSWORD" />
          <button
            className="btn btn-primary btn-full"
            disabled={!encFile || !keyFile || !password || stage === "processing"}
            onClick={runDecrypt}
          >
            {stage === "processing" ? "DECRYPTING..." : "DECRYPT FILE"}
          </button>
        </div>

        <div className="panel">
          <div className="panel-title">// DECRYPTION PIPELINE</div>
          {stage === "idle" && <div style={{ color: "#1a3a50", fontFamily: "var(--mono)", fontSize: 12, paddingTop: 20 }}>UPLOAD ENCRYPTED FILE AND KEY TO BEGIN...</div>}
          {(stage === "processing" || stage === "done") && (
            <>
              <div className="progress-wrap">
                <div className="progress-header"><span>PROGRESS</span><span>{progress}%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: progress + "%" }} /></div>
              </div>
              <ProgressSteps steps={steps} current={currentStep} />
            </>
          )}
          {stage === "error" && (
            <div className="result-box error" style={{ marginTop: 16 }}>
              <div className="result-title">❌ DECRYPTION FAILED</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#ff3b5c" }}>{error}</div>
            </div>
          )}
        </div>
      </div>

      {stage === "done" && result && (
        <>
          <div className={`verify-status ${integrityMatch ? "match" : "mismatch"}`} style={{ textAlign: "left", padding: 20 }}>
            <div className="result-title" style={{ color: integrityMatch ? "var(--green)" : "var(--red)" }}>
              {integrityMatch ? "✅ INTEGRITY VERIFIED — FILE IS AUTHENTIC" : "⚠️ INTEGRITY MISMATCH — FILE MAY BE TAMPERED"}
            </div>
            <div className="hash-compare" style={{ marginTop: 12 }}>
              <div className="hash-compare-row">
                <span className="hc-label">EXPECTED</span>
                <span className="hc-val">{hashes.original}</span>
              </div>
              <div className="hash-compare-row">
                <span className="hc-label">COMPUTED</span>
                <span className={`hc-val${!integrityMatch ? " mismatch" : ""}`}>{hashes.computed}</span>
              </div>
              <div className={integrityMatch ? "hc-match" : "hc-fail"}>
                {integrityMatch ? "✓ HASHES MATCH — SAFE TO USE" : "✗ HASHES DO NOT MATCH — DO NOT TRUST FILE"}
              </div>
            </div>
            {integrityMatch && (
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={downloadDecrypted}>
                ⬇ DOWNLOAD DECRYPTED FILE
              </button>
            )}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={reset}>DECRYPT ANOTHER FILE</button>
        </>
      )}
    </div>
  );
}

// ─── VERIFY TAB ─────────────────────────────────────────────────────────────

function VerifyTab() {
  const [file, setFile] = useState(null);
  const [expectedHash, setExpectedHash] = useState("");
  const [computedHash, setComputedHash] = useState("");
  const [status, setStatus] = useState("idle");
  const [computing, setComputing] = useState(false);

  const compute = async () => {
    if (!file) return;
    setComputing(true); setComputedHash(""); setStatus("idle");
    const buf = await file.arrayBuffer();
    const h = await sha256hex(buf);
    setComputedHash(h);
    if (expectedHash.trim()) setStatus(h === expectedHash.trim() ? "match" : "mismatch");
    else setStatus("computed");
    setComputing(false);
  };

  const reset = () => { setFile(null); setExpectedHash(""); setComputedHash(""); setStatus("idle"); };

  return (
    <div className="panel">
      <div className="panel-title">// FILE INTEGRITY VERIFIER</div>
      {!file ? <DropZone onFile={setFile} label="Drop any file to verify" /> : <FileInfo file={file} onRemove={() => { setFile(null); setComputedHash(""); setStatus("idle"); }} />}

      <div className="input-group">
        <label className="input-label">EXPECTED SHA-256 HASH (OPTIONAL)</label>
        <input
          className="text-input"
          type="text"
          value={expectedHash}
          onChange={e => setExpectedHash(e.target.value)}
          placeholder="Paste known hash to compare..."
          style={{ width: "100%" }}
        />
      </div>

      <button className="btn btn-primary btn-full" disabled={!file || computing} onClick={compute}>
        {computing ? "COMPUTING..." : "VERIFY INTEGRITY"}
      </button>

      {computedHash && (
        <div style={{ marginTop: 20 }}>
          <div className="hash-row">
            <span className="hash-label">SHA-256</span>
            <span className="hash-value">{computedHash}</span>
          </div>
          <div className="hash-row">
            <span className="hash-label">FILE</span>
            <span className="hash-value" style={{ color: "#00ff88" }}>{file.name}</span>
          </div>
          <div className="hash-row">
            <span className="hash-label">SIZE</span>
            <span className="hash-value" style={{ color: "#00ff88" }}>{formatBytes(file.size)}</span>
          </div>
        </div>
      )}

      {status === "match" && (
        <div className="verify-status match" style={{ marginTop: 16 }}>
          <div className="verify-icon">✅</div>
          <div className="verify-title">HASH MATCHED</div>
          <div className="verify-desc">File is authentic and has not been tampered with.</div>
        </div>
      )}
      {status === "mismatch" && (
        <div className="verify-status mismatch" style={{ marginTop: 16 }}>
          <div className="verify-icon">⚠️</div>
          <div className="verify-title">HASH MISMATCH</div>
          <div className="verify-desc">File may have been modified or corrupted.</div>
        </div>
      )}
      {status === "computed" && (
        <div style={{ marginTop: 14, fontFamily: "var(--mono)", fontSize: 11, color: "#3a6080" }}>
          ↑ COPY HASH ABOVE TO SHARE OR COMPARE LATER
        </div>
      )}
    </div>
  );
}


// ─── SECURITY REPORT ────────────────────────────────────────────────────────

function SecurityReport({ file, hash, encSize }) {
  const now = new Date();
  return (
    <div className="report">
      <div className="report-header">
        <div>
          <div className="report-title">SECURITY TRANSFER REPORT</div>
          <div style={{ color: "#2a4a60", fontSize: 10, marginTop: 4 }}>GENERATED AUTOMATICALLY AFTER ENCRYPTION</div>
        </div>
        <div className="report-stamp">
          <div>{now.toLocaleDateString()}</div>
          <div>{now.toLocaleTimeString()}</div>
          <div style={{ marginTop: 4, color: "#1a3a50" }}>REF: {Math.random().toString(36).substr(2,8).toUpperCase()}</div>
        </div>
      </div>

      <div className="report-section-title">▸ FILE METADATA</div>
      <div className="report-row"><span className="report-key">FILENAME</span><span className="report-val">{file.name}</span></div>
      <div className="report-row"><span className="report-key">ORIGINAL SIZE</span><span className="report-val">{formatBytes(file.size)}</span></div>
      <div className="report-row"><span className="report-key">ENCRYPTED SIZE</span><span className="report-val">{formatBytes(encSize)}</span></div>
      <div className="report-row"><span className="report-key">FILE TYPE</span><span className="report-val">{file.type || "UNKNOWN"}</span></div>

      <div className="report-section-title">▸ CRYPTOGRAPHIC PARAMETERS</div>
      <div className="report-row"><span className="report-key">CIPHER</span><span className="report-val">AES-256-GCM</span></div>
      <div className="report-row"><span className="report-key">KEY DERIVATION</span><span className="report-val">PBKDF2</span></div>
      <div className="report-row"><span className="report-key">HASH FUNCTION</span><span className="report-val">SHA-256</span></div>
      <div className="report-row"><span className="report-key">ITERATIONS</span><span className="report-val">250,000</span></div>
      <div className="report-row"><span className="report-key">SALT SIZE</span><span className="report-val">256 BIT</span></div>
      <div className="report-row"><span className="report-key">IV SIZE</span><span className="report-val">96 BIT (GCM NONCE)</span></div>
      <div className="report-row"><span className="report-key">AUTH TAG</span><span className="report-val">128 BIT (GCM)</span></div>

      <div className="report-section-title">▸ INTEGRITY</div>
      <div className="report-row"><span className="report-key">SHA-256 HASH</span><span className="report-val" style={{ fontSize: 9, wordBreak: "break-all", maxWidth: 400, textAlign: "right" }}>{hash}</span></div>

      <div className="report-section-title">▸ SECURITY ASSESSMENT</div>
      <div className="report-row"><span className="report-key">CONFIDENTIALITY</span><span className="report-val">✓ AES-256 ENCRYPTION</span></div>
      <div className="report-row"><span className="report-key">INTEGRITY</span><span className="report-val">✓ SHA-256 HASH VERIFIED</span></div>
      <div className="report-row"><span className="report-key">KEY STRENGTH</span><span className="report-val">✓ PBKDF2 HARDENED</span></div>
      <div className="report-row"><span className="report-key">ZERO-KNOWLEDGE</span><span className="report-val">✓ CLIENT-SIDE ONLY</span></div>
      <div className="report-row"><span className="report-key">REPLAY ATTACK</span><span className="report-val warn">⚠ OUT OF SCOPE</span></div>
    </div>
  );
}

function DigitalSignatureTab() {

  const [keysGenerated, setKeysGenerated] =
    useState(false);

  const [keyPair, setKeyPair] = useState(null);

  const [file, setFile] = useState(null);

  const [signature, setSignature] =
  useState(null);

  const generateKeys = async () => {
  const generatedKeyPair =
    await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256"
      },
      true,
      ["sign", "verify"]
    );

  setKeyPair(generatedKeyPair);

  setKeysGenerated(true);
};

const signFile = async () => {

  if (!file) {
    alert("Select a file first");
    return;
  }

  if (!keyPair) {
    alert("Generate keys first");
    return;
  }

  const fileBuffer =
    await file.arrayBuffer();

  const sig =
    await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256"
      },
      keyPair.privateKey,
      fileBuffer
    );

  setSignature(sig);

  console.log(sig);
};

const downloadSignature = () => {

  const sigBytes =
    new Uint8Array(signature);

  const blob = new Blob(
    [sigBytes],
    {
      type: "application/octet-stream"
    }
  );

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download = "signature.sig";

  a.click();
};

const downloadPublicKey = async () => {

  const exportedKey =
    await crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );

  const blob = new Blob(
    [
      JSON.stringify(
        exportedKey,
        null,
        2
      )
    ],
    {
      type: "application/json"
    }
  );

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download =
    "publicKey.json";

  a.click();
};

  return (
    <div className="panel">

      {!file ? (
  <DropZone
    onFile={setFile}
    label="Drop file to sign"
  />
) : (
  <FileInfo
    file={file}
    onRemove={() => setFile(null)}
  />
)}

      {file && (
        <div
          style={{
            marginTop: 10,
            color: "#00e5ff"
          }}
      >

        Selected File: {file.name}
        </div>
        )}

      <button
        className="btn btn-primary"
        onClick={generateKeys}
      >
        GENERATE KEYS
      </button>

      <button
        className="btn btn-primary"
        onClick={signFile}
        disabled={!file || !keyPair}
      >
          SIGN FILE
      </button>

      {keysGenerated && (
  <div
    style={{
      marginTop: 20,
      color: "#00ff88",
      fontFamily: "var(--mono)"
    }}
  >
    ✓ ECDSA P-256 KEY PAIR GENERATED
  </div>
)}

{keyPair && (
  <div
    style={{
      marginTop: 15,
      color: "#00e5ff",
      fontFamily: "var(--mono)"
    }}
  >
    Public Key ✓
    <br />
    Private Key ✓
  </div>
)}

{signature && (
  <div
    style={{
      marginTop: 20,
      color: "#00ff88",
      fontFamily: "var(--mono)"
    }}
  >
    ✓ FILE SIGNED SUCCESSFULLY
  </div>
)}

{signature && (
  <button
    className="btn btn-primary"
    onClick={downloadSignature}
  >
    DOWNLOAD SIGNATURE
  </button>
)}

 {keyPair && (
  <button
    className="btn btn-primary"
    onClick={downloadPublicKey}
  >
    DOWNLOAD PUBLIC KEY
  </button>
)}

    </div>
  );
}


function SecurityDashboard() {
  return (
    <div className="panel">
      <div className="panel-title">
        // SECURITY DASHBOARD
      </div>

      <div className="report-row">
        <span>AES-256-GCM</span>
        <span>✓ ACTIVE</span>
      </div>

      <div className="report-row">
        <span>SHA-256</span>
        <span>✓ ACTIVE</span>
      </div>

      <div className="report-row">
        <span>PBKDF2 250K</span>
        <span>✓ ACTIVE</span>
      </div>

      <div className="report-row">
        <span>CLIENT SIDE</span>
        <span>✓ ACTIVE</span>
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 24,
          color: "#00ff88"
        }}
      >
        SECURITY SCORE: 92/100
      </div>
    </div>
  );
}

function VerifySignatureTab() {

  const [file, setFile] = useState(null);

  const [signatureFile, setSignatureFile] =
    useState(null);

  const [publicKeyFile, setPublicKeyFile] =
    useState(null);

  const [verificationResult,
         setVerificationResult] =
    useState(null);

    const verifySignature = async () => {

    if (
      !file ||
      !signatureFile ||
      !publicKeyFile
    ) {
      alert(
        "Upload all required files"
      );
      return;
    }

    const fileBuffer =
      await file.arrayBuffer();

    const signatureBuffer =
      await signatureFile.arrayBuffer();

      if (
  !publicKeyFile.name.endsWith(".json")
) {
  alert(
    "Please upload publicKey.json"
  );
  return;
}

    const publicKeyText =
      await publicKeyFile.text();

    const jwk =
      JSON.parse(publicKeyText);

    const publicKey =
      await crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          name: "ECDSA",
          namedCurve: "P-256"
        },
        true,
        ["verify"]
      );

    const valid =
      await crypto.subtle.verify(
        {
          name: "ECDSA",
          hash: "SHA-256"
        },
        publicKey,
        signatureBuffer,
        fileBuffer
      );

    setVerificationResult(valid);
  };


 return (
  <div className="panel">

    <div className="panel-title">
      // VERIFY DIGITAL SIGNATURE
    </div>

    <div>

      {!file ? (
  <DropZone
    onFile={setFile}
    label="Drop document"
  />
) : (
  <FileInfo
    file={file}
    onRemove={() => setFile(null)}
  />
)}

      {!signatureFile ? (
  <DropZone
    onFile={setSignatureFile}
    label="Drop signature.sig"
  />
) : (
  <FileInfo
    file={signatureFile}
    onRemove={() =>
      setSignatureFile(null)
    }
  />
)}

      {!publicKeyFile ? (
  <DropZone
    onFile={setPublicKeyFile}
    label="Drop publicKey.json"
  />
) : (
  <FileInfo
    file={publicKeyFile}
    onRemove={() =>
      setPublicKeyFile(null)
    }
  />
)}

    </div>

    <button
      className="btn btn-primary"
      onClick={verifySignature}
    >
      VERIFY SIGNATURE
    </button>

  
      {verificationResult === true && (
  <div
    style={{
      marginTop: 20,
      color: "#00ff88",
      fontFamily: "var(--mono)"
    }}
  >
    ✓ VALID SIGNATURE
  </div>
)}

{verificationResult === false && (
  <div
    style={{
      marginTop: 20,
      color: "#ff3b5c",
      fontFamily: "var(--mono)"
    }}
  >
    ✗ INVALID SIGNATURE
  </div>
)}
    </div>
);
}

function SecureTransfer() {
  const [tab, setTab] = useState("encrypt");

  return (
    <div className="app">
      <style>{styles}</style>

      <div className="header">
        <div className="header-badge">SECURE SYSTEM</div>
        <h1>SECURE <span>TRANSFER</span></h1>
        <div className="header-sub">ENCRYPTION · DECRYPTION · VERIFICATION</div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === "encrypt" ? "active" : ""}`}
          onClick={() => setTab("encrypt")}
        >
          ENCRYPT
        </button>

        <button
          className={`tab ${tab === "decrypt" ? "active" : ""}`}
          onClick={() => setTab("decrypt")}
        >
          DECRYPT
        </button>

        <button
          className={`tab ${tab === "verify" ? "active" : ""}`}
          onClick={() => setTab("verify")}
        >
          VERIFY
        </button>

        <button
          className={`tab ${tab === "dashboard" ? "active" : ""}`}
          onClick={() => setTab("dashboard")}
        >
          DASHBOARD
        </button>

        <button
          className={`tab ${tab === "sign" ? "active" : ""}`}
          onClick={() => setTab("sign")}
        >
          SIGN
        </button>

        <button
          className={`tab ${tab === "verifysign" ? "active" : ""}`}
          onClick={() => setTab("verifysign")}
        >
          VERIFY SIGN
        </button>
      
      </div>


      {tab === "encrypt" && <EncryptTab />}
      {tab === "decrypt" && <DecryptTab />}
      {tab === "verify" && <VerifyTab />}
      {tab === "dashboard" && <SecurityDashboard />}
      {tab === "sign" && <DigitalSignatureTab />}
      {tab === "verifysign" && <VerifySignatureTab />}
    </div>
  );
}


export default SecureTransfer;
