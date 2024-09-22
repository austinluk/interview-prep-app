"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Editor from "@monaco-editor/react";
import questions from "@/data/questions";

let CodeEditor = ({ width = "100%" }) => {
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Function to get letter grade based on progress
  const getLetterGrade = () => {
    if (progress >= 90) return "A";
    if (progress >= 80) return "B";
    if (progress >= 70) return "C";
    if (progress >= 60) return "D";
    return "F";
  };

  let initialQuestion =
    questions.length > 0
      ? questions[Math.floor(Math.random() * (questions.length - 1 - 0 + 1))]
      : null;

  let [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  let [code, setCode] = useState(
    currentQuestion
    ? currentQuestion.content + "\n\n// Write your code here \n\n" + `const ${currentQuestion["function_name"]} = function (${Object.keys(currentQuestion["input_type"]).join(", ")}) {\n\n\n}`
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

  const checkTests = () => {
    let passedCount = 0;
    let results = [];

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
          testcase = JSON.stringify(testcase);
        }

        let passed = result == expectedSolution;

        if (passed) passedCount++;

        results.push({
          testCaseIndex: i + 1,
          passed,
          testcase,
          expected: expectedSolution,
          result,
        });
      } catch (error) {
        results.push({
          testCaseIndex: i + 1,
          passed: false,
          testcase,
          expected: expectedSolution,
          result: `Error: ${error.message}`,
        });
      }
    }

    // Update progress based on passed test cases
    let totalTests = currentQuestion["testcase"].length;
    let newProgress = Math.floor((passedCount / totalTests) * 100);
    setProgress(newProgress);

    return results;
  };

  const handleOpenModal = () => {
    const results = checkTests(); // Run tests when opening the modal
    setTestResults(results);
    setIsModalOpen(true);
  };

  if (!currentQuestion) {
    return <div>No questions available!</div>;
  }

  return (
    <div className="h-full bg-muted text-black border border-border rounded-2xl p-8 overflow-scroll">
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
      
      
      <button onClick={handleOpenModal} className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Open Progress Tracker</button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold">Your Progress</h2>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-lg">Progress: {progress}%</p>
            <p className="text-lg font-semibold">Grade: {getLetterGrade()}</p>

            {/* Dynamic accordion for test results */}
            <div className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {testResults.map((result) => (
                  <AccordionItem
                    key={`test-case-${result.testCaseIndex}`}
                    value={`test-case-${result.testCaseIndex}`}
                  >
                    <AccordionTrigger>{`Test Case ${result.testCaseIndex}`}</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        <strong>Input:</strong> {result.testcase}
                      </p>
                      <p>
                        <strong>Expected:</strong> {result.expected}
                      </p>
                      <p>
                        <strong>Result:</strong> {result.result}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {result.passed ? "Passed" : "Failed"}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Close button for modal */}
            <div className="mt-4">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 bg-white text-black h-36">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
    </div>
  );
};

export default CodeEditor;
