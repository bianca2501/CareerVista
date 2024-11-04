import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { CounselorModel, UserModel } from "./model.js";
dotenv.config();

const app = express();

app.use(cors());

// Middleware: To get the request body
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

app.post("/user/register", async (req, res) => {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username || !role) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  await UserModel.findOne({ $or: [{ email }, { username }] }).then(
    async (user) => {
      if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
      } else {
        await UserModel.create({ name, email, password, username });
        res.status(200).json({ message: "User registered" });
      }
    }
  );
});

app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  await UserModel.findOne({ username }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    if (user.password !== password) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }
    res.status(200).json({ message: "Login successful" });
  });
});

app.post("/counselor/register", async (req, res) => {
  const { name, email, password, username, highestQualification, experience } =
    req.body;
  if (
    !name ||
    !email ||
    !password ||
    !username ||
    !highestQualification ||
    !experience
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }
  await CounselorModel.findOne({ $or: [{ email }, { username }] }).then(
    async (user) => {
      if (user) {
        res.status(400).json({ message: "Counselor already exists" });
        return;
      } else {
        await CounselorModel.create({
          name,
          email,
          password,
          username,
          highestQualification,
          experience,
        });
        res.status(200).json({ message: "Counselor registered" });
      }
    }
  );
});

app.post("/counselor/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  await CounselorModel.findOne({ username }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "Counselor not found" });
      return;
    }
    if (user.password !== password) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }
    res.status(200).json({ message: "Login successful" });
  });
});

mongoose
  .connect(process.env.MONGO_URI)

  // If Successful
  .then(() => {
    console.log("MongoDB Atlas Connection successful");
    // Listen to request
    app.listen(port, () => {
      console.log(`Server listening to port ${port}`);
    });
  })

  // If Failed
  .catch((err) => {
    console.log(err);
  });
