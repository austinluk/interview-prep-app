"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import questions from "@/data/questions";

let CodeEditor = ({ width = "100%" }) => {
  let initialQuestion =
    questions.length > 0
      ?  questions[Math.floor(Math.random() * (questions.length - 1 - 0 + 1))]
      : null;

  /*
Question 0 answer

let searchCoordinates = function(c, t) {
    return c.includes(t);
}

*/

  let [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  let [code, setCode] = useState(
    currentQuestion
    ? currentQuestion.content + "\n\n// Write your code here \n\n" + `const ${currentQuestion["function_name"]} = function (${Object.keys(currentQuestion["input_type"]).join(", ")}) {\n}`
    : "// No question content available."
  );
  let [output, setOutput] = useState("");

  let runCode = () => {
    try {
      let result = new Function(code)();
      setOutput(result !== undefined ? result.toString() : "No output");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  let checkTests = () => {
    let passed = true;
    let results = "";

    for (let i = 0; i < currentQuestion["testcase"].length; i++) {
      let testcase = currentQuestion["testcase"][i];
      let expectedSolution = currentQuestion["solution"][i];

      try {
        let args = Object.values(testcase)
          .map((arg) => JSON.stringify(arg))
          .join(", ");

        let result = new Function(
          code + "\n" + `return ${currentQuestion["function_name"]}(${args})`
        )();

        if (Array.isArray(expectedSolution)) {
          expectedSolution = JSON.stringify(expectedSolution);
          result = JSON.stringify(result);
          testcase= JSON.stringify(testcase);
        }

        if (result == expectedSolution) {
          results += `Test case ${i + 1}: Passed\n`;
        } else {
          results += `Test case ${
            i + 1
          }: Failed\nInput:${testcase}\nExpected: ${expectedSolution}\nGot: ${result}\n\n`;
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
