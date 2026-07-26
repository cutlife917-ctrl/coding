require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// If you are using the OpenAI SDK:
// const OpenAI = require("openai");
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname)));

// =============================
// File Upload
// =============================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded."
        });
    }

    res.json({
        success: true,
        filename: req.file.filename
    });

});

// =============================
// AI Chat
// =============================

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        // ----------------------------------
        // Replace this with your AI API call
        // ----------------------------------

        /*
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: message
        });

        const reply = response.output_text;
        */

        const reply = `You said: ${message}`;

        res.json({
            reply
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            reply: "Server Error"
        });

    }

});

// =============================
// Notes
// =============================

let notes = [];

app.post("/notes", (req, res) => {

    notes.push(req.body.note);

    res.json({
        success: true
    });

});

app.get("/notes", (req, res) => {

    res.json(notes);

});

// =============================
// Chat History
// =============================

let history = [];

app.post("/history", (req, res) => {

    history.push(req.body);

    res.json({
        success: true
    });

});

app.get("/history", (req, res) => {

    res.json(history);

});

// =============================
// Future Features
// =============================

// Image Recognition
app.post("/image-recognition", (req, res) => {
    res.json({
        message: "Coming Soon"
    });
});

// AI Image Generation
app.post("/generate-image", (req, res) => {
    res.json({
        message: "Coming Soon"
    });
});

// Internet Search
app.post("/search", (req, res) => {
    res.json({
        message: "Coming Soon"
    });
});

// 3D Models
app.get("/model/:name", (req, res) => {
    res.json({
        message: "Coming Soon"
    });
});

// =============================
// Start Server
// =============================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});