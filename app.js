import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

function App() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');

    const executeCode = async () => {
        try {
            const response = await axios.post('http://localhost:5000/execute', {
                language,
                code,
            });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="App">
            <h1>Online Code Editor</h1>
            <div className="editor-container">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="python">Python </option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="html">HTML</option>
                </select>
                <Editor
                    height="400px"
                    defaultLanguage="python"
                    value={code}
                    onChange={(value) => setCode(value)}
                />
                <button onClick={executeCode}>Run Code</button>
            </div>
            <h2>Output:</h2>
            <pre>{output}</pre>
        </div>
    );
}

export default App;
