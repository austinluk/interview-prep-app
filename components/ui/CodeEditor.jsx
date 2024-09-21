'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ width = "100%" }) => {
  const [code, setCode] = useState('// Write your code here');

  return (
    <div style={{ width: width, height: '100vh' }}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        onChange={(value) => setCode(value)}
      />
    </div>
  );
};

export default CodeEditor;
