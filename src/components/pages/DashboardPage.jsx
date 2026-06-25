import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  ArrowRight,
  BookOpen,
  FilePlus2,
  FolderOpen,
  LayoutTemplate,
  PenLine,
  Sigma,
  Triangle,
} from "lucide-react";
import { getDocumentStats, listRecentDocuments } from "../../services/documentService";

const quickStarts = [
  {
    action: "exam",
    title: "Soạn đề kiểm tra",
    desc: "Tạo đề kiểm tra với cấu trúc chuẩn, đa dạng dạng bài.",
    icon: PenLine,
    color: "blue",
  },
  {
    action: "worksheet",
    title: "Tạo phiếu bài tập",
    desc: "Tạo phiếu bài tập theo chủ đề hoặc theo dạng bài.",
    icon: BookOpen,
    color: "green",
  },
  {
    action: "formula",
    title: "Chèn công thức nhanh",
    desc: "Phân số, căn, mũ, hệ phương trình trong vài thao tác.",
    icon: Sigma,
    color: "violet",
  },
  {
    action: "geometry",
    title: "Vẽ hình học",
    desc: "Chèn tam giác, đường tròn, góc và nhãn điểm.",
    icon: Triangle,
    color: "orange",
  },
];

export default function DashboardPage({ onNavigate, onAction }) {
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Chào mừng trở lại!");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng!");
    else if (hour < 18) setGreeting("Chào buổi chiều!");
    else setGreeting("Chào buổi tối!");
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, recentData] = await Promise.all([
          getDocumentStats(),
          listRecentDocuments(4),
        ]);
        setStats(statsData);
        setRecentDocs(recentData);
      } catch (err) {
        console.error("Lỗi load dashboard:", err);
        setStats({ totalDocuments: 0, totalPages: 0, publishedDocuments: 0 });
        setRecentDocs([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Vừa xong";
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return d.toLocaleDateString("vi-VN");
  }

  return (
    <div className="mws-dashboard-page">
      <Paper radius="xl" p="xl" className="mws-hero-card">
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Badge variant="light" color="blue" mb="sm">
              Math Word Studio
            </Badge>

            <Text fw={950} className="mws-page-title">
              {greeting}
            </Text>

            <Text c="dimmed" size="md" mt="xs" maw={620}>
              Tạo đề Toán A4 đẹp, chèn công thức nhanh, quản lý tài liệu và xuất PDF chuyên nghiệp.
            </Text>

            {/* Thống kê */}
            {stats && (
              <Group mt="md" gap="lg">
                <Box>
                  <Text fw={950} size="xl" c="blue">
                    {stats.totalDocuments}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Tổng tài liệu
                  </Text>
                </Box>
                <Box>
                  <Text fw={950} size="xl" c="green">
                    {stats.totalPages}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Tổng trang
                  </Text>
                </Box>
                <Box>
                  <Text fw={950} size="xl" c="orange">
                    {stats.publishedDocuments}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Đã xuất PDF
                  </Text>
                </Box>
              </Group>
            )}

            <Group mt="xl">
              <Button
                size="md"
                radius="md"
                leftSection={<FilePlus2 size={18} />}
                onClick={() => onAction("new")}
              >
                Tạo tài liệu mới
              </Button>

              <Button
                size="md"
                radius="md"
                variant="default"
                leftSection={<LayoutTemplate size={18} />}
                onClick={() => onNavigate("templates")}
              >
                Dùng mẫu có sẵn
              </Button>

              <Button
                size="md"
                radius="md"
                variant="light"
                leftSection={<FolderOpen size={18} />}
                onClick={() => onNavigate("documents")}
              >
                Mở tài liệu
              </Button>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <div className="mws-hero-illustration">
              <div className="mws-mini-paper">
                <h3>ĐỀ KIỂM TRA TOÁN</h3>
                <p>Câu 1. Rút gọn biểu thức:</p>
                <strong>√50 = 5√2</strong>
                <div className="mws-mini-triangle">△ABC</div>
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </Paper>

      <Group justify="space-between" mt="xl" mb="md">
        <Box>
          <Text fw={900} size="xl">
            Tài liệu gần đây
          </Text>
          <Text size="sm" c="dimmed">
            Tiếp tục các đề đang soạn
          </Text>
        </Box>

        <Button
          variant="subtle"
          rightSection={<ArrowRight size={16} />}
          onClick={() => onNavigate("documents")}
        >
          Xem tất cả
        </Button>
      </Group>

      {loading ? (
        <Text c="dimmed" ta="center" py="xl">
          Đang tải tài liệu...
        </Text>
      ) : recentDocs.length === 0 ? (
        <Card withBorder radius="lg" shadow="sm" p="xl" ta="center">
          <Text c="dimmed">Chưa có tài liệu nào. Hãy tạo tài liệu mới để bắt đầu!</Text>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {recentDocs.map((doc, index) => (
            <Card
              key={doc.id}
              withBorder
              radius="lg"
              shadow="sm"
              className="mws-doc-card"
              onClick={() => onAction("open")}
            >
              <div className="mws-doc-thumb">
                <h4>{index % 2 ? "PHIẾU BÀI TẬP" : "ĐỀ KIỂM TRA"}</h4>
                <p>Câu 1. Cho biểu thức A = ...</p>
                <p>A. ... B. ... C. ... D. ...</p>
              </div>

              <Text fw={850} size="sm" mt="sm" lineClamp={2}>
                {doc.title}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {formatTime(doc.updated_at)}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Group justify="space-between" mt="xl" mb="md">
        <Box>
          <Text fw={900} size="xl">
            Bắt đầu nhanh
          </Text>
          <Text size="sm" c="dimmed">
            Các công cụ giáo viên hay dùng nhất
          </Text>
        </Box>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {quickStarts.map(({ action, title, desc, icon: Icon, color }) => (
          <Card
            key={title}
            withBorder
            radius="lg"
            shadow="sm"
            className="mws-feature-card"
            onClick={() => onAction(action)}
          >
            <ThemeIcon size={42} radius="md" color={color} variant="light">
              <Icon size={22} />
            </ThemeIcon>

            <Text fw={900} mt="md">
              {title}
            </Text>
            <Text size="sm" c="dimmed" mt={5}>
              {desc}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}