export default function TriangleDiagram({ diagram, setDiagram, showGrid, showAxis }) {
  function update(key, value) {
    setDiagram((old) => ({ ...old, [key]: value }));
  }

  return (
    <div className="diagram">
      {showGrid && <div className="grid-layer" />}

      {showAxis && (
        <>
          <div className="axis-x" />
          <div className="axis-y" />
          <span className="axis-label x">x</span>
          <span className="axis-label y">y</span>
        </>
      )}

      <svg className="diagram-svg" viewBox="0 0 680 360">
        <path d="M150 275 L150 90 L470 275 Z" fill="rgba(248,250,252,.95)" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 250 L175 250 L175 275" fill="none" stroke="#0f172a" strokeWidth="3" />
        <circle cx="150" cy="275" r="7" fill="#0f172a" />
        <circle cx="150" cy="90" r="7" fill="#0f172a" />
        <circle cx="470" cy="275" r="7" fill="#0f172a" />
        <text x="126" y="302" fontSize="24" fontWeight="800" fill="#0f172a">{diagram.a}</text>
        <text x="124" y="80" fontSize="24" fontWeight="800" fill="#0f172a">{diagram.b}</text>
        <text x="485" y="302" fontSize="24" fontWeight="800" fill="#0f172a">{diagram.c}</text>
        <text x="92" y="186" fontSize="20" fontWeight="800" fill="#475569">{diagram.ab}</text>
        <text x="294" y="306" fontSize="20" fontWeight="800" fill="#475569">{diagram.ac}</text>
        <text x="315" y="166" fontSize="20" fontWeight="800" fill="#475569">{diagram.bc}</text>
      </svg>

      <div className="floating-editor">
        <b>Sửa nhanh hình</b>
        <div className="mini-grid">
          <input value={diagram.a} onChange={(e) => update("a", e.target.value)} placeholder="A" />
          <input value={diagram.b} onChange={(e) => update("b", e.target.value)} placeholder="B" />
          <input value={diagram.c} onChange={(e) => update("c", e.target.value)} placeholder="C" />
          <input value={diagram.ab} onChange={(e) => update("ab", e.target.value)} placeholder="AB" />
          <input value={diagram.ac} onChange={(e) => update("ac", e.target.value)} placeholder="AC" />
          <input value={diagram.bc} onChange={(e) => update("bc", e.target.value)} placeholder="BC" />
        </div>
      </div>
    </div>
  );
}
