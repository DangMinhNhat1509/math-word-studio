import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MousePointer2,
  Type,
  Sigma,
  Shapes,
  PenLine,
  ImagePlus,
  Grid3X3,
  Crosshair,
  Circle,
  Square,
  Triangle,
  Minus,
  Move,
  ZoomIn,
  Undo2,
  Redo2,
  Download,
  Save,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Trash2,
  Copy,
  Settings2,
  Plus,
  ChevronDown,
  Ruler,
  Wand2,
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  Eye
} from "lucide-react";

const tools = [
  { id: "select", label: "Chọn", icon: MousePointer2 },
  { id: "text", label: "Viết", icon: Type },
  { id: "math", label: "Công thức", icon: Sigma },
  { id: "shape", label: "Hình", icon: Shapes },
  { id: "draw", label: "Vẽ tay", icon: PenLine },
  { id: "image", label: "Ảnh", icon: ImagePlus }
];

const mathItems = [
  "√x",
  "a/b",
  "x²",
  "∠ABC",
  "△ABC",
  "π",
  "≤",
  "≥",
  "⇒",
  "∥",
  "⊥",
  "∈",
  "∑",
  "∞",
  "≈",
  "≠"
];

const shapeItems = [
  { id: "segment", label: "Đoạn thẳng", icon: Minus },
  { id: "triangle", label: "Tam giác", icon: Triangle },
  { id: "circle", label: "Hình tròn", icon: Circle },
  { id: "rectangle", label: "Hình chữ nhật", icon: Square }
];

function ToolButton({ active, icon: Icon, label, onClick }) {
  return (
    <button className={active ? "tool-button active" : "tool-button"} onClick={onClick}>
      <Icon size={17} />
      <span>{label}</span>
    </button>
  );
}

function IconButton({ active, children, onClick, title }) {
  return (
    <button title={title} onClick={onClick} className={active ? "icon-button active" : "icon-button"}>
      {children}
    </button>
  );
}

function PageThumbnail({ index, active }) {
  return (
    <button className={active ? "page-thumb active" : "page-thumb"}>
      <div className="page-thumb-head">
        <span>Trang {index}</span>
        <span>A4</span>
      </div>
      <div className="page-thumb-paper">
        <div className="line w70" />
        <div className="line" />
        <div className="line w85" />
        <div className="mini-box" />
      </div>
    </button>
  );
}

