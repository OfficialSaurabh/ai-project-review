export function getLanguage(path: string): string {
  const ext = path.split(".").pop();

  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "py":
      return "python";
    case "json":
      return "json";
    case "html":
      return "markup";
    case "css":
      return "css";
    default:
      return "javascript";
  }
}
