import mongoose, { Schema, Document } from "mongoose";

export interface IApartment extends Document {
  title: string;
  image: string;
  link: string;
  description: string;
  guests: number;
  beds: number;
  size: string;
  address: string;
}

const ApartmentSchema = new Schema<IApartment>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  guests: { type: Number, required: true },
  beds: { type: Number, required: true },
  size: { type: String, required: true },
  address: { type: String, required: true },
});

export default mongoose.models.Apartment ||
  mongoose.model<IApartment>("Apartment", ApartmentSchema);
