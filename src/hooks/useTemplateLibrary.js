import { useEffect, useState } from "react";
import { listTemplatesFromDb } from "../services/templateService";

export function useTemplateLibrary(fallbackTemplates = []) {
  const [templates, setTemplates] = useState(fallbackTemplates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refreshTemplates() {
    setLoading(true);
    setError("");

    try {
      const dbTemplates = await listTemplatesFromDb();
      setTemplates(dbTemplates.length ? dbTemplates : fallbackTemplates);
    } catch (err) {
      setError(err.message || "Không tải được mẫu từ database.");
      setTemplates(fallbackTemplates);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    refreshTemplates,
  };
}
