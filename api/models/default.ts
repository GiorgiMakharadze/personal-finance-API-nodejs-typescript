import mongoose, { Document, Schema } from "mongoose";

export interface IDefault extends Document {
  name: string;
  description: string;
  category: string;
  type: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const defaultsSchema: Schema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  type: {
    type: String,
    enum: ["income", "outgoing"],
  },
  status: {
    type: String,
    enum: ["Processing", "Completed"],
  },
});

export default mongoose.model<IDefault>("Default", defaultsSchema);
