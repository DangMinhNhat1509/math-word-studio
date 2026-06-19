import { Badge, Button, Divider, Group, Modal, Paper, Select, Stack, Switch, Tabs, Text, TextInput } from "@mantine/core";
import {
  Bell,
  Cloud,
  Database,
  Download,
  KeyRound,
  Mail,
  Monitor,
  Palette,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "../auth/authContext";

export default function UserSettingsModal({ opened, onClose }) {
  const { displayName, email } = useAuth();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Cài đặt tài khoản"
      size="xl"
      radius="lg"
      centered
      classNames={{
        content: "mws-settings-modal",
        header: "mws-settings-header",
        title: "mws-settings-title",
      }}
    >
      <Tabs defaultValue="account" orientation="vertical" className="mws-settings-tabs">
        <Tabs.List>
          <Tabs.Tab value="account" leftSection={<User size={16} />}>
            Tài khoản
          </Tabs.Tab>
          <Tabs.Tab value="sync" leftSection={<Cloud size={16} />}>
            Đồng bộ
          </Tabs.Tab>
          <Tabs.Tab value="editor" leftSection={<Monitor size={16} />}>
            Soạn thảo
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<ShieldCheck size={16} />}>
            Bảo mật
          </Tabs.Tab>
          <Tabs.Tab value="export" leftSection={<Download size={16} />}>
            Xuất file
          </Tabs.Tab>
        </Tabs.List>

        <div className="mws-settings-content">
          <Tabs.Panel value="account">
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text fw={900} size="lg">Thông tin tài khoản</Text>
                  <Text size="sm" c="dimmed">Thông tin này lấy từ Supabase Auth.</Text>
                </div>
                <Badge color="green" variant="light">Đã đăng nhập</Badge>
              </Group>

              <Paper withBorder className="mws-settings-card">
                <Stack gap="sm">
                  <TextInput label="Tên hiển thị" value={displayName} readOnly />
                  <TextInput label="Email" value={email} readOnly leftSection={<Mail size={16} />} />
                  <Text size="xs" c="dimmed">
                    Phần đổi tên/avatar sẽ làm sau bằng bảng profiles. Hiện tại ưu tiên lưu tài liệu ổn định trước.
                  </Text>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="sync">
            <Stack gap="md">
              <div>
                <Text fw={900} size="lg">Đồng bộ dữ liệu</Text>
                <Text size="sm" c="dimmed">Web và app dùng chung database Supabase.</Text>
              </div>

              <Paper withBorder className="mws-settings-card">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Lưu tài liệu lên cloud</Text>
                      <Text size="sm" c="dimmed">Nút Lưu sẽ lưu vào documents và document_pages.</Text>
                    </div>
                    <Switch defaultChecked />
                  </Group>

                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Lưu mẫu đề vào DB</Text>
                      <Text size="sm" c="dimmed">Mẫu đề dùng bảng document_templates.</Text>
                    </div>
                    <Switch defaultChecked />
                  </Group>

                  <Divider />

                  <Group gap="sm">
                    <Button variant="light" radius="md" leftSection={<Database size={16} />}>
                      Kiểm tra DB
                    </Button>
                    <Button variant="default" radius="md" leftSection={<Save size={16} />}>
                      Lưu cấu hình
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="editor">
            <Stack gap="md">
              <div>
                <Text fw={900} size="lg">Cài đặt soạn thảo</Text>
                <Text size="sm" c="dimmed">Các tuỳ chọn mặc định cho trang A4 và công thức.</Text>
              </div>

              <Paper withBorder className="mws-settings-card">
                <Stack gap="sm">
                  <Group grow>
                    <Select label="Font mặc định" data={["Inter", "Times New Roman", "Cambria", "Arial"]} defaultValue="Inter" />
                    <Select label="Cỡ chữ" data={["11", "12", "13", "14", "16"]} defaultValue="12" />
                  </Group>

                  <Group grow>
                    <Select label="Khổ giấy" data={["A4", "A5", "Letter"]} defaultValue="A4" />
                    <Select label="Hướng giấy" data={["Dọc", "Ngang"]} defaultValue="Dọc" />
                  </Group>

                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Tự đổi 1/2, x^2 thành công thức</Text>
                      <Text size="sm" c="dimmed">Giúp soạn đề nhanh giống Word + MathType.</Text>
                    </div>
                    <Switch defaultChecked />
                  </Group>

                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Hiện thước/lề trang</Text>
                      <Text size="sm" c="dimmed">Dùng cho căn đề A4 chính xác.</Text>
                    </div>
                    <Switch />
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security">
            <Stack gap="md">
              <div>
                <Text fw={900} size="lg">Bảo mật</Text>
                <Text size="sm" c="dimmed">Dữ liệu được phân quyền bằng Supabase RLS.</Text>
              </div>

              <Paper withBorder className="mws-settings-card">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Email xác thực</Text>
                      <Text size="sm" c="dimmed">{email}</Text>
                    </div>
                    <Badge color="green" variant="light">Đã xác thực</Badge>
                  </Group>

                  <Divider />

                  <Button variant="light" radius="md" leftSection={<KeyRound size={16} />}>
                    Đổi mật khẩu
                  </Button>

                  <Text size="xs" c="dimmed">
                    Nút đổi mật khẩu sẽ gắn Supabase reset password ở bước sau.
                  </Text>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="export">
            <Stack gap="md">
              <div>
                <Text fw={900} size="lg">Xuất file</Text>
                <Text size="sm" c="dimmed">Cài đặt mặc định khi xuất PDF/in đề.</Text>
              </div>

              <Paper withBorder className="mws-settings-card">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Ẩn thanh công cụ khi in</Text>
                      <Text size="sm" c="dimmed">Chỉ in nội dung trang A4.</Text>
                    </div>
                    <Switch defaultChecked />
                  </Group>

                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Giữ đúng kích thước A4</Text>
                      <Text size="sm" c="dimmed">Phù hợp in đề kiểm tra.</Text>
                    </div>
                    <Switch defaultChecked />
                  </Group>

                  <Group justify="space-between">
                    <div>
                      <Text fw={800}>Thông báo khi xuất PDF xong</Text>
                      <Text size="sm" c="dimmed">Hiện trạng thái ở topbar.</Text>
                    </div>
                    <Switch defaultChecked />
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </div>
      </Tabs>
    </Modal>
  );
}
