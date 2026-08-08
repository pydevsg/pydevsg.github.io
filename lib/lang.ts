/** GitHub's own language colours, trimmed to what actually shows up here. */
const COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  HTML: "#E34C26",
  CSS: "#563D7C",
  SCSS: "#C6538C",
  Shell: "#89E051",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Vue: "#41B883",
  Svelte: "#FF3E00",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384D54",
  HCL: "#844FBA",
  Makefile: "#427819",
};

export function langColor(lang: string | null | undefined): string {
  if (!lang) return "#4A4A45";
  return COLORS[lang] ?? "#8B8B84";
}
