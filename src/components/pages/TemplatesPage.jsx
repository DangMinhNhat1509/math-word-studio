import { useEffect, useMemo, useState } from "react";
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
import { Eye, LayoutTemplate, Lock, Search } from "lucide-react";
import { listTemplates, loadTemplateContent } from "../../services/documentService";

const filters = [
  "Tất cả",
  "Tự luận",
  "Trắc nghiệm",
  "Kiểm tra 15 phút",
  "Kiểm tra 1 tiết",
  "Giữa kỳ",
  "Học kỳ",
  "Ôn thi vào 10",
];

export default function TemplatesPage({ onUseTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [previewContent, setPreviewContent] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await listTemplates();
        setTemplates(data);
      } catch (err) {
        console.error("Lỗi load templates:", err);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visibleTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchFilter =
        activeFilter === "Tất cả" || tpl.category === activeFilter;
      const matchQuery = `${tpl.name} ${tpl.description || ""} ${tpl.subject || ""} ${tpl.grade || ""}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      return matchFilter && matchQuery;
    });
  }, [templates, activeFilter, query]);

  async function handlePreview(tpl) {
    setPreviewLoading(true);
    try {
      const content = await loadTemplateContent(tpl.id);
      setPreviewContent({
        name: content.name,
        html: content.html_content,
      });
    } catch (err) {
      console.error("Lỗi load template content:", err);
      setPreviewContent({
        name: tpl.name,
        html: "<p>Không thể tải nội dung mẫu.</p>",
      });
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleUseTemplate(tpl) {
    try {
      const content = await loadTemplateContent(tpl.id);
      onUseTemplate({
        name: content.name,
        html: content.html_content,
      });
    } catch (err) {
      console.error("Lỗi khi sử dụng template:", err);
    }
  }

  return (
    <div className="mws-template-page">
      <Modal
        opened={Boolean(previewContent)}
        onClose={() => setPreviewContent(null)}
        title={previewContent?.name || "Xem trước mẫu đề"}
        size="xl"
        radius="lg"
      >
        {previewLoading ? (
          <Text ta="center" py="xl">
            Đang tải...
          </Text>
        ) : (
          <div className="mws-preview-modal-paper">
            <div dangerouslySetInnerHTML={{ __html: previewContent?.html || "" }} />
          </div>
        )}
      </Modal>

      <Group justify="space-between" align="flex-end" mb="lg">
        <Box>
          <Text fw={950} className="mws-page-title">
            Mẫu đề
          </Text>
          <Text c="dimmed">
            Chọn mẫu có sẵn để tạo đề nhanh chóng và chuyên nghiệp.
          </Text>
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

      {loading ? (
        <Text ta="center" py="xl" c="dimmed">
          Đang tải mẫu đề...
        </Text>
      ) : visibleTemplates.length === 0 ? (
        <Text ta="center" py="xl" c="dimmed">
          {query
            ? "Không tìm thấy mẫu đề phù hợp."
            : "Chưa có mẫu đề nào."}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="md">
          {visibleTemplates.map((tpl) => (
            <Card
              key={tpl.id}
              withBorder
              radius="lg"
              shadow="sm"
              className="mws-template-card"
            >
              <div className="mws-template-thumb">
                <h4>{tpl.subject ? `${tpl.subject} ${tpl.grade || ""}` : "TOÁN"}</h4>
                <p>{tpl.description?.slice(0, 60) || "Nội dung mẫu đề..."}</p>
                <div className="mws-thumb-line" />
              </div>

              <Text fw={900} mt="sm" lineClamp={2}>
                {tpl.name}
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                {tpl.subject ? `Lớp ${tpl.grade || ""}` : ""} • {tpl.category || "Tự luận"}
              </Text>

              {tpl.is_premium && (
                <Badge variant="light" color="yellow" mt={4}>
                  <Lock size={11} /> Premium • {tpl.price?.toLocaleString()}đ
                </Badge>
              )}

              <Group grow mt="md" className="mws-template-actions">
                <Button
                  variant="default"
                  radius="md"
                  leftSection={<Eye size={15} />}
                  onClick={() => handlePreview(tpl)}
                >
                  Xem trước
                </Button>

                <Button
                  radius="md"
                  leftSection={<LayoutTemplate size={15} />}
                  onClick={() => handleUseTemplate(tpl)}
                >
                  Dùng mẫu
                </Button>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Text ta="center" mt="xl" c="dimmed" size="sm">
        Đã hiển thị {visibleTemplates.length} mẫu đề
      </Text>
    </div>
  );
}