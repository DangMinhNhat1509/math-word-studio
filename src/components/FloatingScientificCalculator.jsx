import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/floating-scientific-calculator.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const defaultPosition = () => {
  if (typeof window === "undefined") return { x: 900, y: 80 };

  return {
    x: Math.max(16, window.innerWidth - 390),
    y: 80,
  };
};

function factorial(n) {
  if (!Number.isFinite(n) || n < 0 || Math.floor(n) !== n) {
    throw new Error("Math ERROR");
  }

  if (n > 170) throw new Error("Overflow");

  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

function formatResult(value) {
  if (!Number.isFinite(value)) return "Math ERROR";

  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-9)) {
    return value.toExponential(10).replace(/\.?0+e/, "e");
  }

  return String(Number(value.toPrecision(13)));
}

function normalizeExpression(rawExpression, ansValue) {
  return rawExpression
    .replaceAll("Ans", `(${ansValue})`)
    .replaceAll("π", "PI")
    .replaceAll("×10^", "*10**")
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("^", "**")
    .replaceAll("√", "sqrt")
    .replace(/(\d+(\.\d+)?)%/g, "($1/100)")
    .replace(/(\d+)!/g, "factorial($1)");
}

function evaluateExpression(rawExpression, mode, ansValue) {
  const expression = normalizeExpression(rawExpression, ansValue);

  const allowedNames = new Set([
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "sqrt",
    "log",
    "ln",
    "abs",
    "factorial",
    "PI",
    "E",
  ]);

  const tokens = expression.match(/[A-Za-z_]+/g) || [];

  for (const token of tokens) {
    if (!allowedNames.has(token)) throw new Error("Syntax ERROR");
  }

  if (!/^[0-9+\-*/().,\s!*A-Za-z_]+$/.test(expression)) {
    throw new Error("Syntax ERROR");
  }

  const toRad = (x) => (mode === "DEG" ? (x * Math.PI) / 180 : x);
  const fromRad = (x) => (mode === "DEG" ? (x * 180) / Math.PI : x);

  const scope = {
    sin: (x) => Math.sin(toRad(x)),
    cos: (x) => Math.cos(toRad(x)),
    tan: (x) => Math.tan(toRad(x)),
    asin: (x) => fromRad(Math.asin(x)),
    acos: (x) => fromRad(Math.acos(x)),
    atan: (x) => fromRad(Math.atan(x)),
    sqrt: Math.sqrt,
    log: Math.log10,
    ln: Math.log,
    abs: Math.abs,
    factorial,
    PI: Math.PI,
    E: Math.E,
  };

  const fn = new Function(
    ...Object.keys(scope),
    `"use strict"; return (${expression});`
  );

  return fn(...Object.values(scope));
}

