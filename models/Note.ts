import {
  Schema,
  model,
  models,
  type Model
} from "mongoose";

interface INote {
  userId: string;
  title: string;
  content: string;
  summary?: string;
  archived: boolean;
  tags: string[];
  todos: {
    task: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
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
      required: true
    },
    summary: {
      type: String,
      default: ""
    },
    archived: {
      type: Boolean,
      default: false
    },
    tags: {
      type: [String],
      default: []
    },
    todos: {
      type: [{
        task: {
          type: String,
          required: true
        }
      }],
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Note: Model<INote> =
  models.Note ??
  model<INote>("Note", NoteSchema)
;