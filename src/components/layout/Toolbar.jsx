import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Crosshair,
  Grid3X3,
  Highlighter,
  Italic,
  MousePointer2,
  PenLine,
  Shapes,
  Sigma,
  Triangle,
  Type,
  Underline
} from "lucide-react";
import { IconButton, ToolButton } from "../common/Buttons";

export default function Toolbar({
  activeTool,
  setActiveTool,
  showGrid,
  setShowGrid,
  showAxis,
  setShowAxis,
  showDiagram,
  setShowDiagram,
  onBold,
  onItalic,
  onUnderline,
  onHighlight,
  onAlignLeft,
  onAlignCenter,
  onAlignRight
}) {
  return (
    <div className="toolbar">
      <div className="tool-row">
        <ToolButton active={activeTool === "select"} icon={MousePointer2} label="Chọn" onClick={() => setActiveTool("select")} />
        <ToolButton active={activeTool === "text"} icon={Type} label="Viết" onClick={() => setActiveTool("text")} />
        <ToolButton active={activeTool === "math"} icon={Sigma} label="Công thức" onClick={() => setActiveTool("math")} />
        <ToolButton active={activeTool === "shape"} icon={Shapes} label="Hình học" onClick={() => setActiveTool("shape")} />
        <ToolButton active={activeTool === "draw"} icon={PenLine} label="Vẽ tay" onClick={() => setActiveTool("draw")} />
      </div>

      <div className="format-row">
        <IconButton title="In đậm" onClick={onBold}>
          <Bold size={16} />
        </IconButton>
        <IconButton title="In nghiêng" onClick={onItalic}>
          <Italic size={16} />
        </IconButton>
        <IconButton title="Gạch chân" onClick={onUnderline}>
          <Underline size={16} />
        </IconButton>
        <IconButton title="Highlight" onClick={onHighlight}>
          <Highlighter size={16} />
        </IconButton>

        <span className="divider" />

        <IconButton title="Căn trái" onClick={onAlignLeft}>
          <AlignLeft size={16} />
        </IconButton>
        <IconButton title="Căn giữa" onClick={onAlignCenter}>
          <AlignCenter size={16} />
        </IconButton>
        <IconButton title="Căn phải" onClick={onAlignRight}>
          <AlignRight size={16} />
        </IconButton>

        <span className="divider" />

        <button className={showGrid ? "toggle active" : "toggle"} onClick={() => setShowGrid(!showGrid)}>
          <Grid3X3 size={16} /> Lưới
        </button>
        <button className={showAxis ? "toggle active" : "toggle"} onClick={() => setShowAxis(!showAxis)}>
          <Crosshair size={16} /> Trục
        </button>
        <button className={showDiagram ? "toggle active" : "toggle"} onClick={() => setShowDiagram(!showDiagram)}>
          <Triangle size={16} /> Hình
        </button>
      </div>
    </div>
  );
}
