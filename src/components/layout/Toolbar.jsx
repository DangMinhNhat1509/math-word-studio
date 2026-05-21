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
  Underline,
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
  onAlignRight,
  onMath,
}) {
  return (
    <div className="toolbar">
      <div className="tool-row">
        <ToolButton
          active={activeTool === "select"}
          icon={MousePointer2}
          label="Chọn"
          onClick={() => setActiveTool("select")}
        />
        <ToolButton
          active={activeTool === "text"}
          icon={Type}
          label="Viết"
          onClick={() => setActiveTool("text")}
        />
        <ToolButton
          active={activeTool === "math"}
          icon={Sigma}
          label="Công thức"
          onClick={onMath}
        />
        <ToolButton
          active={activeTool === "shape"}
          icon={Shapes}
          label="Hình học"
          onClick={() => setActiveTool("shape")}
        />
        <ToolButton
          active={activeTool === "draw"}
          icon={PenLine}
          label="Vẽ tay"
          onClick={() => setActiveTool("draw")}
        />
      </div>

      <div className="format-row">
        <IconButton title="Đậm" onClick={onBold}>
          <Bold size={17} />
        </IconButton>
        <IconButton title="Nghiêng" onClick={onItalic}>
          <Italic size={17} />
        </IconButton>
        <IconButton title="Gạch chân" onClick={onUnderline}>
          <Underline size={17} />
        </IconButton>
        <IconButton title="Đánh dấu" onClick={onHighlight}>
          <Highlighter size={17} />
        </IconButton>

        <span className="toolbar-separator" />

        <IconButton title="Căn trái" onClick={onAlignLeft}>
          <AlignLeft size={17} />
        </IconButton>
        <IconButton title="Căn giữa" onClick={onAlignCenter}>
          <AlignCenter size={17} />
        </IconButton>
        <IconButton title="Căn phải" onClick={onAlignRight}>
          <AlignRight size={17} />
        </IconButton>

        <span className="toolbar-separator" />

        <IconButton active={showGrid} title="Bật/tắt lưới" onClick={() => setShowGrid(!showGrid)}>
          <Grid3X3 size={17} />
          Lưới
        </IconButton>
        <IconButton active={showAxis} title="Bật/tắt trục" onClick={() => setShowAxis(!showAxis)}>
          <Crosshair size={17} />
          Trục
        </IconButton>
        <IconButton active={showDiagram} title="Bật/tắt hình" onClick={() => setShowDiagram(!showDiagram)}>
          <Triangle size={17} />
          Hình
        </IconButton>
      </div>
    </div>
  );
}
