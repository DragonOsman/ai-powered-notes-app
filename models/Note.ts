import mongoose, {
  Schema,
  model,
  models
} from "mongoose";

const NoteSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  summary: {
    type: String
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Note = models.Note || model("Note", NoteSchema);
