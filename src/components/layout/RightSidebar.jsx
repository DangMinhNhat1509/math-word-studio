import {
  ActionIcon,
  Button,
  ColorInput,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { Braces, Info, Sigma, SlidersHorizontal, Triangle, X } from "lucide-react";

export default function RightSidebar({
  symbols,
  formulas,
  templates,
  activeFigure,
  onDeleteFigure,
  onDeselectFigure,
  onClearFigure,
  onInsertSymbol,
  onInsertFormula,
  onInsertTemplate,
}) {
  return (
    <aside className="mws-rightbar word-rightbar">
      <Tabs defaultValue="props" className="mws-inspector-tabs word-inspector-tabs">
        <Tabs.List grow>
          <Tabs.Tab value="props" leftSection={<SlidersHorizontal size={15} />}>
            Thuộc tính
          </Tabs.Tab>
          <Tabs.Tab value="symbols" leftSection={<Sigma size={15} />}>
            Ký hiệu
          </Tabs.Tab>
        </Tabs.List>

        <ScrollArea className="mws-inspector-scroll word-inspector-scroll" offsetScrollbars>
          <Tabs.Panel value="props" pt="md">
            <Stack gap="md">
              <Paper className="mws-inspector-card word-inspector-card" withBorder>
                <Group gap="sm" mb="sm">
                  <Info size={18} />
                  <div>
                    <Text fw={900}>Đối tượng</Text>
                    <Text size="xs" c="dimmed" fw={700}>
                      Chỉnh theo nội dung đang chọn
                    </Text>
                  </div>
                </Group>

                {activeFigure ? (
                  <Stack gap="xs">
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="xs">
                        <Triangle size={18} />
                        <Text fw={900}>{activeFigure.title || "Hình học"}</Text>
                      </Group>

                      <ActionIcon
                        color="red"
                        variant="light"
                        radius="md"
                        onClick={() => onDeleteFigure(activeFigure.id)}
                      >
                        <X size={16} />
                      </ActionIcon>
                    </Group>

                    <div className="word-object-row">
                      <span>Loại</span>
                      <strong>{activeFigure.type || "geometry"}</strong>
                    </div>

                    <div className="word-object-row">
                      <span>ID</span>
                      <strong>{activeFigure.id?.slice?.(0, 8) || "--"}</strong>
                    </div>

                    <Group grow>
                      <Button size="xs" variant="default" radius="md" onClick={onDeselectFigure}>
                        Bỏ chọn
                      </Button>
                      <Button size="xs" color="red" variant="light" radius="md" onClick={onClearFigure}>
                        Xóa nét
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <div className="mws-empty-object word-empty-object">
                    <Text fw={900}>Chưa chọn đối tượng</Text>
                    <Text size="sm" c="dimmed">
                      Chọn chữ, công thức hoặc hình để hiện chỉnh sửa nhanh.
                    </Text>
                  </div>
                )}
              </Paper>

              <Paper className="mws-inspector-card word-inspector-card" withBorder>
                <Text fw={900} mb={10}>
                  Văn bản
                </Text>

                <Stack gap="xs">
                  <Select
                    label="Phông chữ"
                    data={["Inter", "Times New Roman", "Cambria", "Arial"]}
                    defaultValue="Inter"
                    size="xs"
                    comboboxProps={{ withinPortal: true }}
                  />

                  <Group grow>
                    <NumberInput label="Cỡ chữ" defaultValue={12} min={8} max={48} size="xs" suffix=" pt" />
                    <ColorInput label="Màu chữ" defaultValue="#111827" size="xs" />
                  </Group>

                  <Group gap={6}>
                    <button type="button" className="word-mini-toggle">B</button>
                    <button type="button" className="word-mini-toggle italic">I</button>
                    <button type="button" className="word-mini-toggle underline">U</button>
                    <button type="button" className="word-mini-toggle">abc</button>
                  </Group>
                </Stack>
              </Paper>

              <Paper className="mws-inspector-card word-inspector-card" withBorder>
                <Text fw={900} mb={10}>
                  Trang
                </Text>

                <Stack gap="xs">
                  <Select
                    label="Kích thước"
                    data={["A4 (210 × 297 mm)", "A5", "Letter"]}
                    defaultValue="A4 (210 × 297 mm)"
                    size="xs"
                    comboboxProps={{ withinPortal: true }}
                  />

                  <Group grow>
                    <Button size="xs" variant="light" radius="md">
                      Dọc
                    </Button>
                    <Button size="xs" variant="default" radius="md">
                      Ngang
                    </Button>
                  </Group>

                  <SimpleGrid cols={2} spacing="xs">
                    <NumberInput label="Trên" defaultValue={20} size="xs" suffix=" mm" />
                    <NumberInput label="Dưới" defaultValue={20} size="xs" suffix=" mm" />
                    <NumberInput label="Trái" defaultValue={20} size="xs" suffix=" mm" />
                    <NumberInput label="Phải" defaultValue={20} size="xs" suffix=" mm" />
                  </SimpleGrid>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="symbols" pt="md">
            <Stack gap="md">
              <Paper className="mws-inspector-card word-inspector-card" withBorder>
                <Group gap="sm" mb="sm">
                  <Sigma size={18} />
                  <div>
                    <Text fw={900}>Ký hiệu nhanh</Text>
                    <Text size="xs" c="dimmed" fw={700}>
                      Chèn tại vị trí con trỏ
                    </Text>
                  </div>
                </Group>

                <SimpleGrid cols={4} spacing={8}>
                  {symbols.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      className="mws-symbol-btn word-symbol-btn"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onInsertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </SimpleGrid>
              </Paper>

              <Paper className="mws-inspector-card word-inspector-card" withBorder>
                <Group gap="sm" mb="sm">
                  <Braces size={18} />
                  <div>
                    <Text fw={900}>Công thức mẫu</Text>
                    <Text size="xs" c="dimmed" fw={700}>
                      Dạng thường dùng
                    </Text>
                  </div>
                </Group>

                <Stack gap={7}>
                  {formulas.map((formula) => (
                    <button
                      key={formula}
                      type="button"
                      className="word-formula-btn"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onInsertFormula(formula)}
                    >
                      {formula}
                    </button>
                  ))}
                </Stack>
              </Paper>

              <Paper className="mws-inspector-card word-inspector-card" withBorder>
                <Text fw={900} mb="sm">
                  Mẫu bài
                </Text>

                <Stack gap={7}>
                  {templates.map((template) => (
                    <Button
                      key={template.name}
                      size="xs"
                      variant="light"
                      radius="md"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onInsertTemplate(template)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
