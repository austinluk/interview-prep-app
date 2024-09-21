"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import questions from "@/data/questions";

const CodeEditor = ({ width = "100%" }) => {
  const initialQuestion =
    questions.length > 0
      ? questions[Math.floor(Math.random() * (questions.length - 1 - 0 + 1))]
      : null;

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [code, setCode] = useState(
    currentQuestion
      ? currentQuestion.content
      : "// No question content available."
  );
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      const result = eval(code);
      setOutput(result || "No output");
    } catch (error) {
      setOutput(error.toString());
    }
  };

  if (!currentQuestion) {
    return <div>No questions available!</div>;
  }

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
