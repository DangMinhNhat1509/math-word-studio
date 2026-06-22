import { useEffect, useState } from "react";
import { Button, Group, Paper, PasswordInput, Stack, Text, TextInput, ThemeIcon } from "@mantine/core";
import { ArrowRight, BookOpenCheck, Cloud, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AuthContext, getUserDisplayName } from "./authContext";
import {
  getCurrentSession,
  listenAuthChanges,
  resendSignupEmail,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "../../services/authService";

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    getCurrentSession()
      .then((currentSession) => {
        if (mounted) setSession(currentSession);
      })
      .catch((error) => setMessage(error.message))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const unsubscribe = listenAuthChanges((nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      if (mode === "signup") {
        await signUpWithEmail({
          email,
          password,
          fullName: fullName || email.split("@")[0],
        });

        setPendingEmail(email);
        setMode("verify");
        setMessage("Đã gửi link xác thực. Mở Gmail và bấm xác nhận để quay lại app.");
        return;
      }

      await signInWithEmail({
        email,
        password,
      });

      setMessage("Đăng nhập thành công.");
    } catch (error) {
      const text = error.message || "Có lỗi khi đăng nhập.";

      if (text.toLowerCase().includes("email not confirmed")) {
        setPendingEmail(email);
        setMode("verify");
        setMessage("Email chưa xác thực. Mở Gmail bấm link xác nhận rồi đăng nhập lại.");
        return;
      }

      setMessage(text);
    }
  }

  async function handleResend() {
    try {
      const targetEmail = pendingEmail || email;

      if (!targetEmail) {
        setMessage("Nhập email trước khi gửi lại xác thực.");
        return;
      }

      await resendSignupEmail(targetEmail);
      setMessage("Đã gửi lại email xác thực. Kiểm tra Gmail, Spam hoặc Quảng cáo.");
    } catch (error) {
      setMessage(error.message || "Không gửi lại được email xác thực.");
    }
  }

  async function signOutUser() {
    await signOut();
    setSession(null);
    setMessage("Đã đăng xuất.");
  }

  if (loading) {
    return (
      <div className="mws-auth-page">
        <Paper className="mws-auth-loading" withBorder>
          <Text fw={900}>Đang kiểm tra đăng nhập...</Text>
        </Paper>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mws-auth-page">
        <div className="mws-auth-shell">
          <Paper className="mws-auth-hero-panel" withBorder shadow="lg">
            <div className="mws-auth-hero-kicker">
              <ThemeIcon size={46} radius="md" className="mws-auth-logo">
                M
              </ThemeIcon>
              <div>
                <Text fw={950} size="xl">
                  Math Word Studio
                </Text>
                <Text size="sm" c="dimmed" fw={700}>
                  Soạn đề · công thức · hình học · cloud
                </Text>
              </div>
            </div>

            <Text className="mws-auth-hero-title" fw={950}>
              Một chỗ để soạn đề, lưu cloud và chốt giao diện đẹp hơn.
            </Text>

            <Text className="mws-auth-hero-copy" c="dimmed">
              Giao diện này được thiết kế để giáo viên mở nhanh, nhìn gọn và dùng chung tài khoản ở nhiều thiết bị.
            </Text>

            <div className="mws-auth-feature-list">
              <div className="mws-auth-feature-item">
                <ThemeIcon size={32} radius="md" variant="light" color="blue">
                  <BookOpenCheck size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={850}>Mẫu đề dùng chung</Text>
                  <Text size="sm" c="dimmed">
                    Dùng lại layout chuẩn, ít phải dựng từ đầu.
                  </Text>
                </div>
              </div>

              <div className="mws-auth-feature-item">
                <ThemeIcon size={32} radius="md" variant="light" color="green">
                  <Cloud size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={850}>Cloud đồng bộ</Text>
                  <Text size="sm" c="dimmed">
                    Tài liệu, mẫu và cài đặt đi theo account.
                  </Text>
                </div>
              </div>

              <div className="mws-auth-feature-item">
                <ThemeIcon size={32} radius="md" variant="light" color="violet">
                  <ShieldCheck size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={850}>An toàn khi đăng nhập</Text>
                  <Text size="sm" c="dimmed">
                    Supabase auth giúp giữ dữ liệu tách theo user.
                  </Text>
                </div>
              </div>
            </div>

            <div className="mws-auth-hero-sheet">
              <div className="mws-auth-hero-sheet-head">
                <Sparkles size={16} />
                <Text fw={850}>Bản xem trước</Text>
              </div>
              <Text fw={950} size="sm" className="mws-auth-hero-sheet-title">
                Đề kiểm tra Toán 8
              </Text>
              <Text size="sm" c="dimmed">
                Câu 1. Rút gọn biểu thức sau:
              </Text>
              <div className="mws-auth-sheet-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="mws-auth-sheet-footer">
                <Text size="sm" fw={700}>
                  Xuất PDF
                </Text>
                <ArrowRight size={16} />
              </div>
            </div>
          </Paper>

          <Paper className="mws-auth-card" withBorder shadow="xl">
            <Stack gap="md">
              <Group gap="sm" className="mws-auth-form-head">
                <ThemeIcon size={44} radius="md" className="mws-auth-logo">
                  M
                </ThemeIcon>
                <div>
                  <Text fw={950} size="xl">
                    Math Word Studio
                  </Text>
                  <Text size="sm" c="dimmed" fw={700}>
                    Đăng nhập để lưu tài liệu lên cloud
                  </Text>
                </div>
              </Group>

              {mode === "verify" ? (
                <Stack gap="md">
                  <div className="mws-auth-hero">
                    <MailCheck size={30} />
                    <div>
                      <Text fw={900}>Kiểm tra Gmail để xác thực tài khoản</Text>
                      <Text size="sm" c="dimmed">
                        Supabase đã gửi link xác thực tới {pendingEmail || email}. Bấm link trong email, sau đó quay lại app.
                      </Text>
                    </div>
                  </div>

                  {message && (
                    <Text size="sm" c="blue" fw={700}>
                      {message}
                    </Text>
                  )}

                  <Button radius="md" onClick={handleResend}>
                    Gửi lại email xác thực
                  </Button>

                  <Button
                    variant="light"
                    radius="md"
                    onClick={() => {
                      setMode("signin");
                      setMessage("Sau khi xác thực email, hãy đăng nhập lại.");
                    }}
                  >
                    Tôi đã xác thực, quay lại đăng nhập
                  </Button>

                  <Button
                    variant="subtle"
                    radius="md"
                    onClick={() => {
                      setMode("signup");
                      setMessage("");
                    }}
                  >
                    Nhập lại email khác
                  </Button>
                </Stack>
              ) : (
                <>
                  <div className="mws-auth-hero">
                    <BookOpenCheck size={28} />
                    <div>
                      <Text fw={900}>{mode === "signup" ? "Tạo tài khoản mới" : "Web và app sẽ dùng chung tài khoản"}</Text>
                      <Text size="sm" c="dimmed">
                        Mỗi tài liệu được lưu theo user, nhiều thiết bị mở lại vẫn thấy dữ liệu.
                      </Text>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <Stack gap="sm">
                      {mode === "signup" && (
                        <TextInput
                          label="Tên hiển thị"
                          value={fullName}
                          onChange={(event) => setFullName(event.currentTarget.value)}
                          placeholder="Ví dụ: Minh Nhật, fpt..."
                        />
                      )}

                      <TextInput
                        label="Email"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        placeholder="email@example.com"
                        required
                      />

                      <PasswordInput
                        label="Mật khẩu"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        placeholder="Ít nhất 6 ký tự"
                        required
                      />

                      {message && (
                        <Text size="sm" c="blue" fw={700}>
                          {message}
                        </Text>
                      )}

                      <Button type="submit" size="md" radius="md">
                        {mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
                      </Button>

                      <Button
                        type="button"
                        variant="subtle"
                        radius="md"
                        onClick={() => {
                          setMessage("");
                          setMode(mode === "signin" ? "signup" : "signin");
                        }}
                      >
                        {mode === "signin" ? "Chưa có tài khoản? Tạo tài khoản" : "Đã có tài khoản? Đăng nhập"}
                      </Button>
                    </Stack>
                  </form>
                </>
              )}
            </Stack>
          </Paper>
        </div>
      </div>
    );
  }

  const user = session.user;
  const displayName = getUserDisplayName(user);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        displayName,
        email: user.email || "",
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
