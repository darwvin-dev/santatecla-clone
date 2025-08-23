import { Schema, model, models } from "mongoose";

const DynamicPartSchema = new Schema(
  {
    key: { type: String, required: true },                
    page: { type: String, required: true, index: true },  
    title: { type: String, default: "" },
    secondTitle: { type: String, default: "" },
    description: { type: String, default: "" },
    secondDescription: { type: String, default: "" },
    title_en: { type: String, default: "" },
    secondTitle_en: { type: String, default: "" },
    description_en: { type: String, default: "" },
    secondDescription_en: { type: String, default: "" },
    image: { type: String, default: "" },
    mobileImage: { type: String, default: "" },
    image2: { type: String, default: "" },
    image3: { type: String },
    mobileImage3: { type: String },
    mobileImage2: { type: String, default: "" },
    order: { type: Number, default: 0 },                  
    published: { type: Boolean, default: true },
    parentId: { type: Schema.Types.ObjectId, ref: "DynamicPart", default: null, index: true },
  },
  { timestamps: true }
);

export type DynamicPartDoc = {
  _id: string;
  key: string;
  page: string;
  title?: string;
  secondTitle?: string;
  description?: string;
  secondDescription?: string;
  title_en?: string;
  secondTitle_en?: string;
  description_en?: string;
  secondDescription_en?: string;
  image?: string;
  mobileImage?: string;
  image2?: string;
  mobileImage2?: string;
  order: number;
  published: boolean;
};

export default models.DynamicPart || model("DynamicPart", DynamicPartSchema);
