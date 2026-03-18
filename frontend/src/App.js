import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!age || !gender || !symptoms) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("https://ai-symptom-checker-1-xo4o.onrender.com", {
        age,
        gender,
        symptoms
      });

      setResult(res.data.result);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🧠 AI Symptom Checker</h1>

        <div className="form">
          <input
            type="number"
            placeholder="Enter Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <textarea
            placeholder="Describe your symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {result && (
          <div className="result">
            <h2>🩺 Result</h2>
            <pre>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
