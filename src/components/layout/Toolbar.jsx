import { ActionIcon, Button, Divider, Group, Kbd, Paper, ScrollArea, Text, Tooltip } from "@mantine/core";
import { AlignCenter, AlignLeft, AlignRight, Bold, Braces, Eraser, Highlighter, Image, Italic, PenLine, Plus, Radical, Sigma, SquareDashed, Superscript, Table2, Triangle, Type, Underline } from "lucide-react";

function MainTool({ active, icon: Icon, label, onClick }) {
  return (
    <Button
      variant={active ? "light" : "subtle"}
      color={active ? "blue" : "gray"}
      radius="md"
      size="sm"
      className="mws-main-tool"
      leftSection={<Icon size={18} />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function FormatTool({ icon: Icon, title, onClick }) {
  return (
    <Tooltip label={title}>
      <ActionIcon variant="subtle" color="gray" radius="md" onClick={onClick}>
        <Icon size={17} />
      </ActionIcon>
    </Tooltip>
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
    <section className="mws-toolbar">
      <Paper withBorder radius="xl" shadow="sm" className="mws-toolbar-card">
        <ScrollArea type="never">
          <Group gap={6} wrap="nowrap">
            <MainTool active={activeTool === "text"} icon={Type} label="Chữ" onClick={() => setActiveTool("text")} />
            <MainTool active={activeTool === "math"} icon={Sigma} label="Công thức" onClick={onMath} />
            <MainTool icon={Braces} label="Phân số" onClick={onMath} />
            <MainTool icon={Radical} label="Căn" onClick={onMath} />
            <MainTool icon={Superscript} label="Mũ" onClick={onMath} />

            <MainTool active={activeTool === "geometry"} icon={Triangle} label="Hình học" onClick={() => { setActiveTool("geometry"); onAddFigure(); }} />
            <MainTool active={activeTool === "draw"} icon={PenLine} label="Vẽ tay" onClick={() => { setActiveTool("draw"); onDraw(); }} />

            <Divider orientation="vertical" />

            <MainTool icon={Plus} label="Chèn" onClick={onTextBox} />
            <MainTool icon={Table2} label="Bảng" onClick={onTextBox} />
            <MainTool icon={Image} label="Ảnh" onClick={onTextBox} />

            <Divider orientation="vertical" />

            <FormatTool icon={Bold} title="In đậm" onClick={onBold} />
            <FormatTool icon={Italic} title="In nghiêng" onClick={onItalic} />
            <FormatTool icon={Underline} title="Gạch chân" onClick={onUnderline} />
            <FormatTool icon={Highlighter} title="Tô nổi bật" onClick={onHighlight} />
            <FormatTool icon={AlignLeft} title="Căn trái" onClick={onAlignLeft} />
            <FormatTool icon={AlignCenter} title="Căn giữa" onClick={onAlignCenter} />
            <FormatTool icon={AlignRight} title="Căn phải" onClick={onAlignRight} />
            <FormatTool icon={SquareDashed} title="Khung chữ" onClick={onTextBox} />
            <FormatTool icon={Eraser} title="Dọn format" onClick={onCleanFormat} />

            <Text size="xs" c="dimmed" fw={700} className="mws-shortcuts">
              <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> lưu · <Kbd>Ctrl</Kbd> + <Kbd>P</Kbd> PDF
            </Text>
          </Group>
        </ScrollArea>
      </Paper>
    </section>
  );
}
