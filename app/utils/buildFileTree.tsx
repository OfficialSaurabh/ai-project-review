export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

export function buildFileTree(paths: string[]): TreeNode[] {
  const root: any = {};

  for (const fullPath of paths) {
    const parts = fullPath.split("/");
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {};
      }
      if (index === parts.length - 1) {
        current[part].__meta = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: "file",
        };
      } else {
        current[part].__meta = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: "folder",
        };
      }
      current = current[part];
    });
  }

  function normalize(node: any): TreeNode[] {
    return Object.entries(node)
      .filter(([key]) => key !== "__meta")
      .map(([_, value]: any) => {
        const meta = value.__meta as TreeNode;

        if (meta.type === "folder") {
          meta.children = normalize(value);
        }

        return meta;
      });
  }

  return normalize(root);
}
