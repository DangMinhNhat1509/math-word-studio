const PROJECT_LIBRARY_KEY = "mws_project_library_v1";
const CURRENT_PROJECT_ID_KEY = "mws_current_project_id";
const CURRENT_PROJECT_TITLE_KEY = "mws_current_project_title";

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function makeId() {
  return `mws_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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

function getEditorHtmlFromPage() {
  const editor =
    document.querySelector(".editor") ||
    document.querySelector("[contenteditable='true']");

  return editor?.innerHTML || "";
}

function setEditorHtmlToPage(html) {
  const editor =
    document.querySelector(".editor") ||
    document.querySelector("[contenteditable='true']");

  if (editor) {
    editor.innerHTML = html || "";
  }
}

function collectMwsStorageSnapshot() {
  const snapshot = {};

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (!key) continue;
    if (!key.startsWith("mws_")) continue;
    if (key === PROJECT_LIBRARY_KEY) continue;

    snapshot[key] = localStorage.getItem(key);
  }

  return snapshot;
}

function restoreMwsStorageSnapshot(snapshot = {}) {
  Object.entries(snapshot).forEach(([key, value]) => {
    if (!key.startsWith("mws_")) return;
    if (key === PROJECT_LIBRARY_KEY) return;

    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  });
}

export function getCurrentProjectTitle() {
  return localStorage.getItem(CURRENT_PROJECT_TITLE_KEY) || "Bài chưa đặt tên";
}

export function getCurrentProjectId() {
  return localStorage.getItem(CURRENT_PROJECT_ID_KEY) || "";
}

export function loadProjectLibrary() {
  const projects = safeJsonParse(localStorage.getItem(PROJECT_LIBRARY_KEY), []);

  return Array.isArray(projects)
    ? projects.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    : [];
}

export function saveProjectLibrary(projects) {
  localStorage.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(projects));
}

export function saveCurrentProject({ title, forceNew = false } = {}) {
  const projects = loadProjectLibrary();
  const now = new Date().toISOString();
  const finalTitle = normalizeTitle(title || getCurrentProjectTitle());
  const editorHtml = getEditorHtmlFromPage();

  localStorage.setItem("mws_document_html", editorHtml);
  localStorage.setItem("mws_saved_at", new Date().toLocaleString("vi-VN"));

  const previousId = getCurrentProjectId();
  const shouldUpdate = previousId && !forceNew;
  const id = shouldUpdate ? previousId : makeId();

  const oldProject = projects.find((project) => project.id === id);

  const project = {
    id,
    version: 1,
    title: finalTitle,
    createdAt: oldProject?.createdAt || now,
    updatedAt: now,
    snapshot: {
      editorHtml,
      storage: collectMwsStorageSnapshot(),
    },
  };

  const nextProjects = [
    project,
    ...projects.filter((item) => item.id !== id),
  ];

  saveProjectLibrary(nextProjects);
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, id);
  localStorage.setItem(CURRENT_PROJECT_TITLE_KEY, finalTitle);

  return project;
}

export function openProject(projectId) {
  const projects = loadProjectLibrary();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error("Không tìm thấy bài đã lưu.");
  }

  restoreMwsStorageSnapshot(project.snapshot?.storage || {});
  localStorage.setItem("mws_document_html", project.snapshot?.editorHtml || "");
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, project.id);
  localStorage.setItem(CURRENT_PROJECT_TITLE_KEY, project.title);

  setEditorHtmlToPage(project.snapshot?.editorHtml || "");

  return project;
}

export function deleteProject(projectId) {
  const projects = loadProjectLibrary();
  const nextProjects = projects.filter((item) => item.id !== projectId);

  saveProjectLibrary(nextProjects);

  if (getCurrentProjectId() === projectId) {
    localStorage.removeItem(CURRENT_PROJECT_ID_KEY);
    localStorage.removeItem(CURRENT_PROJECT_TITLE_KEY);
  }

  return nextProjects;
}

export function exportProject(projectId) {
  const projects = loadProjectLibrary();
  const project =
    projects.find((item) => item.id === projectId) ||
    saveCurrentProject({ forceNew: false });

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

export function importProjectFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Chưa chọn file."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result || ""));

        if (!imported || !imported.snapshot) {
          throw new Error("File không đúng định dạng .mws.json.");
        }

        const now = new Date().toISOString();
        const project = {
          ...imported,
          id: makeId(),
          version: imported.version || 1,
          title: normalizeTitle(imported.title),
          createdAt: now,
          updatedAt: now,
        };

        const projects = loadProjectLibrary();
        saveProjectLibrary([project, ...projects]);

        resolve(project);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Không đọc được file."));
    reader.readAsText(file);
  });
}
