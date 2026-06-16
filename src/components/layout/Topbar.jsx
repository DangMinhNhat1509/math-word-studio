import { ActionIcon, Avatar, Button, Group, Menu, Text, ThemeIcon, Tooltip } from "@mantine/core";
import {
  ChevronDown,
  Cloud,
  Copy,
  Download,
  FileText,
  MoreHorizontal,
  RefreshCcw,
  RotateCcw,
  Save,
} from "lucide-react";

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
  const title = pageTitles[activePage] || "Soạn đề Toán A4";
  const savedText = activePage === "editor" && savedAt ? `Đã lưu ${savedAt}` : status || "Đã sẵn sàng";

  return (
    <header className="mws-topbar word-topbar">
      <Group h="100%" justify="space-between" wrap="nowrap" gap="md">
        <Group gap="md" wrap="nowrap" className="word-topbar-left">
          <Group gap="sm" wrap="nowrap" className="word-brand">
            <ThemeIcon size={38} radius="md" className="word-brand-logo">
              M
            </ThemeIcon>

            <div>
              <Text fw={900} size="md" lh={1.05}>
                Math Word Studio
              </Text>
              <Text size="xs" c="dimmed" fw={700}>
                Soạn đề · công thức · hình học
              </Text>
            </div>
          </Group>

          <div className="word-title-divider" />

          <button className="word-doc-title" type="button">
            <FileText size={16} />
            <span>{title}</span>
            <ChevronDown size={14} />
          </button>
        </Group>

        <Group gap="xs" wrap="nowrap" className="word-topbar-center">
          <Tooltip label="Hoàn tác">
            <ActionIcon variant="subtle" color="gray" radius="md" size="lg">
              <RotateCcw size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Làm lại">
            <ActionIcon variant="subtle" color="gray" radius="md" size="lg">
              <RefreshCcw size={18} />
            </ActionIcon>
          </Tooltip>

          <div className="word-zoom-pill">
            <button type="button">−</button>
            <strong>100%</strong>
            <button type="button">+</button>
          </div>
        </Group>

        <Group gap="xs" wrap="nowrap" className="word-topbar-actions">
          <div className="word-save-pill">
            <Cloud size={15} />
            <span>{savedText}</span>
          </div>

          <Button variant="default" radius="md" leftSection={<Save size={16} />} onClick={onSave}>
            Lưu
          </Button>

          <Button
            variant="light"
            color="blue"
            radius="md"
            leftSection={<Copy size={16} />}
            onClick={onCopyText}
            className="word-copy-btn"
          >
            Copy chữ
          </Button>

          <Button
            radius="md"
            leftSection={<Download size={16} />}
            onClick={onPrint}
            className="mws-export-btn word-export-btn"
          >
            Xuất PDF
          </Button>

          <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" radius="md" size="lg">
                <MoreHorizontal size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Tài liệu</Menu.Label>
              <Menu.Item leftSection={<Copy size={15} />} onClick={onCopyHtml}>
                Copy HTML
              </Menu.Item>
              <Menu.Item color="red" leftSection={<RefreshCcw size={15} />} onClick={onReset}>
                Tạo lại tài liệu
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Group gap={8} wrap="nowrap" className="word-user">
            <Avatar radius="xl" color="blue" size={36}>
              N
            </Avatar>
            <div>
              <Text size="sm" fw={900} lh={1.05}>
                Nhat Minh
              </Text>
              <Text size="xs" c="dimmed" fw={700}>
                Giáo viên
              </Text>
            </div>
          </Group>
        </Group>
      </Group>
    </header>
  );
}
