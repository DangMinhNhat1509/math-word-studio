import { Sigma } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar slim-topbar">
      <div className="brand">
        <div className="logo">
          <Sigma size={22} />
        </div>

        <div>
          <div className="brand-title">
            <h1>Math Word Studio</h1>
            <span>MVP v4</span>
          </div>
          <p>Soạn bài · công thức · hình học · trắc nghiệm</p>
        </div>
      </div>

      <div className="shortcut-bar" aria-label="Phím tắt nhanh">
        <span><kbd>Ctrl</kbd> + <kbd>S</kbd> Lưu</span>
        <span><kbd>Ctrl</kbd> + <kbd>P</kbd> In/PDF</span>
        <span><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> Copy chữ</span>
      </div>
    </header>
  );
}
