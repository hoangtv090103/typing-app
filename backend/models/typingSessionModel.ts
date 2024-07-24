import mongoose, { Schema } from "mongoose";

const typingSessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  textSample: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  mistakes: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TypingSession = mongoose.model("TypingSession", typingSessionSchema);
module.exports = TypingSession;

export default TypingSession;
