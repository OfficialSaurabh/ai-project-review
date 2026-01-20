"use client";
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";   // <-- ADD
import "prismjs/components/prism-tsx";


interface CodeSnippetProps {
  code: string;
  language: string;
  startLine: number;
}

export const CodeSnippet = ({ code, language, startLine }: CodeSnippetProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [code]);

  return (
    <pre className="code-snippet  line-numbers w-full max-h-[200px] overflow-y-auto whitespace-break-spaces text-sm rounded-lg p-2" data-start={startLine}>
      <code ref={ref} className={`language-${language} block w-full whitespace-break-spaces break-words`}>
        {code}
      </code>
    </pre>
  );
};
