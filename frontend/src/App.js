import { useState } from "react";
import "./App.css";

function App() {

  const [url, setUrl] = useState("");
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const runAgent = async () => {

    setLoading(true);

    const response = await fetch("http://localhost:5000/navigate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        instruction
      })
    });

    const data = await response.json();

    setResult(data.clicked);
    setLoading(false);

  };

  return (
    <div className="container">

      <div className="card">

        <h1>🤖 AI Website Navigation Agent</h1>

        <p className="subtitle">
          Control websites using natural language instructions
        </p>

        <input
          className="input"
          placeholder="Enter Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          className="input"
          placeholder="Enter instruction (e.g. Open contact page)"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />

        <button className="button" onClick={runAgent}>
          {loading ? "Running Agent..." : "Run Agent"}
        </button>

        {result && (
          <div className="result">
            AI Clicked: <strong>{result}</strong>
          </div>
        )}

      </div>

    </div>
  );
}

export default App;