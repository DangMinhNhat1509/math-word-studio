import {
  BookOpen,
  CheckCircle2,
  Copy,
  FileText,
  Printer,
  RotateCcw,
  Save,
  Sparkles
} from "lucide-react";
import { SideButton } from "../common/Buttons";

export default function LeftSidebar({
  status,
  savedAt,
  onSave,
  onCopyText,
  onCopyHtml,
  onPrint,
  onReset
}) {
  return (
    <aside className="leftbar">
      <div className="panel-title">
        <FileText size={18} />
        <b>Tài liệu</b>
      </div>

      <SideButton active icon={BookOpen} label="Trang A4 hiện tại" />
      <SideButton icon={Save} label="Lưu vào trình duyệt" onClick={onSave} />
      <SideButton icon={Copy} label="Copy chữ dán Word" onClick={onCopyText} />
      <SideButton icon={Copy} label="Copy HTML" onClick={onCopyHtml} />
      <SideButton icon={Printer} label="Xuất PDF bằng Print" onClick={onPrint} />
      <SideButton danger icon={RotateCcw} label="Reset mẫu" onClick={onReset} />

      <div className="info-card">
        <CheckCircle2 size={18} />
        <div>
          <b>Trạng thái</b>
          <p>{status}</p>
          {savedAt && <small>Lưu lần cuối: {savedAt}</small>}
        </div>
      </div>

      <div className="info-card soft">
        <Sparkles size={18} />
        <div>
          <b>Cách dùng</b>
          <p>Click vào trang giấy để sửa chữ. Đặt con trỏ ở đâu thì bấm ký hiệu/công thức, nó sẽ chèn vào đó.</p>
        </div>
      </div>
    </aside>
  );
}
