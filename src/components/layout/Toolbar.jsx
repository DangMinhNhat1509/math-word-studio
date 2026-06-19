import { ActionIcon, Button, Divider, Group, Paper, Select, Text, Tooltip } from "@mantine/core";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Braces,
  Columns3,
  Eraser,
  FileDown,
  Highlighter,
  Image,
  Italic,
  Layout,
  List,
  Minus,
  PenLine,
  Plus,
  Radical,
  Sigma,
  SquareDashed,
  Subscript,
  Superscript,
  Table2,
  Triangle,
  Type,
  Underline,
} from "lucide-react";

function RibbonIcon({ icon: Icon, title, onClick, active = false }) {
  return (
    <Tooltip label={title} withArrow>
      <ActionIcon
        variant={active ? "light" : "subtle"}
        color={active ? "blue" : "gray"}
        radius="md"
        size="lg"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className="word-ribbon-icon"
      >
        <Icon size={18} />
      </ActionIcon>
    </Tooltip>
  );
}

function RibbonGroup({ title, children, wide = false }) {
  return (
    <div className={wide ? "word-ribbon-group wide" : "word-ribbon-group"}>
      <div className="word-ribbon-tools">{children}</div>
      <Text className="word-ribbon-label">{title}</Text>
    </div>
  );
}

function MathButton({ label, onClick }) {
  return (
    <button
      type="button"
      className="word-math-chip"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {label}
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
  function chooseTool(tool) {
    setActiveTool(tool);
  }

  return (
    <div className="mws-toolbar word-ribbon">
      <div className="word-ribbon-tabs">
        <button className="active" type="button">
          Trang đầu
        </button>
        <button type="button">Chèn</button>
        <button type="button">Bố cục</button>
        <button type="button">Xem</button>
        <button type="button">Trợ giúp</button>
      </div>

      <Paper className="word-ribbon-card" withBorder>
        <Group gap={0} wrap="nowrap" align="stretch">
          <RibbonGroup title="Văn bản" wide>
            <Group gap={6} wrap="nowrap">
              <Select
                data={["Inter", "Times New Roman", "Cambria", "Arial"]}
                defaultValue="Inter"
                size="xs"
                w={130}
                comboboxProps={{ withinPortal: true }}
              />
              <Select
                data={["10", "11", "12", "13", "14", "16", "18", "20"]}
                defaultValue="12"
                size="xs"
                w={74}
                comboboxProps={{ withinPortal: true }}
              />
            </Group>

            <Group gap={2} wrap="nowrap">
              <RibbonIcon icon={Bold} title="In đậm" onClick={onBold} />
              <RibbonIcon icon={Italic} title="In nghiêng" onClick={onItalic} />
              <RibbonIcon icon={Underline} title="Gạch chân" onClick={onUnderline} />
              <RibbonIcon icon={Subscript} title="Chỉ số dưới" />
              <RibbonIcon icon={Superscript} title="Chỉ số trên" />
              <RibbonIcon icon={Highlighter} title="Highlight" onClick={onHighlight} />
            </Group>

            <Group gap={2} wrap="nowrap">
              <RibbonIcon icon={AlignLeft} title="Căn trái" onClick={onAlignLeft} />
              <RibbonIcon icon={AlignCenter} title="Căn giữa" onClick={onAlignCenter} />
              <RibbonIcon icon={AlignRight} title="Căn phải" onClick={onAlignRight} />
              <RibbonIcon icon={AlignJustify} title="Căn đều" />
              <RibbonIcon icon={List} title="Danh sách" />
              <RibbonIcon icon={Eraser} title="Dọn định dạng" onClick={onCleanFormat} />
            </Group>
          </RibbonGroup>

          <Divider orientation="vertical" />

          <RibbonGroup title="Toán">
            <Group gap={6} wrap="nowrap">
              <MathButton
                label="x²"
                onClick={() => {
                  chooseTool("math");
                  onMath?.("x^2");
                }}
              />
              <MathButton
                label="√"
                onClick={() => {
                  chooseTool("math");
                  onMath?.("sqrt()");
                }}
              />
              <MathButton
                label="Σ"
                onClick={() => {
                  chooseTool("math");
                  onMath?.("sum");
                }}
              />
              <MathButton
                label="≤"
                onClick={() => {
                  chooseTool("math");
                  onMath?.("≤");
                }}
              />
              <MathButton
                label="≥"
                onClick={() => {
                  chooseTool("math");
                  onMath?.("≥");
                }}
              />
            </Group>

            <Group gap={2} wrap="nowrap">
              <RibbonIcon
                icon={Sigma}
                title="Công thức"
                active={activeTool === "math"}
                onClick={() => {
                  chooseTool("math");
                  onMath?.("");
                }}
              />
              <RibbonIcon icon={Radical} title="Căn thức" />
              <RibbonIcon icon={Braces} title="Ngoặc và hệ" />
            </Group>
          </RibbonGroup>

          <Divider orientation="vertical" />

          <RibbonGroup title="Chèn">
            <Group gap={2} wrap="nowrap">
              <RibbonIcon icon={Table2} title="Bảng" />
              <RibbonIcon icon={Image} title="Hình ảnh" />
              <RibbonIcon
                icon={SquareDashed}
                title="Khung chữ"
                active={activeTool === "textbox"}
                onClick={() => {
                  chooseTool("textbox");
                  onTextBox?.();
                }}
              />
              <RibbonIcon
                icon={Triangle}
                title="Hình học"
                active={activeTool === "geometry"}
                onClick={() => {
                  chooseTool("geometry");
                  onAddFigure?.();
                }}
              />
              <RibbonIcon
                icon={PenLine}
                title="Vẽ tay"
                active={activeTool === "draw"}
                onClick={() => {
                  chooseTool("draw");
                  onDraw?.();
                }}
              />
            </Group>
          </RibbonGroup>

          <Divider orientation="vertical" />

          <RibbonGroup title="Bố cục">
            <Group gap={2} wrap="nowrap">
              <RibbonIcon icon={Layout} title="Lề" />
              <RibbonIcon icon={Columns3} title="Cột" />
              <RibbonIcon icon={Minus} title="Ngắt trang" />
              <RibbonIcon icon={Plus} title="Thêm phần" />
            </Group>
          </RibbonGroup>

          <Divider orientation="vertical" />

          <RibbonGroup title="Xuất">
            <Button variant="subtle" color="gray" radius="md" leftSection={<FileDown size={17} />}>
              PDF
            </Button>
          </RibbonGroup>
        </Group>
      </Paper>
    </div>
  );
}
