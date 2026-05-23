import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  BoxSelect,
  Eraser,
  Highlighter,
  Italic,
  MousePointer2,
  PenLine,
  Plus,
  Sigma,
  SquareDashed,
  Triangle,
  Type,
  Underline,
} from "lucide-react";

function ToolTab({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`mws-tool-tab ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function ToolIcon({ icon: Icon, title, onClick }) {
  return (
    <button type="button" className="mws-tool-icon" title={title} onClick={onClick}>
      <Icon size={17} />
    </button>
  );
}

export default function Toolbar({
  activeTool,
  setActiveTool,
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
  onDraw,
  onCleanFormat,
}) {
  return (
    <section className="mws-toolbar-wrap">
      <div className="mws-toolbar-top">
        <div className="mws-tool-tabs">
          <ToolTab
            active={activeTool === "text"}
            icon={Type}
            label="Viết"
            onClick={() => setActiveTool("text")}
          />
          <ToolTab
            active={activeTool === "math"}
            icon={Sigma}
            label="Công thức"
            onClick={onMath}
          />
          <ToolTab
            active={activeTool === "select"}
            icon={MousePointer2}
            label="Chọn"
            onClick={() => setActiveTool("select")}
          />
          <ToolTab
            active={activeTool === "textbox"}
            icon={SquareDashed}
            label="Khung chữ"
            onClick={onTextBox}
          />
          <ToolTab
            active={activeTool === "geometry"}
            icon={Triangle}
            label="Hình học"
            onClick={() => {
              setActiveTool("geometry");
              onAddFigure();
            }}
          />
          <ToolTab
            active={activeTool === "draw"}
            icon={PenLine}
            label="Vẽ tay"
            onClick={() => {
              setActiveTool("draw");
              onDraw();
            }}
          />
        </div>

        <div className="mws-toolbar-hint">
          Ctrl + S lưu · Ctrl + P in · Ctrl + Enter đổi dòng thành công thức
        </div>
      </div>

      <div className="mws-toolbar-bottom">
        <div className="mws-tool-group">
          <ToolIcon icon={Bold} title="Đậm" onClick={onBold} />
          <ToolIcon icon={Italic} title="Nghiêng" onClick={onItalic} />
          <ToolIcon icon={Underline} title="Gạch chân" onClick={onUnderline} />
          <ToolIcon icon={Highlighter} title="Highlight" onClick={onHighlight} />
        </div>

        <div className="mws-tool-group">
          <ToolIcon icon={AlignLeft} title="Căn trái" onClick={onAlignLeft} />
          <ToolIcon icon={AlignCenter} title="Căn giữa" onClick={onAlignCenter} />
          <ToolIcon icon={AlignRight} title="Căn phải" onClick={onAlignRight} />
        </div>

        <div className="mws-tool-group">
          <button type="button" className="mws-tool-inline-btn" onClick={onAddFigure}>
            <Plus size={16} />
            <span>Hình</span>
          </button>

          <button type="button" className="mws-tool-inline-btn" onClick={onTextBox}>
            <BoxSelect size={16} />
            <span>Khung</span>
          </button>

          <button type="button" className="mws-tool-inline-btn" onClick={onCleanFormat}>
            <Eraser size={16} />
            <span>Dọn format</span>
          </button>
        </div>
      </div>
    </section>
  );
}
