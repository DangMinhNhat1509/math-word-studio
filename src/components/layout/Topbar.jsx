import { ActionIcon, Avatar, Box, Button, Group, Menu, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { Cloud, Code2, Copy, Download, FileText, MoreHorizontal, RefreshCcw, RotateCcw, Save, Sparkles } from "lucide-react";

const pageTitles = {
  dashboard: "Trang chủ",
  templates: "Mẫu đề",
  documents: "Tài liệu",
  editor: "Đề kiểm tra Toán 8 - Chương 1",
};

export default function Topbar({
  activePage,
  savedAt,
  status,
  onSave,
  onPrint,
  onCopyText,
  onCopyHtml,
  onReset,
}) {
  return (
    <header className="mws-topbar">
      <Group justify="space-between" h="100%" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" className="mws-brand">
          <ThemeIcon size={42} radius="md" variant="gradient" gradient={{ from: "blue", to: "indigo" }}>
            <Text fw={950} size="lg">M</Text>
          </ThemeIcon>
          <Box>
            <Text fw={900} size="lg" lh={1} c="blue.8">Math Word Studio</Text>
            <Text size="xs" c="dimmed" fw={650} mt={4}>{pageTitles[activePage] || "Soạn đề Toán A4"}</Text>
          </Box>
        </Group>

        <Group gap={8} wrap="nowrap" className="mws-topbar-center">
          <Tooltip label="Hoàn tác">
            <ActionIcon variant="default" size="lg" radius="md"><RotateCcw size={17} /></ActionIcon>
          </Tooltip>
          <Tooltip label="Làm lại">
            <ActionIcon variant="default" size="lg" radius="md"><RefreshCcw size={17} /></ActionIcon>
          </Tooltip>
          <Group gap={4} className="mws-zoom-control">
            <ActionIcon variant="subtle" size="sm">−</ActionIcon>
            <Text fw={850} size="sm">100%</Text>
            <ActionIcon variant="subtle" size="sm">+</ActionIcon>
          </Group>
        </Group>

        <Group gap="xs" wrap="nowrap" className="mws-topbar-actions">
          <Group gap={6} className="mws-save-pill">
            <Cloud size={15} />
            <Text size="xs" fw={800}>{activePage === "editor" && savedAt ? `Đã lưu ${savedAt}` : "Đã sẵn sàng"}</Text>
          </Group>

          <Button variant="default" radius="md" leftSection={<Save size={16} />} onClick={onSave}>
            Lưu
          </Button>

          <Button className="mws-hide-md" variant="light" radius="md" leftSection={<Copy size={16} />} onClick={onCopyText}>
            Copy chữ
          </Button>

          <Button radius="md" leftSection={<Download size={16} />} onClick={onPrint} className="mws-export-btn">
            Xuất PDF
          </Button>

          <Menu shadow="md" width={210} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" size="lg" radius="md"><MoreHorizontal size={18} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Tài liệu</Menu.Label>
              <Menu.Item leftSection={<Code2 size={15} />} onClick={onCopyHtml}>Copy HTML</Menu.Item>
              <Menu.Item leftSection={<Sparkles size={15} />} onClick={onReset} color="red">Tạo lại tài liệu</Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Group gap={8} wrap="nowrap" className="mws-user">
            <Avatar size={34} radius="xl" color="blue">N</Avatar>
            <Box className="mws-hide-md">
              <Text size="sm" fw={850} lh={1}>Nhat Minh</Text>
              <Text size="xs" c="dimmed" lh={1.2}>Giáo viên</Text>
            </Box>
          </Group>
        </Group>
      </Group>
    </header>
  );
}

