import { useState } from "react";
import { CiFolderOn, CiFileOn } from "react-icons/ci";
import { TreeNode } from "../utils/buildFileTree";

interface Props {
  nodes: TreeNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export const FileTree = ({ nodes, selectedPath, onSelect }: Props) => {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const TreeItem = ({
  node,
  selectedPath,
  onSelect,
}: {
  node: TreeNode;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const isSelected = selectedPath === node.path;

  if (node.type === "folder") {
    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer hover:text-primary"
        >
          <CiFolderOn />
          {node.name}
        </div>
        {open && (
          <div className="ml-4 border-l pl-2">
            {node.children?.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(node.path)}
      className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded 
        ${isSelected ? "bg-primary text-white" : "hover:bg-muted"}`}
    >
      <CiFileOn />
      {node.name}
    </div>
  );
};

export default FileTree;
