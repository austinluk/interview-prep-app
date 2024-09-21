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
  // const [testResult, setTestResult] = useState(false);

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
      // style={{
      //   width: width,
      //   height: "auto",
      //   backgroundColor: "#1e1e1e",
      //   color: "#ffffff",
      // }}
      className="h-full bg-muted text-black border border-border
      rounded-2xl p-8 overflow-scroll"
    >
      <div className="h-96">
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-light"
          onChange={(value) => setCode(value)}
        />
      </div>

      <div style={{ padding: "10px" }}>
        <button
          onClick={runCode}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Run Code
        </button>
      </div>

      <div className="p-2 bg-white text-black h-36">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
