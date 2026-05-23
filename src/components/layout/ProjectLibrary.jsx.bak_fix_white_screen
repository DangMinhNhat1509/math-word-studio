import { useEffect, useRef, useState } from "react";
import {
  deleteProject,
  exportProject,
  getCurrentProjectId,
  getCurrentProjectTitle,
  importProjectFile,
  loadProjectLibrary,
  openProject,
  saveCurrentProject,
} from "../../utils/projectLibrary";

function formatDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return "";
  }
}

export default function ProjectLibrary() {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState(getCurrentProjectTitle());
  const [currentId, setCurrentId] = useState(getCurrentProjectId());
  const [projects, setProjects] = useState(() => loadProjectLibrary());
  const [message, setMessage] = useState("");

  function refresh() {
    setProjects(loadProjectLibrary());
    setCurrentId(getCurrentProjectId());
    setTitle(getCurrentProjectTitle());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleSave(forceNew = false) {
    const project = saveCurrentProject({ title, forceNew });

    setMessage(forceNew ? "Đã lưu thành bài mới" : "Đã lưu bài");
    setCurrentId(project.id);
    setTitle(project.title);
    setProjects(loadProjectLibrary());
  }

  function handleOpen(projectId) {
    const project = openProject(projectId);

    setMessage(`Đã mở: ${project.title}`);
    refresh();

    window.setTimeout(() => {
      window.location.reload();
    }, 80);
  }

  function handleDelete(projectId) {
    if (!window.confirm("Xóa bài đã lưu này?")) return;

    const nextProjects = deleteProject(projectId);

    setProjects(nextProjects);
    setMessage("Đã xóa bài");
    refresh();
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const project = await importProjectFile(file);
      setProjects(loadProjectLibrary());
      setMessage(`Đã nhập: ${project.title}`);
    } catch (error) {
      setMessage(error?.message || "Nhập file thất bại");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <section className="project-library-card">
      <div className="project-library-head">
        <div>
          <h3>Bài đã lưu</h3>
          <p>Lưu để mở lại sửa, tải file .mws.json để giữ lâu dài.</p>
        </div>
      </div>

      <label className="project-title-field">
        <span>Tên bài</span>
        <input
          value={title}
          placeholder="Ví dụ: Bài tam giác vuông"
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <div className="project-actions">
        <button type="button" onClick={() => handleSave(false)}>
          Lưu bài
        </button>
        <button type="button" onClick={() => handleSave(true)}>
          Lưu bản mới
        </button>
      </div>

      <div className="project-actions">
        <button
          type="button"
          onClick={() => {
            const project = saveCurrentProject({ title, forceNew: false });
            exportProject(project.id);
            refresh();
            setMessage("Đã tải file .mws.json");
          }}
        >
          Tải file
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Nhập file
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".mws.json,application/json"
        className="project-file-input"
        onChange={handleImport}
      />

      {message && <div className="project-message">{message}</div>}

      <div className="project-list">
        {projects.length === 0 ? (
          <p className="project-empty">Chưa có bài nào được lưu.</p>
        ) : (
          projects.map((project) => (
            <article
              key={project.id}
              className={
                project.id === currentId
                  ? "project-item project-item-active"
                  : "project-item"
              }
            >
              <button
                type="button"
                className="project-open"
                onClick={() => handleOpen(project.id)}
                title="Mở bài này"
              >
                <strong>{project.title}</strong>
                <span>{formatDate(project.updatedAt)}</span>
              </button>

              <div className="project-mini-actions">
                <button type="button" onClick={() => exportProject(project.id)}>
                  Tải
                </button>
                <button type="button" onClick={() => handleDelete(project.id)}>
                  Xóa
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
