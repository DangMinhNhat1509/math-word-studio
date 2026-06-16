import { supabase } from "../lib/supabaseClient";

export const CURRENT_DOCUMENT_ID_KEY = "mws_current_cloud_document_id";

function htmlToPlainText(html = "") {
  if (typeof document === "undefined") return "";

  const div = document.createElement("div");
  div.innerHTML = html;

  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

function normalizePagesForDb(pages = []) {
  return pages.map((page, index) => ({
    page_index: index,
    html_content: page.html || "",
    json_content: {
      local_id: page.id,
      title: page.title || `Trang ${index + 1}`,
      figures: page.figures || [],
      selectedFigureId: page.selectedFigureId || null,
      editor: "math-word-studio",
      schemaVersion: 1,
    },
    plain_text: htmlToPlainText(page.html || ""),
  }));
}

async function getCurrentUserOrThrow() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error("Bạn cần đăng nhập trước khi lưu lên cloud.");

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

export async function saveCloudDocument({
  documentId,
  title = "Đề kiểm tra Toán 8 - Chương 1",
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
        subject: "Toán",
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

  const dbPages = normalizePagesForDb(pages).map((page) => ({
    ...page,
    document_id: nextDocumentId,
  }));

  const { error: deleteError } = await supabase
    .from("document_pages")
    .delete()
    .eq("document_id", nextDocumentId);

  if (deleteError) throw deleteError;

  if (dbPages.length > 0) {
    const { error: insertError } = await supabase
      .from("document_pages")
      .insert(dbPages);

    if (insertError) throw insertError;
  }

  return {
    documentId: nextDocumentId,
    pageCount: dbPages.length,
  };
}

export async function listCloudDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select("id,title,subject,grade,status,page_size,orientation,updated_at,created_at")
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false });

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

  const pages = (pagesData || []).map((page, index) => ({
    id: page.json_content?.local_id || page.id,
    title: page.json_content?.title || `Trang ${index + 1}`,
    html: page.html_content || "",
    figures: page.json_content?.figures || [],
    selectedFigureId: null,
  }));

  setCurrentCloudDocumentId(documentId);

  return {
    document: documentData,
    pages,
  };
}
