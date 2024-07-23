import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prefferedLanguage: {
    type: String,
    required: true,
  },
  preferredLength: {
    type: Number,
    required: true,
  },
  prefferedDifficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  theme: {
    type: String,
    default: "light",
  },
});

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
