import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categoriesSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICategory>("Category", categoriesSchema);
