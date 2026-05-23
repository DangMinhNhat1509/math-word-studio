import { useEffect, useRef, useState } from "react";
import "../../styles/project-library.css";

const LIBRARY_KEY = "mws_project_library_v1";
const CURRENT_ID_KEY = "mws_current_project_id";
const CURRENT_TITLE_KEY = "mws_current_project_title";
const PAGES_KEY = "mws_pages_refactor_v1";
const SAVED_AT_KEY = "mws_saved_at";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `mws-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeTitle(title) {
  const clean = String(title || "").trim();
  return clean || "Bài chưa đặt tên";
}

function slugify(value) {
  return normalizeTitle(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "bai-toan";
}

function loadProjects() {
  const projects = safeParse(localStorage.getItem(LIBRARY_KEY), []);

  if (!Array.isArray(projects)) return [];

  return projects.sort((a, b) =>
    String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
  );
}

function saveProjects(projects) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(projects));
}

function getCurrentProjectId() {
  return localStorage.getItem(CURRENT_ID_KEY) || "";
}

function getCurrentProjectTitle() {
  return localStorage.getItem(CURRENT_TITLE_KEY) || "Bài chưa đặt tên";
}

function downloadJson(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `${slugify(project.title)}.mws.json`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function formatDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return "";
  }
}

export default function ProjectLibraryDock({
  pages,
  currentPageId,
  snapshotCurrentPage,
  setPages,
  setSavedAt,
  setStatus,
}) {
  const fileInputRef = useRef(null);
  const [collapsed, setCollapsed] = useState(true);
  const [title, setTitle] = useState(getCurrentProjectTitle());
  const [projects, setProjects] = useState(() => loadProjects());
  const [currentProjectId, setCurrentProjectId] = useState(getCurrentProjectId());
  const [message, setMessage] = useState("");

  function refresh() {
    setProjects(loadProjects());
    setCurrentProjectId(getCurrentProjectId());
    setTitle(getCurrentProjectTitle());
  }

  useEffect(() => {
    refresh();
  }, []);

  function getFreshPages() {
    if (typeof snapshotCurrentPage === "function") {
      return snapshotCurrentPage();
    }

    return pages || [];
  }

  function saveProject({ forceNew = false } = {}) {
    const freshPages = getFreshPages();
    const oldProjects = loadProjects();
    const now = new Date().toISOString();
    const finalTitle = normalizeTitle(title);

    const oldId = getCurrentProjectId();
    const id = oldId && !forceNew ? oldId : makeId();
    const oldProject = oldProjects.find((project) => project.id === id);

    const project = {
      id,
      version: 1,
      title: finalTitle,
      createdAt: oldProject?.createdAt || now,
      updatedAt: now,
      currentPageId: currentPageId || freshPages[0]?.id || "",
      pages: freshPages,
    };

    const nextProjects = [
      project,
      ...oldProjects.filter((item) => item.id !== id),
    ];

    saveProjects(nextProjects);

    localStorage.setItem(CURRENT_ID_KEY, project.id);
    localStorage.setItem(CURRENT_TITLE_KEY, project.title);
    localStorage.setItem(PAGES_KEY, JSON.stringify(freshPages));

    const savedAt = new Date().toLocaleString("vi-VN");
    localStorage.setItem(SAVED_AT_KEY, savedAt);
    setSavedAt?.(savedAt);
    setStatus?.(forceNew ? "Đã lưu thành bài mới" : "Đã lưu bài");

    setProjects(nextProjects);
    setCurrentProjectId(project.id);
    setTitle(project.title);
    setMessage(forceNew ? "Đã lưu thành bài mới" : "Đã lưu bài");

    return project;
  }

  function openProject(project) {
    if (!project?.pages?.length) {
      setMessage("Bài này không có dữ liệu trang.");
      return;
    }

    const nextCurrentPageId = project.currentPageId || project.pages[0].id;

    localStorage.setItem(CURRENT_ID_KEY, project.id);
    localStorage.setItem(CURRENT_TITLE_KEY, project.title);
    localStorage.setItem(PAGES_KEY, JSON.stringify(project.pages));

    const savedAt = new Date().toLocaleString("vi-VN");
    localStorage.setItem(SAVED_AT_KEY, savedAt);

    setPages(project.pages, nextCurrentPageId);
    setSavedAt?.(savedAt);
    setStatus?.(`Đã mở: ${project.title}`);

    setCurrentProjectId(project.id);
    setTitle(project.title);
    setMessage(`Đã mở: ${project.title}`);
  }

  function deleteProject(projectId) {
    if (!confirm("Xóa bài đã lưu này?")) return;

    const nextProjects = loadProjects().filter((project) => project.id !== projectId);

    saveProjects(nextProjects);

    if (getCurrentProjectId() === projectId) {
      localStorage.removeItem(CURRENT_ID_KEY);
      localStorage.removeItem(CURRENT_TITLE_KEY);
      setCurrentProjectId("");
      setTitle("Bài chưa đặt tên");
    }

    setProjects(nextProjects);
    setMessage("Đã xóa bài");
    setStatus?.("Đã xóa bài đã lưu");
  }

  function exportProject(projectId) {
    const project =
      loadProjects().find((item) => item.id === projectId) ||
      saveProject({ forceNew: false });

    downloadJson(project);
    setMessage("Đã tải file .mws.json");
  }

  async function importFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);

      if (!imported || !Array.isArray(imported.pages)) {
        throw new Error("File không đúng định dạng .mws.json.");
      }

      const now = new Date().toISOString();
      const project = {
        ...imported,
        id: makeId(),
        version: imported.version || 1,
        title: normalizeTitle(imported.title || file.name.replace(/\.mws\.json$/i, "")),
        createdAt: now,
        updatedAt: now,
        currentPageId: imported.currentPageId || imported.pages[0]?.id || "",
      };

      const nextProjects = [project, ...loadProjects()];
      saveProjects(nextProjects);
      setProjects(nextProjects);
      setMessage(`Đã nhập: ${project.title}`);
      setStatus?.(`Đã nhập bài: ${project.title}`);
    } catch (error) {
      setMessage(error?.message || "Nhập file thất bại");
    } finally {
      event.target.value = "";
    }
  }

  if (collapsed) {
    return (
      <button
        type="button"
        className="project-library-toggle"
        onClick={() => setCollapsed(false)}
        title="Mở thư viện bài"
      >
        📁 Bài đã lưu
      </button>
    );
  }

  return (
    <section className="project-library-dock">
      <div className="project-library-header">
        <div>
          <h3>Bài đã lưu</h3>
          <p>Lưu để mở lại sửa, tải file .mws.json để giữ lâu dài.</p>
        </div>

        <button type="button" onClick={() => setCollapsed(true)}>
          Thu gọn
        </button>
      </div>

      <label className="project-title-field">
        <span>Tên bài</span>
        <input
          value={title}
          placeholder="Ví dụ: Bài tam giác vuông"
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <div className="project-action-grid">
        <button type="button" onClick={() => saveProject({ forceNew: false })}>
          Lưu bài
        </button>

        <button type="button" onClick={() => saveProject({ forceNew: true })}>
          Lưu bản mới
        </button>

        <button type="button" onClick={() => exportProject(currentProjectId)}>
          Tải file
        </button>

        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Nhập file
        </button>
      </div>

      <input
        ref={fileInputRef}
        className="project-file-input"
        type="file"
        accept=".mws.json,application/json"
        onChange={importFile}
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
                project.id === currentProjectId
                  ? "project-item project-item-active"
                  : "project-item"
              }
            >
              <button
                type="button"
                className="project-open-button"
                onClick={() => openProject(project)}
              >
                <strong>{project.title}</strong>
                <span>{formatDate(project.updatedAt)}</span>
              </button>

              <div className="project-item-actions">
                <button type="button" onClick={() => exportProject(project.id)}>
                  Tải
                </button>
                <button type="button" onClick={() => deleteProject(project.id)}>
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
