require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { runAgent } = require("./browserAgent");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/navigate", async (req, res) => {

    const { url, instruction } = req.body;

    try {

        const result = await runAgent(url, instruction);

        res.json({
            message: "Navigation successful",
            clicked: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Navigation failed"
        });

    }

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});