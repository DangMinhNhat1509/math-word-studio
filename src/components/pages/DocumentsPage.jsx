import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
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
import {
  deleteDocument,
  duplicateDocument,
  listCloudDocuments,
  renameDocument,
} from "../../services/documentService";

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
}) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState("Tất cả");
  const [query, setQuery] = useState("");

  // Rename modal
  const [renameModal, setRenameModal] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Load documents
  async function loadDocs() {
    try {
      setLoading(true);
      const data = await listCloudDocuments();
      setDocs(data);
    } catch (err) {
      console.error("Lỗi load documents:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  // Filter & search
  const visibleDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchFolder =
        activeFolder === "Tất cả" ||
        activeFolder === "Gần đây" ||
        (activeFolder === "Đã xuất PDF" && doc.status === "published") ||
        doc.grade === activeFolder ||
        doc.subject?.includes(activeFolder);

      const matchQuery = `${doc.title} ${doc.subject || ""} ${doc.grade || ""}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());

      return matchFolder && matchQuery;
    });
  }, [docs, activeFolder, query]);

  // Actions
  function stopAndRun(event, callback) {
    event.stopPropagation();
    callback();
  }

  async function handleDelete(docId) {
    if (!confirm("Xóa tài liệu này?")) return;
    try {
      await deleteDocument(docId);
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert("Lỗi xóa: " + err.message);
    }
  }

  async function handleDuplicate(docId) {
    try {
      await duplicateDocument(docId);
      await loadDocs();
    } catch (err) {
      alert("Lỗi nhân bản: " + err.message);
    }
  }

  function openRename(doc) {
    setRenameModal(doc);
    setRenameValue(doc.title);
  }

  async function handleRename() {
    if (!renameModal || !renameValue.trim()) return;
    try {
      await renameDocument(renameModal.id, renameValue.trim());
      setDocs((prev) =>
        prev.map((d) =>
          d.id === renameModal.id ? { ...d, title: renameValue.trim() } : d,
        ),
      );
      setRenameModal(null);
    } catch (err) {
      alert("Lỗi đổi tên: " + err.message);
    }
  }

  function formatTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return d.toLocaleDateString("vi-VN");
  }

  return (
    <div className="mws-documents-page">
      {/* Rename Modal */}
      <Modal
        opened={Boolean(renameModal)}
        onClose={() => setRenameModal(null)}
        title="Đổi tên tài liệu"
        radius="lg"
      >
        <TextInput
          value={renameValue}
          onChange={(e) => setRenameValue(e.currentTarget.value)}
          label="Tên mới"
          placeholder="Nhập tên tài liệu..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
          }}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setRenameModal(null)}>
            Hủy
          </Button>
          <Button onClick={handleRename}>Lưu</Button>
        </Group>
      </Modal>

      <Group justify="space-between" align="flex-end" mb="lg">
        <Box>
          <Text fw={950} className="mws-page-title">
            Tài liệu
          </Text>
          <Text c="dimmed">
            Quản lý và truy cập nhanh các tài liệu, đề kiểm tra, phiếu bài tập
            đã lưu.
          </Text>
        </Box>

        <Button
          radius="md"
          leftSection={<FilePlus2 size={17} />}
          onClick={onCreateNew}
        >
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
                <Badge
                  variant="light"
                  color={activeFolder === folder ? "blue" : "gray"}
                >
                  {index === 0
                    ? docs.length
                    : docs.filter((d) => d.grade === folder).length || 0}
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
          </Group>

          {loading ? (
            <Text c="dimmed" ta="center" py="xl">
              Đang tải tài liệu...
            </Text>
          ) : visibleDocs.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              {query
                ? "Không tìm thấy tài liệu phù hợp."
                : "Chưa có tài liệu nào. Hãy tạo tài liệu mới!"}
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
              {visibleDocs.map((doc) => (
                <Card
                  key={doc.id}
                  withBorder
                  radius="lg"
                  shadow="sm"
                  className="mws-saved-doc-card"
                  onClick={() => onOpenEditor(doc.title)}
                >
                  <Group justify="space-between" align="flex-start">
                    <div className="mws-doc-thumb small">
                      <h4>{doc.subject || "ĐỀ TOÁN"}</h4>
                      <p>Câu 1. Cho biểu thức...</p>
                      <p>Bài 2. Giải phương trình...</p>
                    </div>

                    <Star size={18} className="mws-star" />
                  </Group>

                  <Text fw={900} mt="sm" lineClamp={2}>
                    {doc.title}
                  </Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    Chỉnh sửa • {formatTime(doc.updated_at)}
                  </Text>

                  <Group gap={6} mt="sm">
                    {doc.subject && (
                      <Badge variant="light" color="blue">
                        {doc.subject}
                      </Badge>
                    )}
                    {doc.grade && (
                      <Badge variant="light" color="gray">
                        Lớp {doc.grade}
                      </Badge>
                    )}
                    <Badge variant="light" color="green">
                      {doc.status === "published" ? "Đã xuất" : "Nháp"}
                    </Badge>
                  </Group>

                  <Group gap={6} mt="md" className="mws-doc-actions">
                    <Button
                      variant="subtle"
                      size="xs"
                      leftSection={<Copy size={13} />}
                      onClick={(event) =>
                        stopAndRun(event, () => handleDuplicate(doc.id))
                      }
                    >
                      Nhân bản
                    </Button>

                    <Button
                      variant="subtle"
                      size="xs"
                      leftSection={<Pencil size={13} />}
                      onClick={(event) =>
                        stopAndRun(event, () => openRename(doc))
                      }
                    >
                      Đổi tên
                    </Button>

                    <Button
                      variant="subtle"
                      size="xs"
                      color="red"
                      leftSection={<Download size={13} />}
                      onClick={(event) =>
                        stopAndRun(event, () => onExportDocument(doc.title))
                      }
                    >
                      PDF
                    </Button>

                    <Button
                      variant="subtle"
                      size="xs"
                      color="gray"
                      leftSection={<Trash2 size={13} />}
                      onClick={(event) =>
                        stopAndRun(event, () => handleDelete(doc.id))
                      }
                    >
                      Xóa
                    </Button>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </div>
    </div>
  );
}