import { supabase } from "../lib/supabaseClient";

export const CURRENT_DOCUMENT_ID_KEY = "mws_current_cloud_document_id";

function htmlToPlainText(html = "") {
  if (typeof document === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

async function getCurrentUserOrThrow() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Bạn cần đăng nhập");
  return data.user;
}

export function getCurrentCloudDocumentId() {
  return localStorage.getItem(CURRENT_DOCUMENT_ID_KEY) || "";
}

export function setCurrentCloudDocumentId(documentId) {
  if (!documentId) return;
  localStorage.setItem(CURRENT_DOCUMENT_ID_KEY, documentId);
}

export function clearCurrentCloudDocumentId() {
  localStorage.removeItem(CURRENT_DOCUMENT_ID_KEY);
}

/* ============================
   DOCUMENTS
   ============================ */

export async function saveCloudDocument({
  documentId,
  title = "Đề kiểm tra Toán 8 - Chương 1",
  subject = "Toán",
  grade = "",
  pages = [],
}) {
  const user = await getCurrentUserOrThrow();
  let nextDocumentId = documentId;

  if (!nextDocumentId) {
    const { data, error } = await supabase
      .from("documents")
      .insert({
        owner_id: user.id,
        title,
        subject,
        grade,
        status: "draft",
        page_size: "A4",
        orientation: "portrait",
        last_opened_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) throw error;
    nextDocumentId = data.id;
    setCurrentCloudDocumentId(nextDocumentId);
  } else {
    const { error } = await supabase
      .from("documents")
      .update({
        title,
        last_opened_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", nextDocumentId);

    if (error) throw error;
  }

  // pages
  const dbPages = pages.map((page, index) => ({
    document_id: nextDocumentId,
    page_index: index,
    html_content: page.html || "",
    plain_text: htmlToPlainText(page.html || ""),
  }));

  const { error: deletePagesError } = await supabase
    .from("document_pages")
    .delete()
    .eq("document_id", nextDocumentId);
  if (deletePagesError) throw deletePagesError;

  if (dbPages.length > 0) {
    const { error: insertPagesError } = await supabase
      .from("document_pages")
      .insert(dbPages);
    if (insertPagesError) throw insertPagesError;
  }

  // figures
  const allFigures = [];
  pages.forEach((page, pageIndex) => {
    (page.figures || []).forEach((figure, figIndex) => {
      allFigures.push({
        document_id: nextDocumentId,
        page_index: pageIndex,
        local_id: figure.id,
        figure_type: figure.type || "geometry",
        title: figure.title || `Hình ${figIndex + 1}`,
        objects: figure.objects || [],
        box: figure.box || {},
        show_grid: figure.showGrid !== undefined ? figure.showGrid : true,
        show_axis: figure.showAxis || false,
        sort_order: figIndex,
      });
    });
  });

  const { error: deleteFiguresError } = await supabase
    .from("document_figures")
    .delete()
    .eq("document_id", nextDocumentId);
  if (deleteFiguresError) throw deleteFiguresError;

  if (allFigures.length > 0) {
    const { error: insertFiguresError } = await supabase
      .from("document_figures")
      .insert(allFigures);
    if (insertFiguresError) throw insertFiguresError;
  }

  return {
    documentId: nextDocumentId,
    pageCount: dbPages.length,
    figureCount: allFigures.length,
  };
}

export async function listCloudDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select("id,title,subject,grade,status,created_at,updated_at")
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listRecentDocuments(limit = 7) {
  const { data, error } = await supabase
    .from("documents")
    .select("id,title,subject,grade,status,created_at,updated_at")
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function loadCloudDocument(documentId) {
  const { data: documentData, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (documentError) throw documentError;

  const { data: pagesData, error: pagesError } = await supabase
    .from("document_pages")
    .select("*")
    .eq("document_id", documentId)
    .order("page_index", { ascending: true });

  if (pagesError) throw pagesError;

  const { data: figuresData, error: figuresError } = await supabase
    .from("document_figures")
    .select("*")
    .eq("document_id", documentId)
    .order("sort_order", { ascending: true });

  if (figuresError) throw figuresError;

  const pages = (pagesData || []).map((page, index) => {
    const pageFigures = (figuresData || [])
      .filter((fig) => fig.page_index === page.page_index)
      .map((fig) => ({
        id: fig.local_id,
        type: fig.figure_type,
        title: fig.title,
        objects: fig.objects || [],
        box: fig.box || {},
        showGrid: fig.show_grid,
        showAxis: fig.show_axis,
      }));

    return {
      id: page.id,
      title: `Trang ${index + 1}`,
      html: page.html_content || "",
      figures: pageFigures,
      selectedFigureId: null,
    };
  });

  setCurrentCloudDocumentId(documentId);

  return {
    document: documentData,
    pages,
  };
}

export async function createDocument({ title, subject, grade }) {
  const user = await getCurrentUserOrThrow();

  const { data, error } = await supabase
    .from("documents")
    .insert({
      owner_id: user.id,
      title: title || "Đề kiểm tra mới",
      subject: subject || "Toán",
      grade: grade || "",
      status: "draft",
    })
    .select("id,title,subject,grade,status,created_at,updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function renameDocument(documentId, newTitle) {
  const { data, error } = await supabase
    .from("documents")
    .update({ title: newTitle, updated_at: new Date().toISOString() })
    .eq("id", documentId)
    .select("id,title,updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function duplicateDocument(documentId) {
  const original = await loadCloudDocument(documentId);
  const newTitle = `${original.document.title} (Sao chép)`;

  return await saveCloudDocument({
    documentId: null,
    title: newTitle,
    subject: original.document.subject,
    grade: original.document.grade || "",
    pages: original.pages,
  });
}

export async function deleteDocument(documentId) {
  const { error } = await supabase
    .from("documents")
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq("id", documentId);

  if (error) throw error;
  return true;
}

export async function getDocumentStats() {
  const user = await getCurrentUserOrThrow();

  const { count: totalDocs } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("is_deleted", false);

  const { count: totalPages } = await supabase
    .from("document_pages")
    .select("*", { count: "exact", head: true })
    .eq(
      "document_id",
      (
        await supabase
          .from("documents")
          .select("id")
          .eq("owner_id", user.id)
          .eq("is_deleted", false)
      ).data?.map((d) => d.id) || [],
    );

  const { count: publishedDocs } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("status", "published")
    .eq("is_deleted", false);

  return {
    totalDocuments: totalDocs || 0,
    totalPages: totalPages || 0,
    publishedDocuments: publishedDocs || 0,
  };
}

/* ============================
   TEMPLATES
   ============================ */

export async function listTemplates(category = null) {
  let query = supabase
    .from("templates")
    .select(
      "id,name,subject,grade,description,category,is_premium,price,download_count",
    )
    .eq("is_active", true)
    .order("download_count", { ascending: false });

  if (category && category !== "Tất cả") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function loadTemplateContent(templateId) {
  const { data, error } = await supabase
    .from("templates")
    .select("id,name,html_content")
    .eq("id", templateId)
    .single();

  if (error) throw error;

  await supabase
    .from("templates")
    .update({ download_count: (data.download_count || 0) + 1 })
    .eq("id", templateId)
    .catch(() => {});

  return data;
}
