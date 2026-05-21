import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  BoxSelect,
  BrushCleaning,
  Crosshair,
  Grid3X3,
  Highlighter,
  Italic,
  MousePointer2,
  PenLine,
  Plus,
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
  onBold,
  onItalic,
  onUnderline,
  onHighlight,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onMath,
  onTextBox,
  onAddFigure,
  onCleanFormat,
}) {
  return (
    <div className="toolbar">
      <div className="tool-row">
        <ToolButton active={activeTool === "text"} icon={Type} label="Viết" onClick={() => setActiveTool("text")} />
        <ToolButton active={activeTool === "math"} icon={Sigma} label="Công thức" onClick={onMath} />
        <ToolButton active={activeTool === "select"} icon={MousePointer2} label="Chọn" onClick={() => setActiveTool("select")} />
        <ToolButton active={activeTool === "textbox"} icon={BoxSelect} label="Khung chữ" onClick={onTextBox} />
        <ToolButton active={activeTool === "shape"} icon={Triangle} label="Thêm hình" onClick={onAddFigure} />
        <ToolButton active={activeTool === "draw"} icon={PenLine} label="Vẽ tay" onClick={() => setActiveTool("draw")} />
      </div>

      <div className="format-row">
        <IconButton title="Đậm" onClick={onBold}><Bold size={17} /></IconButton>
        <IconButton title="Nghiêng" onClick={onItalic}><Italic size={17} /></IconButton>
        <IconButton title="Gạch chân" onClick={onUnderline}><Underline size={17} /></IconButton>
        <IconButton title="Đánh dấu" onClick={onHighlight}><Highlighter size={17} /></IconButton>

        <span className="divider" />

        <IconButton title="Căn trái" onClick={onAlignLeft}><AlignLeft size={17} /></IconButton>
        <IconButton title="Căn giữa" onClick={onAlignCenter}><AlignCenter size={17} /></IconButton>
        <IconButton title="Căn phải" onClick={onAlignRight}><AlignRight size={17} /></IconButton>

        <span className="divider" />

        <IconButton active={showGrid} title="Bật/tắt lưới hình" onClick={() => setShowGrid(!showGrid)}>
          <Grid3X3 size={17} /> Lưới
        </IconButton>
        <IconButton active={showAxis} title="Bật/tắt trục tọa độ" onClick={() => setShowAxis(!showAxis)}>
          <Crosshair size={17} /> Trục
        </IconButton>
        <IconButton title="Thêm khung hình mới" onClick={onAddFigure}>
          <Plus size={17} /> Hình
        </IconButton>
        <IconButton title="Dọn format nội dung đang soạn" onClick={onCleanFormat}>
          <BrushCleaning size={17} /> Dọn format
        </IconButton>
      </div>
    </div>
  );
}