function InspectorRow({ label, value }) {
  return (
    <div className="inspector-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function MathChip({ children, onClick }) {
  return (
    <button className="math-chip" onClick={() => onClick(children)}>
      {children}
    </button>
  );
}

function ShapeButton({ icon: Icon, label, onClick }) {
  return (
    <button className="shape-button" onClick={onClick}>
      <Icon size={17} />
      <span>{label}</span>
    </button>
  );
}

function DocumentCanvas({
  showGrid,
  showAxis,
  selectedObject,
  setSelectedObject,
  diagramVisible,
  insertedMath,
  selectedTool
}) {
  return (
    <div className="workspace">
      <motion.div
        className="paper"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="paper-header">
          <div>
            <div className="paper-kicker">Math Word Studio</div>
            <h1>Bài tập hình học lớp 9</h1>
          </div>
          <div className="paper-status">
            <Eye size={16} />
            A4 · 100%
          </div>
        </div>

        <div className="content-block">
          <p contentEditable suppressContentEditableWarning>
            <b>Bài 1.</b> Cho tam giác <b>ABC</b> vuông tại <b>A</b>. Biết{" "}
            <span className="highlight">AB = 6cm</span>,{" "}
            <span className="highlight">AC = 8cm</span>. Tính độ dài <b>BC</b> và diện tích tam giác.
          </p>

          <div className="smart-box">
            <div className="smart-head">
              <div>
                <Wand2 size={17} />
                <b>Tự chuẩn hóa lời giải</b>
              </div>
              <span>Đẹp hóa tự động</span>
            </div>

            <p contentEditable suppressContentEditableWarning>
              Áp dụng định lý Pythagore:
            </p>

            <div className="formula-box" contentEditable suppressContentEditableWarning>
              BC = √(AB² + AC²) = √(6² + 8²) = √100 = 10cm
            </div>

            {insertedMath.length > 0 && (
              <div className="inserted-math">
                Ký hiệu đã thêm: <b>{insertedMath.join("  ")}</b>
              </div>
            )}
          </div>

          {diagramVisible && (
            <div
              className={
                selectedObject === "triangle"
                  ? "diagram selected"
                  : "diagram"
              }
              onClick={() => setSelectedObject("triangle")}
            >
              {showGrid && <div className="grid-layer" />}
              {showAxis && (
                <>
                  <div className="axis-x" />
                  <div className="axis-y" />
                  <span className="axis-label x">x</span>
                  <span className="axis-label y">y</span>
                </>
              )}

              <svg viewBox="0 0 680 360" className="diagram-svg">
                <path
                  d="M150 275 L150 90 L470 275 Z"
                  fill="rgba(248,250,252,.9)"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M150 250 L175 250 L175 275"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3"
                />
                <line
                  x1="150"
                  y1="275"
                  x2="470"
                  y2="275"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                />
                <circle cx="150" cy="275" r="7" fill="#0f172a" />
                <circle cx="150" cy="90" r="7" fill="#0f172a" />
                <circle cx="470" cy="275" r="7" fill="#0f172a" />
                <text x="126" y="302" fontSize="24" fontWeight="800" fill="#0f172a">A</text>
                <text x="124" y="80" fontSize="24" fontWeight="800" fill="#0f172a">B</text>
                <text x="485" y="302" fontSize="24" fontWeight="800" fill="#0f172a">C</text>
                <text x="92" y="186" fontSize="20" fontWeight="800" fill="#475569">6cm</text>
                <text x="294" y="306" fontSize="20" fontWeight="800" fill="#475569">8cm</text>
                <text x="315" y="166" fontSize="20" fontWeight="800" fill="#475569">BC = ?</text>
              </svg>

              {selectedObject === "triangle" && (
                <div className="selected-badge">
                  Đang chọn hình · kéo / sửa nhãn / xóa
                </div>
              )}
            </div>
          )}

          {!diagramVisible && (
            <div className="empty-diagram">
              Hình đã được xóa. Bấm “Tam giác” ở bảng bên phải để thêm lại.
            </div>
          )}

          <p contentEditable suppressContentEditableWarning>
            <b>Kết luận:</b> BC = 10cm. Diện tích tam giác ABC là{" "}
            <b>S = 1/2 · 6 · 8 = 24cm²</b>.
          </p>

          <div className="note-box">
            <CheckCircle2 size={18} />
            <span>
              Bản đầu tiên đã có: trang A4, vùng viết, công thức, hình học, bảng sửa đối tượng, lưới và trục tọa độ.
            </span>
          </div>
        </div>

        <div className="tool-hint">
          Công cụ đang chọn: <b>{selectedTool}</b>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedObject, setSelectedObject] = useState("triangle");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(false);
  const [diagramVisible, setDiagramVisible] = useState(true);
  const [insertedMath, setInsertedMath] = useState([]);

  const contextTitle = useMemo(() => {
    if (selectedTool === "text") return "Chỉnh chữ & căn lề";
    if (selectedTool === "math") return "Công thức toán";
    if (selectedTool === "shape") return "Hình học";
    if (selectedTool === "draw") return "Vẽ tay";
    if (selectedTool === "image") return "Chèn ảnh";
    return "Thuộc tính đối tượng";
  }, [selectedTool]);

  function addMathSymbol(symbol) {
    setInsertedMath((items) => [...items, symbol]);
  }

  function addShape(shapeId) {
    setDiagramVisible(true);
    setSelectedObject(shapeId === "triangle" ? "triangle" : shapeId);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">
            <Sigma size={26} />
          </div>
          <div>
            <div className="brand-line">
              <h1>Math Word Studio</h1>
              <span>Preview</span>
            </div>
            <p>Soạn bài · Công thức · Vẽ hình · Xuất file</p>
          </div>
        </div>

        <div className="top-actions">
          <button>
            <Undo2 size={16} />
            Hoàn tác
          </button>
          <button>
            <Redo2 size={16} />
            Làm lại
          </button>
          <button>
            <Save size={16} />
            Lưu
          </button>
          <button className="primary">
            <Download size={16} />
            Xuất file
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="leftbar">
          <div className="section-head">
            <h2>Trang tài liệu</h2>
            <button className="square-action">
              <Plus size={17} />
            </button>
          </div>

          <div className="page-list">
            <PageThumbnail index={1} active />
            <PageThumbnail index={2} />
          </div>

          <div className="assistant-card">
            <div className="assistant-title">
              <Sparkles size={17} />
              <b>Trợ lý nhanh</b>
            </div>
            <button>Chuẩn hóa lời giải</button>
            <button>Làm đẹp công thức</button>
            <button>Căn hình vào giữa</button>
          </div>
        </aside>

        <main className="main">
          <div className="toolbar">
            <div className="tool-row">
              {tools.map((tool) => (
                <ToolButton
                  key={tool.id}
                  active={selectedTool === tool.id}
                  icon={tool.icon}
                  label={tool.label}
                  onClick={() => setSelectedTool(tool.id)}
                />
              ))}
            </div>

            <div className="format-row">
              <div className="format-left">
                <IconButton title="In đậm">
                  <Bold size={16} />
                </IconButton>
                <IconButton title="In nghiêng">
                  <Italic size={16} />
                </IconButton>
                <IconButton title="Gạch chân">
                  <Underline size={16} />
                </IconButton>

                <span className="divider" />

                <IconButton title="Căn trái">
                  <AlignLeft size={16} />
                </IconButton>
                <IconButton active title="Căn giữa">
                  <AlignCenter size={16} />
                </IconButton>
                <IconButton title="Căn phải">
                  <AlignRight size={16} />
                </IconButton>

                <span className="divider" />

                <button
                  className={showGrid ? "toggle active" : "toggle"}
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid3X3 size={16} />
                  Lưới
                </button>

                <button
                  className={showAxis ? "toggle active" : "toggle"}
                  onClick={() => setShowAxis(!showAxis)}
                >
                  <Crosshair size={16} />
                  Trục
                </button>
              </div>

              <div className="zoom">
                <ZoomIn size={16} />
                100%
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <DocumentCanvas
            showGrid={showGrid}
            showAxis={showAxis}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
            diagramVisible={diagramVisible}
            insertedMath={insertedMath}
            selectedTool={selectedTool}
          />
        </main>

        <aside className="rightbar">
          <div className="right-head">
            <div>
              <h2>{contextTitle}</h2>
              <p>Chọn hình/chữ để sửa nhanh</p>
            </div>
            <Settings2 size={20} />
          </div>

          <div className="panel">
            <div className="panel-title">
              <Move size={17} />
              <b>Đối tượng đang chọn</b>
            </div>

            <div className="inspector-list">
              <InspectorRow label="Loại" value={selectedObject === "triangle" ? "Tam giác ABC" : selectedObject} />
              <InspectorRow label="Kích thước" value="320 × 185" />
              <InspectorRow label="Nét" value="4px" />
              <InspectorRow label="Nhãn" value="A, B, C" />
            </div>

            <div className="two-actions">
              <button>
                <Copy size={16} />
                Nhân đôi
              </button>
              <button className="danger" onClick={() => setDiagramVisible(false)}>
                <Trash2 size={16} />
                Xóa
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <Sigma size={17} />
              <b>Ký hiệu nhanh</b>
            </div>

            <div className="math-grid">
              {mathItems.map((item) => (
                <MathChip key={item} onClick={addMathSymbol}>
                  {item}
                </MathChip>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <Shapes size={17} />
              <b>Hình mẫu</b>
            </div>

            <div className="shape-grid">
              {shapeItems.map((item) => (
                <ShapeButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => addShape(item.id)}
                />
              ))}
            </div>
          </div>

          <div className="ux-card">
            <div>
              <Ruler size={17} />
              <b>Phản biện UX</b>
            </div>
            <p>
              Giao diện ưu tiên viết và vẽ trong một trang, chọn hình là hiện bảng sửa, có lưới/trục, ký hiệu toán nhanh và xuất file sau cùng.
            </p>
          </div>

          <div className="status-card">
            <SlidersHorizontal size={17} />
            <span>Giai đoạn hiện tại: dựng frontend web trước, chưa đóng gói desktop.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
