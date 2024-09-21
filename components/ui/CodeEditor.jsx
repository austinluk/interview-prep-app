"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ width = "100%" }) => {
  const [code, setCode] = useState(`
    
let a = function(){
    return "hi"
}

a();`);
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      const result = eval(code);
      setOutput(result ? result.toString() : "No output");
    } catch (error) {
      setOutput(error.toString());
    }
  };

  return (
    <div
      style={{
        width: width,
        height: "auto",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
      }}
    >
      <div style={{ height: "70vh" }}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value)}
        />
      </div>

      <div style={{ padding: "10px" }}>
        <button
          onClick={runCode}
          style={{
            backgroundColor: "#007acc",
            color: "#ffffff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Run Code
        </button>
      </div>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#252526",
          color: "#ffffff",
          height: "150px",
          overflowY: "auto",
        }}
      >
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
