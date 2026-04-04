import mongoose, { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ""
  },
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Note",
    default: null
  },
  tags: [{
    type: String
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Note = models.Note || model("Note", NoteSchema);