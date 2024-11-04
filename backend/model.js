import { Schema, model } from "mongoose";

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  test_result: {
    type: String,
    unique: false,
    required: false,
  },
});

export const UserModel = model("user", UserSchema);

// Counselor Schema
const CounselorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  highestQualification: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
});

export const CounselorModel = model("counselor", CounselorSchema);

// Feedback Schema
const FeedbackSchema = new Schema({
  counselorId: {
    type: Schema.Types.ObjectId,
    ref: "counselor",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

export const FeedbackModel = model("feedback", FeedbackSchema);

const VideoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "counselor",
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export const VideoModel = model("video", VideoSchema);