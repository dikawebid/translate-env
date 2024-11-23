import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const inputFmt = {
	ENV: "env",
	JSON: "json",
}

function App() {
    const [inputFormat, setInputFormat] = useState(inputFmt.JSON); // "env" or "json"
    const [inputValue, setInputValue] = useState("USER_URL=http://dk-api-user:8080");
    const [result, setResult] = useState('{"USER_URL": "http://dk-api-user:8080"}');

	// Set init
	useEffect(() => {
		const temp = result;
		setResult(inputValue);
		setInputValue(temp);
	}, [inputFormat]);

	useEffect(() => {
		handleConvert();
	}, [inputValue])

    // Function to convert .env to JSON
    const envToJson = (envString) => {
        const lines = envString.split("\n");
        const jsonObject = {};
        lines.forEach((line) => {
            const [key, value] = line.split("=");
            if (key && value) {
                jsonObject[key.trim()] = value.trim();
            }
        });
        return JSON.stringify(jsonObject, null, 4);
    };

    // Function to convert JSON to .env
    const jsonToEnv = (jsonString) => {
        try {
            const jsonObject = JSON.parse(jsonString);
            return Object.entries(jsonObject)
                .map(([key, value]) => `${key}=${value}`)
                .join("\n");
        } catch (error) {
            return "Invalid JSON format!";
        }
    };

    // Handle conversion
    const handleConvert = () => {
        if (inputFormat === inputFmt.ENV) {
            setResult(envToJson(inputValue));
        } else if (inputFormat === inputFmt.JSON) {
            setResult(jsonToEnv(inputValue));
        }
    };

    return (
        <div className="App">
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="convertType">Select Convert</label>
                    <select
                        id="convertType"
                        value={inputFormat}
                        onChange={(e) => setInputFormat(e.target.value)}
                        className="form-control"
                    >
                        <option value={inputFmt.JSON}>JSON to ENV</option>
                        <option value={inputFmt.ENV}>ENV to JSON</option>
                    </select>
                    <br />
                    <textarea
                        rows={12}
                        className="w-100 form-control"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        placeholder={
                            inputFormat === "env"
                                ? "Enter your .env format here..."
                                : "Enter your JSON format here..."
                        }
                    ></textarea>
                </div>
                <div className="col-md-6">
                    <label>Result</label>
                    <br />
                    <textarea
                        rows={12}
                        className="w-100 form-control"
                        disabled
                        placeholder="Result will appear here..."
                        value={result}
                    ></textarea>
					<br/>
					<div style={{ marginBottom: "10px" }}>
						<button onClick={handleConvert} className="btn btn-sm btn-success">Convert</button>
					</div>
                </div>
            </div>
        </div>
    );
}

export default App;