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
  CalendarDays,
  CircleCheckBig,
  FilePlus2,
  FileText,
  FolderOpen,
  LayoutTemplate,
  PenLine,
  ScanSearch,
  Sigma,
  Triangle,
} from "lucide-react";

const recentDocs = [
  "Đề kiểm tra Toán 8 - Chương 1",
  "Phiếu bài tập Toán 9 - Học kỳ I",
  "Đề cương ôn tập Toán 7",
  "Đề kiểm tra Toán 6 - HKI",
];

const overviewStats = [
  {
    title: "Bài viết",
    value: "32",
    note: "Tổng số đã viết",
    icon: FileText,
    color: "blue",
  },
  {
    title: "Bản nháp",
    value: "18",
    note: "Đang sửa dở",
    icon: CalendarDays,
    color: "green",
  },
  {
    title: "Bản chốt",
    value: "14",
    note: "Sẵn sàng xuất",
    icon: CircleCheckBig,
    color: "orange",
  },
  {
    title: "Mẫu dùng",
    value: "5",
    note: "Đã lưu gần đây",
    icon: ScanSearch,
    color: "violet",
  },
];

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
  return (
    <div className="mws-dashboard-page">
      <Paper radius="xl" p="xl" className="mws-hero-card">
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Badge variant="light" color="blue" mb="sm">
              Math Word Studio
            </Badge>

            <Text fw={950} className="mws-page-title">
              Chào mừng trở lại!
            </Text>

            <Text c="dimmed" size="md" mt="xs" maw={620}>
              Tạo đề Toán A4 đẹp, chèn công thức nhanh, quản lý tài liệu và xuất PDF chuyên nghiệp.
            </Text>

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
                Mở tài liệu gần đây
              </Button>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <div className="mws-hero-illustration">
              <div className="mws-mini-paper">
                <h3>ĐỀ KIỂM TRA TOÁN 8</h3>
                <p>Câu 1. Rút gọn biểu thức:</p>
                <strong>√50 = 5√2</strong>
                <div className="mws-mini-triangle">△ABC</div>
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </Paper>

      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mt="md">
        {overviewStats.map(({ title, value, note, icon: Icon, color }) => (
          <Card key={title} withBorder radius="xl" className="mws-overview-card">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Text size="sm" c="dimmed" fw={700}>
                  {title}
                </Text>
                <Text fw={950} className="mws-overview-value">
                  {value}
                </Text>
                <Text size="xs" c="dimmed">
                  {note}
                </Text>
              </div>

              <ThemeIcon size={38} radius="md" color={color} variant="light">
                <Icon size={18} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

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

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {recentDocs.map((doc, index) => (
          <Card
            key={doc}
            withBorder
            radius="xl"
            shadow="sm"
            className="mws-doc-card mws-recent-card"
            onClick={() => onAction("open")}
          >
            <div className="mws-doc-thumb">
              <h4>{index % 2 ? "PHIẾU BÀI TẬP" : "ĐỀ KIỂM TRA"}</h4>
              <p>Câu 1. Cho biểu thức A = ...</p>
              <p>A. ... B. ... C. ... D. ...</p>
            </div>

            <Text fw={850} size="sm" mt="sm" lineClamp={2}>
              {doc}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Chỉnh sửa gần đây
            </Text>
          </Card>
        ))}
      </SimpleGrid>

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
            radius="xl"
            shadow="sm"
            className="mws-feature-card mws-quick-card"
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
