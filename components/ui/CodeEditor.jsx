"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import questions from "@/data/questions";

const CodeEditor = ({ width = "100%" }) => {
  const initialQuestion =
    questions.length > 0
      ? questions[Math.floor(Math.random() * (questions.length - 1 - 0 + 1))]
      : null;

  /*
Question 0 answer

let searchCoordinates = function(c, t) {
    return c.includes(t);
}

*/

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [code, setCode] = useState(
    currentQuestion
      ? currentQuestion.content + "\n\n// Write your code here \n\n"
      : "// No question content available."
  );
  const [output, setOutput] = useState("");
  // const [testResult, setTestResult] = useState(false);

  const runCode = () => {
    try {
      const result = new Function(code)();
      setOutput(result !== undefined ? result.toString() : "No output");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const checkTests = () => {
    let passed = true;
    let results = "";

    for (let i = 0; i < currentQuestion["testcase"].length; i++) {
      const testcase = currentQuestion["testcase"][i];
      const expectedSolution = currentQuestion["solution"][i];

      try {
        const args = Object.values(testcase)
          .map((arg) => JSON.stringify(arg))
          .join(", ");

        const result = new Function(
          code + "\n" + `return ${currentQuestion["function_name"]}(${args})`
        )();

        if (result === expectedSolution) {
          results += `Test case ${i + 1}: Passed\n`;
        } else {
          results += `Test case ${
            i + 1
          }: Failed\nExpected: ${expectedSolution}\nGot: ${result}\n\n`;
          passed = false;
        }
      } catch (error) {
        results += `Test case ${i + 1}: Error\nMessage: ${error.message}\n\n`;
        passed = false;
      }
    }

    setOutput(`All tests passed: ${passed}\n\n` + results);
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

        <button
          onClick={checkTests}
          style={{
            backgroundColor: "#007acc",
            color: "#ffffff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Run tests
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
