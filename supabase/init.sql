-- ============================================================
-- Math Word Studio — Full DB Schema
-- Chạy 1 lần duy nhất trong Supabase SQL Editor
-- ============================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
  balance INT DEFAULT 0,
  total_documents INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Đề kiểm tra mới',
  subject TEXT DEFAULT 'Toán',
  grade TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  page_size TEXT DEFAULT 'A4',
  orientation TEXT DEFAULT 'portrait',
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENT_PAGES
CREATE TABLE IF NOT EXISTS document_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page_index INT NOT NULL CHECK (page_index >= 0),
  html_content TEXT DEFAULT '<p><br></p>',
  plain_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (document_id, page_index)
);

-- 4. DOCUMENT_FIGURES
CREATE TABLE IF NOT EXISTS document_figures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page_index INT NOT NULL CHECK (page_index >= 0),
  local_id TEXT NOT NULL,
  figure_type TEXT DEFAULT 'geometry',
  title TEXT DEFAULT 'Hình 1',
  objects JSONB DEFAULT '[]'::jsonb,
  box JSONB DEFAULT '{}'::jsonb,
  show_grid BOOLEAN DEFAULT TRUE,
  show_axis BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEMPLATES
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT DEFAULT 'Toán',
  grade TEXT DEFAULT '',
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Tự luận',
  html_content TEXT DEFAULT '',
  is_premium BOOLEAN DEFAULT FALSE,
  price INT DEFAULT 0,
  download_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_document_pages_doc ON document_pages(document_id);
CREATE INDEX IF NOT EXISTS idx_document_figures_doc ON document_figures(document_id);
CREATE INDEX IF NOT EXISTS idx_templates_cat ON templates(category);

-- RLS
ALTER TABLE document_figures ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- SEED TEMPLATES (8 mẫu)
INSERT INTO templates (name, subject, grade, description, category, html_content, is_premium, price) VALUES
('Bài tam giác vuông', 'Toán', '8', 'Bài toán tam giác vuông áp dụng định lý Pythagore', 'Tự luận', '<h2>Bài toán tam giác vuông</h2>', FALSE, 0),
('Bài hình học chứng minh', 'Toán', '8', 'Bài hình học chứng minh đẳng thức', 'Tự luận', '<h2>Bài hình học</h2>', FALSE, 0),
('Trắc nghiệm 4 phương án', 'Toán', '8', 'Câu hỏi trắc nghiệm với 4 đáp án A-D', 'Trắc nghiệm', '<p><strong>Câu 1.</strong> Nội dung câu hỏi...</p>', FALSE, 0),
('Đáp án trắc nghiệm', 'Toán', '8', 'Bảng đáp án trắc nghiệm nhanh', 'Trắc nghiệm', '<h2>Đáp án</h2>', FALSE, 0),
('Đề kiểm tra 15 phút Đại số 8', 'Toán', '8', 'Đề kiểm tra 15 phút', 'Kiểm tra 15 phút', '<h2>Đề kiểm tra 15 phút</h2>', FALSE, 0),
('Đề kiểm tra 1 tiết Hình học 7', 'Toán', '7', 'Đề kiểm tra 1 tiết', 'Kiểm tra 1 tiết', '<h2>Đề kiểm tra 1 tiết</h2>', FALSE, 0),
('Ôn thi vào 10 - Đề 01', 'Toán', '9', 'Đề ôn thi vào lớp 10', 'Ôn thi vào 10', '<h2>Đề ôn thi vào lớp 10</h2>', TRUE, 5000),
('Đề học kỳ 1 - Toán 7', 'Toán', '7', 'Đề thi học kỳ 1', 'Học kỳ', '<h2>Đề thi học kỳ 1</h2>', FALSE, 0)
ON CONFLICT DO NOTHING;