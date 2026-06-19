import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { Eye, LayoutTemplate, Search } from "lucide-react";

const filters = [
  "Tất cả",
  "Kiểm tra 15 phút",
  "Kiểm tra 1 tiết",
  "Giữa kỳ",
  "Học kỳ",
  "Ôn thi vào 10",
  "Trắc nghiệm",
  "Tự luận",
];

const templateCards = [
  ["Đề kiểm tra Toán 8 - Đại số", "Lớp 8 • 45 phút • Tự luận", "Tự luận"],
  ["Phiếu bài tập Hình học 7", "Lớp 7 • 1 tiết • Tự luận", "Tự luận"],
  ["Đề kiểm tra 15 phút - Toán 9", "Lớp 9 • 15 phút • Trắc nghiệm", "Kiểm tra 15 phút"],
  ["Đề giữa kỳ 1 - Toán 8", "Lớp 8 • 60 phút • Tự luận", "Giữa kỳ"],
  ["Ôn thi vào 10 - Đề 01", "Lớp 9 • 90 phút • Tự luận", "Ôn thi vào 10"],
  ["Đề học kỳ 1 - Toán 7", "Lớp 7 • 90 phút • Tự luận", "Học kỳ"],
  ["Trắc nghiệm Toán 6 - Chương 1", "Lớp 6 • 45 phút • Trắc nghiệm", "Trắc nghiệm"],
  ["Bài tập nâng cao Hình học 9", "Lớp 9 • Tự luận", "Tự luận"],
];

export default function TemplatesPage({ templates, onUseTemplate }) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const visibleCards = useMemo(() => {
    return templateCards.filter(([title, meta, type]) => {
      const matchFilter = activeFilter === "Tất cả" || type === activeFilter || meta.includes(activeFilter);
      const matchQuery = `${title} ${meta}`.toLowerCase().includes(query.toLowerCase().trim());
      return matchFilter && matchQuery;
    });
  }, [activeFilter, query]);

  return (
    <div className="mws-template-page">
      <Modal
        opened={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.title || "Xem trước mẫu đề"}
        size="xl"
        radius="lg"
      >
        <div className="mws-preview-modal-paper">
          <div dangerouslySetInnerHTML={{ __html: previewTemplate?.template?.html || "" }} />
        </div>
      </Modal>

      <Group justify="space-between" align="flex-end" mb="lg">
        <Box>
          <Text fw={950} className="mws-page-title">Mẫu đề</Text>
          <Text c="dimmed">Chọn mẫu có sẵn để tạo đề nhanh chóng và chuyên nghiệp.</Text>
        </Box>

        <TextInput
          w={300}
          radius="md"
          placeholder="Tìm kiếm mẫu đề..."
          leftSection={<Search size={16} />}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </Group>

      <Group gap="xs" mb="lg">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`mws-filter-chip ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="md">
        {visibleCards.map(([title, meta], index) => {
          const template = templates[index % templates.length];

          return (
            <Card key={title} withBorder radius="lg" shadow="sm" className="mws-template-card">
              <div className="mws-template-thumb">
                <h4>{index % 2 ? "PHIẾU BÀI TẬP" : "ĐỀ KIỂM TRA TOÁN"}</h4>
                <p>Câu 1. Rút gọn biểu thức sau:</p>
                <p>A. ... &nbsp; B. ... &nbsp; C. ... &nbsp; D. ...</p>
                <div className="mws-thumb-line" />
                <p>Bài 2. Cho tam giác ABC...</p>
              </div>

              <Text fw={900} mt="sm" lineClamp={2}>{title}</Text>
              <Text size="sm" c="dimmed" mt={4}>{meta}</Text>

              <Group grow mt="md" className="mws-template-actions">
                <Button
                  variant="default"
                  radius="md"
                  leftSection={<Eye size={15} />}
                  onClick={() => setPreviewTemplate({ title, template })}
                >
                  Xem trước
                </Button>

                <Button
                  radius="md"
                  leftSection={<LayoutTemplate size={15} />}
                  onClick={() => onUseTemplate(template)}
                >
                  Dùng mẫu
                </Button>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <Text ta="center" mt="xl" c="dimmed" size="sm">
        Đã hiển thị {visibleCards.length} mẫu đề
      </Text>
    </div>
  );
}
