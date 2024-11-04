import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import { CounselorModel, UserModel, VideoModel, FeedbackModel } from "./model.js"; // Ensure all models are imported

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware: To console log incoming requests
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// User registration endpoint
app.post("/user/register", async (req, res) => {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({ name, email, password: hashedPassword, username });
    res.status(200).json({ message: "User registered" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User login endpoint
app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Check the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    // Return user ID upon successful login
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to store aptitude test results
app.post("/user/save-result", async (req, res) => {
  const { userId, testResult } = req.body;

  if (!userId || !testResult) {
    res.status(400).json({ message: "User ID and test result are required" });
    return;
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update user's test result
    user.test_result = testResult;
    await user.save();

    res.status(200).json({ message: "Test result saved successfully" });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/user/test-submission/:userId', async (req, res) => {
  const userId = req.params.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  const userTestRecord = user.test_result;
  if (userTestRecord) {
      return res.json({ hasSubmitted: true });
  } else {
      return res.json({ hasSubmitted: false });
  }
});

// Counselor registration endpoint
app.post("/counselor/register", async (req, res) => {
  const { name, email, password, username, highestQualification, experience } = req.body;
  if (!name || !email || !password || !username || !highestQualification || !experience) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    const existingCounselor = await CounselorModel.findOne({ $or: [{ email }, { username }] });
    if (existingCounselor) {
      res.status(400).json({ message: "Counselor already exists" });
      return;
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    await CounselorModel.create({
      name,
      email,
      password: hashedPassword,
      username,
      highestQualification,
      experience,
    });
    res.status(200).json({ message: "Counselor registered" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Counselor login endpoint
app.post("/counselor/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const counselor = await CounselorModel.findOne({ username });

    if (!counselor) {
      res.status(400).json({ message: "Counselor not found" });
      return;
    }

    // Check the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, counselor.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    // Return counselor ID upon successful login
    res.status(200).json({ message: "Login successful", counselorId: counselor._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get total number of counselors and students
app.get('/api/stats', async (req, res) => {
  try {
    const counselorCount = await CounselorModel.countDocuments();
    const studentCount = await UserModel.countDocuments(); // Assuming UserModel is for students
    const videoCount = await VideoModel.countDocuments(); // Assuming VideoModel is for videos
    const feedbackCount = await FeedbackModel.countDocuments(); // Assuming FeedbackModel is for feedbacks

    return res.status(200).json({
      totalCounselors: counselorCount,
      totalStudents: studentCount,
      totalVideos: videoCount,
      totalFeedbacks: feedbackCount,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to get all counselors
app.get("/api/counselors", async (req, res) => {
  try {
    const counselors = await CounselorModel.find();
    return res.status(200).json(counselors);
  } catch (error) {
    console.error("Error fetching counselors:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get all students (assuming UserModel represents students)
app.get("/api/students", async (req, res) => {
  try {
    const students = await UserModel.find();
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get all videos
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await VideoModel.find(); // Ensure you have a VideoModel defined
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get all feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find().populate('student counselor'); // Adjust this as necessary
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Connect to MongoDB and start the server
mongoose
 
