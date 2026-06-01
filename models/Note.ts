import {
  Schema,
  model,
  models,
  type Model
} from "mongoose";

export interface INote {
  id: string;
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
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => new Date().getTime().toString()
    },
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
    },
    tags: {
      type: [String],
      default: []
    },
    todos: {
      type: [{
        task: String
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