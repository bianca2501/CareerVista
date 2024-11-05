// Import mongoose at the top of the file
import mongoose, { Schema, model } from "mongoose";

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
    required: false,
  },
});

// Export UserModel
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

// Export CounselorModel
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

// Export FeedbackModel
export const FeedbackModel = model("feedback", FeedbackSchema);

// Video Schema
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
  },
});

// Export VideoModel
export const VideoModel = model("video", VideoSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://biancan2601:ZguGeLE0kITQIWY0@careervista.ppqol.mongodb.net/?retryWrites=true&w=majority&appName=CareerVista', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));
