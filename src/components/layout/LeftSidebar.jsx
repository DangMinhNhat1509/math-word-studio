import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { ChevronLeft, FilePlus2, FileText, Plus, Trash2 } from "lucide-react";
import AppNavigation from "./AppNavigation";

function stripText(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

export default function LeftSidebar({
  activePage,
  activeTool,
  onNavigate,
  pages,
  currentPageId,
  status,
  savedAt,
  onSelectPage,
  onAddPage,
  onDeletePage,
}) {
  return (
    <aside className="mws-leftbar">
      <AppNavigation
        activePage={activePage}
        activeTool={activeTool}
        onNavigate={onNavigate}
      />

      <ScrollArea className="mws-page-panel">
        <Group justify="space-between" align="flex-start" mb="md">
          <Box>
            <Text fw={900} size="lg">Trang</Text>
            <Text size="xs" c="dimmed" fw={650}>
              {pages.length} trang trong tài liệu
            </Text>
          </Box>

          <Tooltip label="Thêm trang">
            <ActionIcon variant="light" color="blue" radius="md" onClick={onAddPage}>
              <Plus size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Stack gap="md">
          {pages.map((page, index) => {
            const preview = stripText(page.html);
            const selected = page.id === currentPageId;

            return (
              <button
                type="button"
                key={page.id}
                className={`mws-page-card ${selected ? "active" : ""}`}
                onClick={() => onSelectPage(page.id)}
              >
                <Paper className="mws-page-preview" withBorder radius="md">
                  <div
                    className="mws-page-preview-content"
                    dangerouslySetInnerHTML={{ __html: page.html }}
                  />
                </Paper>

                <Group justify="space-between" mt={8} gap={6} wrap="nowrap">
                  <Group gap={8} wrap="nowrap">
                    <Badge
                      color={selected ? "blue" : "gray"}
                      variant={selected ? "filled" : "light"}
                    >
                      {index + 1}
                    </Badge>

                    <Box maw={130}>
                      <Text size="sm" fw={850} truncate>
                        Trang {index + 1}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {preview || "Trang trống"}
                      </Text>
                    </Box>
                  </Group>
                </Group>
              </button>
            );
          })}
        </Stack>

        <Group grow mt="md">
          <Button
            size="xs"
            radius="md"
            variant="light"
            leftSection={<FilePlus2 size={15} />}
            onClick={onAddPage}
          >
            Thêm
          </Button>

          <Button
            size="xs"
            radius="md"
            variant="light"
            color="red"
            leftSection={<Trash2 size={15} />}
            onClick={onDeletePage}
          >
            Xóa
          </Button>
        </Group>

        <Divider my="md" />

        <Paper withBorder radius="lg" p="sm" className="mws-status-card">
          <Group gap="sm" align="flex-start" wrap="nowrap">
            <ThemeIcon variant="light" color="blue" radius="md">
              <FileText size={17} />
            </ThemeIcon>

            <Box>
              <Text size="sm" fw={850}>
                {status || "Đang soạn thảo"}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {savedAt ? `Lưu lần cuối: ${savedAt}` : "Chưa có mốc lưu"}
              </Text>
            </Box>
          </Group>
        </Paper>

        <ActionIcon className="mws-collapse" variant="default" radius="xl" size="lg">
          <ChevronLeft size={18} />
        </ActionIcon>
      </ScrollArea>
    </aside>
  );
}
