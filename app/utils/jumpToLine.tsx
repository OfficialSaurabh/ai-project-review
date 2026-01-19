const jumpToLine = (line: number) => {
  const pre = document.querySelector("pre.line-numbers") as HTMLElement;
  const code = pre?.querySelector("code") as HTMLElement;
  const rows = pre?.querySelector(".line-numbers-rows") as HTMLElement;

  if (!pre || !code || !rows) return;

  const numberRow = rows.children[line - 1] as HTMLElement;
  if (!numberRow) return;

  numberRow.scrollIntoView({ behavior: "smooth", block: "center" });

  // Remove old highlight
  pre.querySelectorAll(".highlight-line").forEach(el => el.remove());

  const preRect = pre.getBoundingClientRect();
  const lineRect = numberRow.getBoundingClientRect();

  const highlight = document.createElement("div");
  highlight.className = "highlight-line";

  highlight.style.top = `${lineRect.top - preRect.top + pre.scrollTop}px`;
  highlight.style.height = `${lineRect.height}px`;

  pre.appendChild(highlight);
};


export default jumpToLine;