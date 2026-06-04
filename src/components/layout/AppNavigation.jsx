import { Stack, Tooltip } from "@mantine/core";
import {
  BarChart3,
  FolderOpen,
  Home,
  LayoutTemplate,
  PenLine,
  Sigma,
  Triangle,
  Upload,
} from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Trang chủ", icon: Home },
  { key: "templates", label: "Mẫu đề", icon: LayoutTemplate },
  { key: "documents", label: "Tài liệu", icon: FolderOpen },
  { key: "editor", label: "Soạn thảo", icon: PenLine },
  { key: "formula", label: "Công thức", icon: Sigma },
  { key: "geometry", label: "Hình học", icon: Triangle },
  { key: "graph", label: "Đồ thị", icon: BarChart3 },
  { key: "export", label: "Xuất bản", icon: Upload },
];

function isActiveNav(key, activePage, activeTool) {
  if (key === activePage) return true;
  if (key === "formula") return activePage === "editor" && activeTool === "math";
  if (key === "geometry") {
    return activePage === "editor" && ["geometry", "draw"].includes(activeTool);
  }
  return false;
}

export default function AppNavigation({ activePage, activeTool, onNavigate }) {
  return (
    <Stack className="mws-nav-rail" gap={7}>
      {navItems.map(({ key, label, icon: Icon }) => (
        <Tooltip label={label} position="right" key={key}>
          <button
            className={`mws-nav-button ${
              isActiveNav(key, activePage, activeTool) ? "active" : ""
            }`}
            type="button"
            onClick={() => onNavigate(key)}
          >
            <Icon size={21} />
            <span>{label}</span>
          </button>
        </Tooltip>
      ))}
    </Stack>
  );
}
