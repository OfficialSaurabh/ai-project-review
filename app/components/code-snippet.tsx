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
  }, [code, language]);

  return (
    <pre
      className="line-numbers text-sm rounded-lg overflow-auto"
      data-start={startLine}   // <-- THIS IS THE KEY
    >
      <code ref={ref} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};
