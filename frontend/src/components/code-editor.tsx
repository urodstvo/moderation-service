import { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

export const CodeEditor = ({ disabled, code }: { disabled?: boolean; code: string }) => {
  const [value, setCode] = useState(code);
  return (
    <div className="code-editor">
      <Editor
        disabled={disabled}
        value={value}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.js, "js")}
        padding={8}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </div>
  );
};
