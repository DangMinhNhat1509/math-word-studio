import { ActionIcon, Badge, Box, Button, Group, NumberInput, Paper, ScrollArea, Select, SimpleGrid, Stack, Switch, Tabs, Text, ThemeIcon } from "@mantine/core";
import { Braces, CheckCircle2, Grid3X3, Info, Layout, Palette, Sigma, Sparkles, Triangle, Type, X } from "lucide-react";

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
    <aside className="mws-rightbar">
      <Tabs defaultValue="properties" radius="md" className="mws-inspector-tabs">
        <Tabs.List grow>
          <Tabs.Tab value="properties">Thuộc tính</Tabs.Tab>
          <Tabs.Tab value="content">Nội dung</Tabs.Tab>
          <Tabs.Tab value="check">Kiểm tra</Tabs.Tab>
        </Tabs.List>

        <ScrollArea className="mws-inspector-scroll">
          <Tabs.Panel value="properties" pt="md">
            <Stack gap="sm">
              <Paper withBorder radius="lg" p="md" className="mws-inspector-card">
                <Group gap="sm" mb="sm">
                  <ThemeIcon variant="light" color="blue" radius="md"><Type size={17} /></ThemeIcon>
                  <Box>
                    <Text fw={900} size="sm">Văn bản</Text>
                    <Text size="xs" c="dimmed">Kiểu chữ, cỡ chữ, căn chỉnh</Text>
                  </Box>
                </Group>

                <Select label="Phông chữ" value="Inter" data={["Inter", "Arial", "Times New Roman", "Roboto"]} readOnly radius="md" size="xs" />
                <SimpleGrid cols={2} spacing="xs" mt="xs">
                  <NumberInput label="Cỡ chữ" value={12} readOnly radius="md" size="xs" />
                  <NumberInput label="Giãn dòng" value={1.5} readOnly radius="md" size="xs" />
                </SimpleGrid>

                <Group gap={6} mt="sm">
                  <ActionIcon variant="default" radius="md"><strong>B</strong></ActionIcon>
                  <ActionIcon variant="default" radius="md"><em>I</em></ActionIcon>
                  <ActionIcon variant="default" radius="md"><u>U</u></ActionIcon>
                  <ActionIcon variant="default" radius="md"><Palette size={15} /></ActionIcon>
                </Group>
              </Paper>

              <Paper withBorder radius="lg" p="md" className="mws-inspector-card">
                <Group gap="sm" mb="sm">
                  <ThemeIcon variant="light" color="indigo" radius="md"><Sigma size={17} /></ThemeIcon>
                  <Box>
                    <Text fw={900} size="sm">Ký hiệu nhanh</Text>
                    <Text size="xs" c="dimmed">Chèn tại vị trí con trỏ</Text>
                  </Box>
                </Group>

                <SimpleGrid cols={4} spacing={7}>
                  {symbols.map((symbol) => (
                    <Button
                      key={symbol}
                      variant="default"
                      radius="md"
                      size="xs"
                      className="mws-symbol-btn"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onInsertSymbol(symbol)}
                    >
                      {symbol}
                    </Button>
                  ))}
                </SimpleGrid>
              </Paper>

              <Paper withBorder radius="lg" p="md" className="mws-inspector-card">
                <Group gap="sm" mb="sm">
                  <ThemeIcon variant="light" color="violet" radius="md"><Braces size={17} /></ThemeIcon>
                  <Box>
                    <Text fw={900} size="sm">Mẫu công thức</Text>
                    <Text size="xs" c="dimmed">Phân số, căn, hệ phương trình</Text>
                  </Box>
                </Group>

                <Stack gap={7}>
                  {formulas.slice(0, 8).map((formula) => (
                    <Button
                      key={formula}
                      variant="light"
                      color="gray"
                      justify="flex-start"
                      radius="md"
                      size="xs"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onInsertFormula(formula)}
                    >
                      {formula}
                    </Button>
                  ))}
                </Stack>
              </Paper>

              <Paper withBorder radius="lg" p="md" className="mws-inspector-card">
                <Group gap="sm" mb="sm">
                  <ThemeIcon variant="light" color="cyan" radius="md"><Layout size={17} /></ThemeIcon>
                  <Box>
                    <Text fw={900} size="sm">Bố cục trang</Text>
                    <Text size="xs" c="dimmed">A4, lề, lưới căn</Text>
                  </Box>
                </Group>

                <Select label="Khổ giấy" value="A4" data={["A4", "A5", "Letter"]} readOnly radius="md" size="xs" />
                <SimpleGrid cols={2} spacing="xs" mt="xs">
                  <NumberInput label="Lề trên" value={20} readOnly radius="md" size="xs" />
                  <NumberInput label="Lề trái" value={20} readOnly radius="md" size="xs" />
                </SimpleGrid>
                <Switch label="Hiện lưới căn" mt="sm" size="sm" />
              </Paper>

              <Paper withBorder radius="lg" p="md" className="mws-inspector-card">
                <Group gap="sm" mb="sm">
                  <ThemeIcon variant="light" color="orange" radius="md"><Triangle size={17} /></ThemeIcon>
                  <Box>
                    <Text fw={900} size="sm">Hình đang chọn</Text>
                    <Text size="xs" c="dimmed">Chỉnh hình học trên trang</Text>
                  </Box>
                </Group>

                {activeFigure ? (
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Box>
                        <Text fw={850} size="sm">{activeFigure.title || "Hình học"}</Text>
                        <Text size="xs" c="dimmed">Loại: {activeFigure.type || "geometry"}</Text>
                      </Box>
                      <Badge variant="light">{activeFigure.id?.slice?.(0, 8) || "--"}</Badge>
                    </Group>
                    <Group grow>
                      <Button variant="default" size="xs" radius="md" leftSection={<X size={14} />} onClick={onDeselectFigure}>Bỏ chọn</Button>
                      <Button variant="light" size="xs" radius="md" leftSection={<Sparkles size={14} />} onClick={onClearFigure}>Xóa nét</Button>
                    </Group>
                    <Button color="red" variant="light" radius="md" size="xs" onClick={() => onDeleteFigure(activeFigure.id)}>Xóa hình</Button>
                  </Stack>
                ) : (
                  <Group gap="sm" wrap="nowrap" className="mws-empty-object">
                    <Info size={17} />
                    <Text size="xs" c="dimmed">Chọn chữ, công thức hoặc hình để chỉnh thuộc tính.</Text>
                  </Group>
                )}
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="content" pt="md">
            <Paper withBorder radius="lg" p="md">
              <Group gap="sm" mb="sm">
                <ThemeIcon variant="light" color="blue"><Grid3X3 size={17} /></ThemeIcon>
                <Text fw={900} size="sm">Mẫu bài nhanh</Text>
              </Group>
              <Stack gap={7}>
                {templates.map((template) => (
                  <Button
                    key={template.name}
                    variant="default"
                    justify="flex-start"
                    radius="md"
                    size="xs"
                    leftSection={<Grid3X3 size={14} />}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onInsertTemplate(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="check" pt="md">
            <Paper withBorder radius="lg" p="md">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="green" variant="light"><CheckCircle2 size={17} /></ThemeIcon>
                <Box>
                  <Text fw={900} size="sm">Tài liệu ổn</Text>
                  <Text size="xs" c="dimmed">Giao diện đang theo mockup đã chốt.</Text>
                </Box>
              </Group>
            </Paper>
          </Tabs.Panel>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
