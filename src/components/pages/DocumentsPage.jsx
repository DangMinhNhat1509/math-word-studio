import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  Copy,
  Download,
  FilePlus2,
  Pencil,
  Search,
  Star,
  Trash2,
} from "lucide-react";

const docs = [
  ["Đề kiểm tra Toán 8 - Chương 1", "Toán 8", "Kiểm tra", "Hôm nay, 09:36"],
  ["Phiếu bài tập số hữu tỉ", "Toán 7", "Bài tập", "Hôm qua, 15:42"],
  ["Ôn thi vào 10 - Hệ phương trình", "Ôn thi vào 10", "Đề ôn luyện", "2 ngày trước"],
  ["Kiểm tra 15 phút Hình học 7", "Toán 7", "Hình học", "3 ngày trước"],
  ["Bài tập rút gọn biểu thức", "Toán 8", "Bài tập", "5 ngày trước"],
  ["Kiểm tra giữa kỳ 1 Đại số 9", "Toán 9", "Kiểm tra", "1 tuần trước"],
];

const folders = [
  "Tất cả",
  "Đã gắn sao",
  "Gần đây",
  "Đã xuất PDF",
  "Toán 6",
  "Toán 7",
  "Toán 8",
  "Toán 9",
  "Ôn thi vào 10",
];

export default function DocumentsPage({
  onOpenEditor,
  onCreateNew,
  onExportDocument,
  onDocumentAction,
}) {
  const [activeFolder, setActiveFolder] = useState("Tất cả");
  const [query, setQuery] = useState("");

  const visibleDocs = useMemo(() => {
    return docs.filter(([title, tag1, tag2]) => {
      const matchFolder =
        activeFolder === "Tất cả" ||
        activeFolder === "Gần đây" ||
        activeFolder === "Đã gắn sao" ||
        activeFolder === "Đã xuất PDF" ||
        tag1 === activeFolder;

      const matchQuery = `${title} ${tag1} ${tag2}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());

      return matchFolder && matchQuery;
    });
  }, [activeFolder, query]);

  function stopAndRun(event, callback) {
    event.stopPropagation();
    callback();
  }

  return (
    <div className="mws-documents-page">
      <Group justify="space-between" align="flex-end" mb="lg">
        <Box>
          <Text fw={950} className="mws-page-title">Tài liệu</Text>
          <Text c="dimmed">
            Quản lý và truy cập nhanh các tài liệu, đề kiểm tra, phiếu bài tập đã lưu.
          </Text>
        </Box>

        <Button radius="md" leftSection={<FilePlus2 size={17} />} onClick={onCreateNew}>
          Tài liệu mới
        </Button>
      </Group>

      <div className="mws-docs-layout">
        <Card withBorder radius="lg" shadow="sm" className="mws-folder-panel">
          <Stack gap={6}>
            {folders.map((folder, index) => (
              <button
                key={folder}
                className={`mws-folder-item ${activeFolder === folder ? "active" : ""}`}
                type="button"
                onClick={() => setActiveFolder(folder)}
              >
                <span>{folder}</span>
                <Badge variant="light" color={activeFolder === folder ? "blue" : "gray"}>
                  {index === 0 ? 24 : Math.max(2, 12 - index)}
                </Badge>
              </button>
            ))}
          </Stack>
        </Card>

        <Box>
          <Group mb="md">
            <TextInput
              flex={1}
              radius="md"
              placeholder="Tìm kiếm tài liệu..."
              leftSection={<Search size={16} />}
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />

            <Button variant="default" radius="md" onClick={() => onDocumentAction("filter")}>
              Bộ lọc
            </Button>

            <Button variant="default" radius="md" onClick={() => onDocumentAction("sort")}>
              Sắp xếp: Mới nhất
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
            {visibleDocs.map(([title, tag1, tag2, time]) => (
              <Card
                key={title}
                withBorder
                radius="lg"
                shadow="sm"
                className="mws-saved-doc-card"
                onClick={() => onOpenEditor(title)}
              >
                <Group justify="space-between" align="flex-start">
                  <div className="mws-doc-thumb small">
                    <h4>ĐỀ TOÁN</h4>
                    <p>Câu 1. Cho biểu thức...</p>
                    <p>Bài 2. Giải phương trình...</p>
                  </div>

                  <Star size={18} className="mws-star" />
                </Group>

                <Text fw={900} mt="sm" lineClamp={2}>{title}</Text>
                <Text size="sm" c="dimmed" mt={4}>Chỉnh sửa • {time}</Text>

                <Group gap={6} mt="sm">
                  <Badge variant="light" color="blue">{tag1}</Badge>
                  <Badge variant="light" color="gray">{tag2}</Badge>
                </Group>

                <Group gap={6} mt="md" className="mws-doc-actions">
                  <Button
                    variant="subtle"
                    size="xs"
                    leftSection={<Copy size={13} />}
                    onClick={(event) => stopAndRun(event, () => onDocumentAction("duplicate", title))}
                  >
                    Nhân bản
                  </Button>

                  <Button
                    variant="subtle"
                    size="xs"
                    leftSection={<Pencil size={13} />}
                    onClick={(event) => stopAndRun(event, () => onDocumentAction("rename", title))}
                  >
                    Đổi tên
                  </Button>

                  <Button
                    variant="subtle"
                    size="xs"
                    color="red"
                    leftSection={<Download size={13} />}
                    onClick={(event) => stopAndRun(event, () => onExportDocument(title))}
                  >
                    PDF
                  </Button>

                  <Button
                    variant="subtle"
                    size="xs"
                    color="gray"
                    leftSection={<Trash2 size={13} />}
                    onClick={(event) => stopAndRun(event, () => onDocumentAction("delete", title))}
                  >
                    Xóa
                  </Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </div>
    </div>
  );
}