export default function FloatingScientificCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMini, setIsMini] = useState(false);
  const [mode, setMode] = useState("DEG");
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState("");
  const [answer, setAnswer] = useState("0");
  const [error, setError] = useState("");
  const [memory, setMemory] = useState(0);
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState({ width: 358, height: 610 });

  const pointerRef = useRef(null);

  const displayText = useMemo(() => {
    if (error) return error;
    return expression || answer || "0";
  }, [expression, answer, error]);

  useEffect(() => {
    function handlePointerMove(event) {
      if (!pointerRef.current) return;

      const data = pointerRef.current;

      if (data.type === "move") {
        setPosition({
          x: clamp(
            data.startX + event.clientX - data.clientX,
            8,
            window.innerWidth - 80
          ),
          y: clamp(
            data.startY + event.clientY - data.clientY,
            8,
            window.innerHeight - 48
          ),
        });
      }

      if (data.type === "resize") {
        setSize({
          width: clamp(
            data.startWidth + event.clientX - data.clientX,
            330,
            Math.min(460, window.innerWidth - 20)
          ),
          height: clamp(
            data.startHeight + event.clientY - data.clientY,
            520,
            Math.min(760, window.innerHeight - 20)
          ),
        });
      }
    }

    function handlePointerUp() {
      pointerRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function startMove(event) {
    if (event.target.closest("button")) return;

    pointerRef.current = {
      type: "move",
      clientX: event.clientX,
      clientY: event.clientY,
      startX: position.x,
      startY: position.y,
    };
  }

  function startResize(event) {
    event.preventDefault();
    event.stopPropagation();

    pointerRef.current = {
      type: "resize",
      clientX: event.clientX,
      clientY: event.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
  }

  function append(value) {
    setError("");
    setExpression((prev) => prev + value);
    setShift(false);
    setAlpha(false);
  }

  function clearAll() {
    setExpression("");
    setHistory("");
    setError("");
    setShift(false);
    setAlpha(false);
  }


  function deleteLast() {
    setError("");
    setExpression((prev) => prev.slice(0, -1));
  }

  function calculate() {
    if (!expression.trim()) return;

    try {
      const result = evaluateExpression(expression, mode, Number(answer || 0));
      const formatted = formatResult(result);

      setHistory(`${expression}=`);
      setAnswer(formatted);
      setExpression("");
      setError("");
      setShift(false);
      setAlpha(false);
    } catch (err) {
      setError(err.message || "Math ERROR");
    }
  }

  function handleButton(btn) {
    if (btn.action === "shift") {
      setShift((prev) => !prev);
      setAlpha(false);
      return;
    }

    if (btn.action === "alpha") {
      setAlpha((prev) => !prev);
      setShift(false);
      return;
    }

    if (btn.action === "mode") {
      setMode((prev) => (prev === "DEG" ? "RAD" : "DEG"));
      return;
    }

    if (btn.action === "clear") {
      clearAll();
      return;
    }

    if (btn.action === "delete") {
      deleteLast();
      return;
    }

    if (btn.action === "equal") {
      calculate();
      return;
    }

    if (btn.action === "ans") {
      append("Ans");
      return;
    }

    if (btn.action === "memoryAdd") {
      setMemory((prev) => prev + Number(answer || 0));
      return;
    }

    if (btn.action === "memoryRead") {
      append(String(memory));
      return;
    }

    if (btn.action === "toggleSign") {
      if (!expression) append("−");
      else setExpression((prev) => `−(${prev})`);
      return;
    }

    if (btn.action === "fraction") {
      append("(");
      return;
    }

    if (btn.action === "power") {
      append("^");
      return;
    }

    if (btn.action === "square") {
      append("^2");
      return;
    }

    if (btn.action === "inverse") {
      append("^-1");
      return;
    }

    if (btn.action === "sqrt") {
      append("√(");
      return;
    }

    if (btn.action === "func") {
      append(`${btn.value}(`);
      return;
    }

    if (btn.value) append(btn.value);
  }

  function handleKeyDown(event) {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
      append(key);
      event.preventDefault();
      return;
    }

    const map = {
      "+": "+",
      "-": "−",
      "*": "×",
      "/": "÷",
      "(": "(",
      ")": ")",
      "^": "^",
      "%": "%",
    };

    if (map[key]) {
      append(map[key]);
      event.preventDefault();
      return;
    }

    if (key === "Enter") {
      calculate();
      event.preventDefault();
      return;
    }

    if (key === "Backspace") {
      deleteLast();
      event.preventDefault();
      return;
    }

    if (key === "Escape") {
      setIsOpen(false);
      event.preventDefault();
    }
  }

  const keys = [
    { main: "SHIFT", action: "shift", tone: "shift" },
    { main: "ALPHA", action: "alpha", tone: "alpha" },
    { main: "MENU", value: "", tone: "top" },
    { main: "SETUP", action: "mode", tone: "top", top: mode },
    { main: "OPTN", value: "", tone: "top" },
    { main: "CALC", value: "", tone: "top" },

    { main: "x⁻¹", action: "inverse", top: "Abs" },
    { main: "a/b", action: "fraction", top: "d/c" },
    { main: "√", action: "sqrt", top: "³√" },
    { main: "x²", action: "square", top: "x³" },
    { main: "^", action: "power", top: "x√" },
    { main: "log", action: "func", value: "log", top: "10ˣ" },

    { main: "ln", action: "func", value: "ln", top: "eˣ" },
    { main: "−", action: "toggleSign", top: "A" },
    { main: "° ′ ″", value: "", top: "B" },
    { main: "hyp", value: "", top: "C" },
    { main: "sin", action: "func", value: "sin", top: "sin⁻¹" },
    { main: "cos", action: "func", value: "cos", top: "cos⁻¹" },

    { main: "tan", action: "func", value: "tan", top: "tan⁻¹" },
    { main: "RCL", action: "memoryRead", top: "STO" },
    { main: "ENG", value: "", top: "←" },
    { main: "(", value: "(", top: "D" },
    { main: ")", value: ")", top: "E" },
    { main: "S⇔D", value: "", top: "F" },

    { main: "7", value: "7", tone: "number" },
    { main: "8", value: "8", tone: "number" },
    { main: "9", value: "9", tone: "number" },
    { main: "DEL", action: "delete", tone: "delete" },
    { main: "AC", action: "clear", tone: "ac" },
    { main: "÷", value: "÷", tone: "operator" },

    { main: "4", value: "4", tone: "number" },
    { main: "5", value: "5", tone: "number" },
    { main: "6", value: "6", tone: "number" },
    { main: "×", value: "×", tone: "operator" },
    { main: "π", value: "π", tone: "operator" },
    { main: "%", value: "%", tone: "operator" },

    { main: "1", value: "1", tone: "number" },
    { main: "2", value: "2", tone: "number" },
    { main: "3", value: "3", tone: "number" },
    { main: "+", value: "+", tone: "operator" },
    { main: "−", value: "−", tone: "operator" },
    { main: "M+", action: "memoryAdd", tone: "operator" },

    { main: "0", value: "0", tone: "number" },
    { main: ".", value: ".", tone: "number" },
    { main: "×10ˣ", value: "×10^", tone: "number" },
    { main: "Ans", action: "ans", tone: "number" },
    { main: "=", action: "equal", tone: "equal", wide: true },
  ];

  if (!isOpen) {
    return (
      <button
        className="fx580-launcher"
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsMini(false);
        }}
        title="Mở máy tính fx-580"
      >
        580
      </button>
    );
  }

  return (
    <section
      className={`fx580 ${isMini ? "is-mini" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${isMini ? 280 : size.width}px`,
        height: `${isMini ? 46 : size.height}px`,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Máy tính fx-580 nổi"
    >
      <header className="fx580-titlebar" onPointerDown={startMove}>
        <div className="fx580-window-name">
          <strong>fx-580VN X</strong>
          <span>floating</span>
        </div>

        <div className="fx580-window-actions">
          <button type="button" onClick={() => setIsMini((prev) => !prev)}>
            {isMini ? "▢" : "—"}
          </button>
          <button type="button" onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>
      </header>

      {!isMini && (
        <>
          <div className="fx580-body">
            <div className="fx580-brand-row">
              <div>
                <div className="fx580-brand">CLASSWIZ STYLE</div>
                <div className="fx580-model">fx-580VN X</div>
              </div>

              <div className="fx580-solar">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="fx580-screen">
              <div className="fx580-screen-status">
                <span>{shift ? "S" : ""}</span>
                <span>{alpha ? "A" : ""}</span>
                <span>{memory !== 0 ? "M" : ""}</span>
                <span>{mode}</span>
              </div>

              <div className="fx580-history">{history}</div>

              <div className={`fx580-display ${error ? "has-error" : ""}`}>
                {displayText}
              </div>
            </div>

            <div className="fx580-round-pad">
              <button type="button">▲</button>
              <button type="button">◀</button>
              <div className="fx580-ok">OK</div>
              <button type="button">▶</button>
              <button type="button">▼</button>
            </div>

            <div className="fx580-keypad">
              {keys.map((key, index) => (
                <button
                  key={`${key.main}-${index}`}
                  type="button"
                  className={[
                    "fx580-key",
                    key.tone ? `tone-${key.tone}` : "",
                    key.wide ? "is-wide" : "",
                    shift && key.top ? "is-shift-ready" : "",
                  ].join(" ")}
                  onClick={() => handleButton(key)}
                >
                  {key.top && <span className="fx580-key-top">{key.top}</span>}
                  <span className="fx580-key-main">{key.main}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="fx580-resize"
            onPointerDown={startResize}
            title="Kéo để đổi kích thước"
          />
        </>
      )}
    </section>
  );
}