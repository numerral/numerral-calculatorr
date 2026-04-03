"use client";
import { useState, useEffect } from "react";

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—";

interface HeightConverterProps {
  initialCm?: string;
  initialFt?: string;
  initialIn?: string;
  defaultMode?: "cm" | "imperial";
}

export default function HeightConverterCore({
  initialCm = "170",
  initialFt = "5",
  initialIn = "6.93",
  defaultMode = "cm",
}: HeightConverterProps) {
  const [cmStr, setCmStr] = useState<string>(initialCm);
  const [ftStr, setFtStr] = useState<string>(initialFt);
  const [inStr, setInStr] = useState<string>(initialIn);

  const [lastEdited, setLastEdited] = useState<"cm" | "imperial">(defaultMode);

  // Sync inputs based on last edited
  useEffect(() => {
    if (lastEdited === "cm") {
        const cm = parseFloat(cmStr) || 0;
        const totalInches = cm / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        
        if (ftStr !== ft.toString()) setFtStr(ft.toString());
        setInStr(inches === 0 ? "0" : Number(inches.toFixed(2)).toString());
    } else if (lastEdited === "imperial") {
        const ft = parseFloat(ftStr) || 0;
        const inches = parseFloat(inStr) || 0;
        const cm = (ft * 12 + inches) * 2.54;
        
        setCmStr(cm === 0 ? "" : Number(cm.toFixed(2)).toString());
    }
  }, [cmStr, ftStr, inStr, lastEdited]);

  const handleCmChange = (val: string) => {
    setLastEdited("cm");
    setCmStr(val);
  };

  const handleFtChange = (val: string) => {
    setLastEdited("imperial");
    setFtStr(val);
  };

  const handleInChange = (val: string) => {
    setLastEdited("imperial");
    setInStr(val);
  };

  const currentCm = parseFloat(cmStr) || 0;

  return (
    <div 
       style={{ 
           maxWidth: "680px", 
           margin: "0 auto", 
           background: "rgba(15, 23, 42, 0.7)", 
           backdropFilter: "blur(24px)",
           WebkitBackdropFilter: "blur(24px)",
           border: "1px solid rgba(255, 255, 255, 0.1)",
           borderRadius: "1.5rem",
           padding: "var(--s-6)",
           boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
           color: "#fff",
           overflow: "hidden"
       }}
    >
      <div style={{ textAlign: "center", marginBottom: "var(--s-8)" }}>
         <h2 style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: "var(--s-2)" }}>
            Current Height
         </h2>
         <div style={{ 
            fontSize: "clamp(2rem, 6vw, 4rem)", 
            fontWeight: 800, 
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            display: "inline-block",
            filter: "drop-shadow(0 4px 12px rgba(96, 165, 250, 0.3))" 
        }}>
            {ftStr || "0"}' {Number(inStr || 0).toFixed(1)}" = {Number(cmStr || 0).toFixed(1)} cm
        </div>
      </div>

      {/* Modern Slider Component */}
      <div style={{ marginBottom: "var(--s-8)", padding: "0 var(--s-2)" }}>
         <input 
            type="range" 
            min="120" 
            max="220" 
            step="0.5" 
            value={currentCm} 
            onChange={(e) => handleCmChange(e.target.value)}
            style={{
                width: "100%",
                accentColor: "#8b5cf6", // Purple accent
                cursor: "pointer",
                height: "8px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.1)",
                outline: "none"
            }}
         />
         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--s-2)", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: 500 }}>
             <span>120 cm (3' 11")</span>
             <span>220 cm (7' 2")</span>
         </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--s-6)" }}>
        
        {/* US Customary (Imperial) Glass Card */}
        <div style={{ 
            background: "rgba(255, 255, 255, 0.03)", 
            border: "1px solid rgba(255, 255, 255, 0.05)", 
            borderRadius: "1rem", 
            padding: "var(--s-5)",
        }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)", marginBottom: "var(--s-4)", fontWeight: 500, textTransform: "uppercase" }}>US Imperial</h3>
          <div style={{ display: "flex", gap: "var(--s-3)" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "var(--s-1)" }}>Feet</label>
                <input
                  type="number"
                  value={ftStr}
                  onChange={(e) => handleFtChange(e.target.value)}
                  placeholder="0"
                  min="0"
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem", color: "#fff", fontSize: "1.25rem", fontWeight: 600, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(139, 92, 246, 0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "var(--s-1)" }}>Inches</label>
                <input
                  type="number"
                  value={inStr}
                  onChange={(e) => handleInChange(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="12"
                  step="any"
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem", color: "#fff", fontSize: "1.25rem", fontWeight: 600, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(139, 92, 246, 0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
          </div>
        </div>

        {/* Metric Glass Card */}
        <div style={{ 
            background: "rgba(255, 255, 255, 0.03)", 
            border: "1px solid rgba(255, 255, 255, 0.05)", 
            borderRadius: "1rem", 
            padding: "var(--s-5)",
        }}>
          <h3 style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)", marginBottom: "var(--s-4)", fontWeight: 500, textTransform: "uppercase" }}>Metric</h3>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "var(--s-1)" }}>Centimeters</label>
            <input
              type="number"
              value={cmStr}
              onChange={(e) => handleCmChange(e.target.value)}
              placeholder="0"
              min="0"
              step="any"
              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem", color: "#fff", fontSize: "1.25rem", fontWeight: 600, outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "rgba(139, 92, 246, 0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
