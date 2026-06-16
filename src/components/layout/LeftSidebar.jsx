import { ActionIcon, Button, Group, Paper, ScrollArea, Text, Tooltip } from "@mantine/core";
import { FilePlus2, Trash2 } from "lucide-react";

function stripText(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

function safeHtml(html = "") {
  return html && html.trim() ? html : "<p>Trang trống</p>";
}

export default function LeftSidebar({
  pages,
  currentPageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
}) {
  return (
    <aside className="mws-page-panel word-page-panel">
      <Group justify="space-between" mb="sm" wrap="nowrap">
        <div>
          <Text fw={900} size="md">
            Trang
          </Text>
          <Text size="xs" c="dimmed" fw={700}>
            {pages.length} trang trong tài liệu
          </Text>
        </div>

        <Tooltip label="Thêm trang">
          <ActionIcon variant="light" color="blue" radius="md" onClick={onAddPage}>
            <FilePlus2 size={17} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <ScrollArea className="word-page-scroll" offsetScrollbars>
        <div className="word-page-list">
          {pages.map((page, index) => {
            const preview = stripText(page.html);
            const selected = page.id === currentPageId;

            return (
              <button
                key={page.id}
                type="button"
                className={selected ? "mws-page-card active word-page-card" : "mws-page-card word-page-card"}
                onClick={() => onSelectPage(page.id)}
              >
                <div className="mws-page-preview word-page-preview">
                  <div
                    className="mws-page-preview-content word-page-preview-content"
                    dangerouslySetInnerHTML={{ __html: safeHtml(page.html) }}
                  />
                </div>

                <Group gap={8} mt={8} wrap="nowrap">
                  <span className="word-page-number">{index + 1}</span>
                  <div className="word-page-info">
                    <Text size="sm" fw={900} lineClamp={1}>
                      Trang {index + 1}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {preview || "Trang trống"}
                    </Text>
                  </div>
                </Group>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <Paper className="word-page-actions" withBorder>
        <Button size="xs" radius="md" variant="light" leftSection={<FilePlus2 size={15} />} onClick={onAddPage}>
          Thêm
        </Button>

        <Button size="xs" radius="md" color="red" variant="light" leftSection={<Trash2 size={15} />} onClick={onDeletePage}>
          Xóa
        </Button>
      </Paper>
    </aside>
  );
}
