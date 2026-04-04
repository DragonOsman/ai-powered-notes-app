import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  authId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  alternateEmails: {
    type: [String],
    default: []
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, {
  timestamps: true
});

export const User = models.User || model("User", UserSchema);