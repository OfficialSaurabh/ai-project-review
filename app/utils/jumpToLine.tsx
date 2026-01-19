const jumpToLine = (start: number, end: number) => {
  const pre = document.querySelector("pre.line-numbers") as HTMLElement;
  const rows = pre?.querySelector(".line-numbers-rows") as HTMLElement;
  if (!pre || !rows) return;

  // Remove old highlights
  pre.querySelectorAll(".highlight-line").forEach(el => el.remove());

  const preRect = pre.getBoundingClientRect();

  for (let line = start; line <= end; line++) {
    const numberRow = rows.children[line - 1] as HTMLElement;
    if (!numberRow) continue;

    const lineRect = numberRow.getBoundingClientRect();

    const highlight = document.createElement("div");
    highlight.className = "highlight-line";
    highlight.style.top = `${lineRect.top - preRect.top + pre.scrollTop}px`;
    highlight.style.height = `${lineRect.height}px`;

    pre.appendChild(highlight);
  }

  // Scroll to the first line in the range
  const first = rows.children[start - 1] as HTMLElement;
  first?.scrollIntoView({ behavior: "smooth", block: "center" });
};



export default jumpToLine;