"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import questions from "@/data/questions";

import { useStore } from "./wrapper";
import OpenAI from "openai";
import { useDebouncedCallback } from "use-debounce";

let CodeEditor = ({ width = "100%" }) => {
  // ** GLOBAL STATES **

  // Set initial score
  const setScore = useStore((state) => state.setJudgeScore);

  // Question (question.content) to send to GPT
  const setQuestionToGPT = useStore((state) => state.setQuestion);

  // User code to send to GPT
  const setUserCodeToGPT = useStore((state) => state.setCode);

  const setResponse = useStore((state) => state.setResponse);
  const response = useStore((state) => state.response);

  const conversationHistory = useStore((state) => state.history);
  const setConversationHistory = useStore(
    (state) => state.setConversationHistory
  );

  // Handler for initial score (%)
  const handleScore = (newScore) => {
    setScore(newScore);
  };

  // Get a random question
  let initialQuestion =
    questions.length > 0
      ? questions[Math.floor(Math.random() * (questions.length - 1))]
      : null;

  // Set initial code to initialize GPT context

  // Current question to display
  let [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  setQuestionToGPT(currentQuestion?.content.replace(/\/\//g, ""));

  // Current code to display
  let [code, setCode] = useState(
    currentQuestion
      ? currentQuestion.content +
          "\n\n// Write your code here \n\n" +
          `const ${currentQuestion["function_name"]} = function (${Object.keys(
            currentQuestion["input_type"]
          ).join(", ")}) {\n}`
      : "// No question content available."
  );

  // Output when running code
  let [output, setOutput] = useState("");

  // Send user editor code to ChatGPT
  const handleUserCode = async (code) => {
    console.log("EVENT HANDELED");
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const messages = [
        ...(conversationHistory || []),
        {
          role: "system",
          content: "Here is the code the candidate has written so far: " + code,
        },
      ];

      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4o-mini",
      });

      const newMessage = {
        role: "assistant",
        content: completion.choices[0].message.content,
      };
      setConversationHistory([
        {
          role: "system",
          content:
            "The candidate already knows the question, so you can start the interview directly. So don't state any parts of the question, including the function name. DON'T GIVE SOLUTIONS UNDER ANY CIRCUMSTANCES!",
        },
        ...(conversationHistory || []),
        {
          role: "user",
          content: "Here is the code the candidate has written so far: " + code,
        },
        newMessage,
      ]);
      // setResponse(completion.choices[0].message.content);
      console.log("CODE EDITOR CONVERSATION HISTORY:", conversationHistory);
      // console.log(
      //   "EDITOR CODE REACTION: ",
      //   completion.choices[0].message.content
      // );
      setResponse(completion.choices[0].message.content);
      console.log("EDITOR CODE REACTION: ", response);
      // console.log(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error sending text to ChatGPT:", error);
      // setResponse("Error occurred while contacting ChatGPT.");
    }
  };

  // Debounce handleUserCode to execute 10 seconds after typing stops
  const debouncedHandleUserCode = useDebouncedCallback(handleUserCode, 10000);

  // Handler for running the code
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
    let correct = 0;
    let questions = currentQuestion["testcase"].length;

    for (let i = 0; i < questions; i++) {
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

        if (result == expectedSolution) {
          results += `Test case ${i + 1}: Passed\n`;
          correct++;
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
    handleScore((correct / questions) * 100);
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
          onChange={(value) => {
            setCode(value);
            // handleUserCode(value);
            debouncedHandleUserCode(value);
            console.log("NEW STUFF: ", value);
          }}
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

      <div className="p-2 bg-white text-black h-auto">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
