"use client";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

interface Props {
  code: string;
  language: string;
}

export const CodeViewer = ({ code, language }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (

    <pre className=" line-numbers text-sm h-[570px] w-[900px] rounded-lg overflow-auto">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default CodeViewer;