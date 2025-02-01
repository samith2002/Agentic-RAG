// app.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const SERP_API_KEY = 'API KEY';

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/query", async (req, res) => {
    const { query, isWebSearchActivated } = req.body;

    try {
        let results = [];

        if (isWebSearchActivated) {
            const searchResponse = await axios.get(`https://serpapi.com/search`, {
                params: {
                    api_key: SERP_API_KEY,
                    q: query,
                    engine: "google",
                    num: 5  // Request 5 results
                }
            });

            if (searchResponse.data.organic_results && searchResponse.data.organic_results.length > 0) {
                results = searchResponse.data.organic_results.slice(0, 5).map(result => ({
                    title: result.title,
                    link: result.link,
                    snippet: result.snippet
                }));
            }
        } else {
            // RAG system
            const response = await axios.post("http://127.0.0.1:5000/query", { query });
            if (response.data && response.data.answer) {
                results = [{
                    title: "RAG Response",
                    snippet: response.data.answer,
                    link: null
                }];
            }
        }

        res.json({ results });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "An error occurred while processing the query." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});
