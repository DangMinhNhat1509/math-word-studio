import { supabase } from "../lib/supabaseClient";

export async function listTemplatesFromDb() {
  const { data, error } = await supabase
    .from("document_templates")
    .select("id,name,description,subject,grade,category,html_content,json_content,is_public,is_system,updated_at")
    .order("is_system", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    title: item.name,
    description: item.description,
    subject: item.subject,
    grade: item.grade,
    category: item.category,
    html: item.html_content,
    json: item.json_content || {},
    isPublic: item.is_public,
    isSystem: item.is_system,
  }));
}

export async function createTemplateInDb({
  name,
  description = "",
  subject = "Toán",
  grade = "",
  category = "Tự luận",
  html = "",
  json = {},
}) {
  const { data: userResult, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userResult.user) throw new Error("Bạn cần đăng nhập để tạo mẫu.");

  const { data, error } = await supabase
    .from("document_templates")
    .insert({
      owner_id: userResult.user.id,
      name,
      description,
      subject,
      grade,
      category,
      html_content: html,
      json_content: json,
      is_public: false,
      is_system: false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
