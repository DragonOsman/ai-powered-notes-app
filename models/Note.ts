import {
  Schema,
  model,
  models,
  type Model
} from "mongoose";

export interface INote {
  userId: string;
  title: string;
  content: string;
  summary?: string;
  archived: boolean;

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
      default: ""
    },
    summary: {
      type: String
    },
    archived: {
      type: Boolean,
      default: false
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