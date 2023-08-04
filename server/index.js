const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3001;

const DB = process.env.DATABASE;

// Connect to MongoDB
mongoose.connect(DB);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Create Task model
const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
});

const Task = mongoose.model("Task", taskSchema);

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your client's URL
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(bodyParser.json());

// Create a new task
app.post("/api/tasks", async (req, res) => {
  console.log(req.body.noteText);
  try {
    const task = new Task(req.body.noteText);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(tasks);
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update task status
app.patch("/api/tasks/:id", async (req, res) => {
  console.log(req.body);
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
