import { Schema, model } from "mongoose";

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
  }
});

export const UserModel = model("user", UserSchema);

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

// Define FeedbackSchema
const FeedbackSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Reference to the User model
    required: true,
  },
  counselor: {
    type: Schema.Types.ObjectId,
    ref: 'counselor', // Reference to the Counselor model
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export FeedbackModel
export const FeedbackModel = model("feedback", FeedbackSchema);

// Define VideoSchema
const VideoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export VideoModel
export const VideoModel = model("video", VideoSchema);
