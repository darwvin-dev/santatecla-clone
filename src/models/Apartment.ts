import mongoose, { Schema, Document, Model } from "mongoose";

export const AMENITY_KEYS = [
  "macchina_caffe",
  "aria_condizionata",
  "bollitore",
  "tostapane",
  "lavastoviglie",
  "self_check_in",
  "tv",
  "lavatrice",
  "set_di_cortesia",
  "microonde",
  "biancheria",
  "culla_su_richiesta",
  "wifi",
  "parcheggio_esterno",
  "animali_ammessi",
  "asciugacapelli",
  "balcone",
] as const;

export type Amenity = (typeof AMENITY_KEYS)[number];

export type Rules = {
  checkInFrom?: string;
  checkInTo?: string;
  checkOutBy?: string;
};

export type CancellationPolicy = "free_until_5_days" | "flexible" | "strict";

export type Cancellation = {
  policy: CancellationPolicy;
  note?: string;
  note_en?: string;
};

export interface IApartment extends Document {
  title: string;
  description: string;
  details?: string;
  address: string;
  addressDetail?: string;

  /** EN */
  title_en?: string;
  description_en?: string;
  details_en?: string;
  address_en?: string;
  addressDetail_en?: string;

  image: string;
  gallery: string[];
  plan?: string;

  guests: number;
  sizeSqm: number;
  floor?: string;
  floor_en?: string;
  bathrooms: number;

  cir?: string;
  cin?: string;

  amenities: Amenity[];
  rules?: Rules;
  cancellation?: Cancellation;

  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  lat?: number;
  lng?: number;

  beds?: number;
  size?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const RulesSchema = new Schema<Rules>(
  {
    checkInFrom: { type: String },
    checkInTo: { type: String },
    checkOutBy: { type: String },
  },
  { _id: false }
);

const CancellationSchema = new Schema<Cancellation>(
  {
    policy: {
      type: String,
      enum: ["free_until_5_days", "flexible", "strict"],
      required: true,
    },
    note: { type: String },
    note_en: { type: String },
  },
  { _id: false }
);

const ApartmentSchema = new Schema<IApartment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    image: { type: String, required: true, trim: true },
    gallery: { type: [String], default: [] },
    plan: { type: String, trim: true },

    description: { type: String, required: true },
    details: { type: String },

    title_en: { type: String, trim: true },
    description_en: { type: String, trim: true },
    details_en: { type: String, trim: true },
    address_en: { type: String, trim: true },
    addressDetail_en: { type: String, trim: true },

    guests: { type: Number, required: true, min: 1 },
    sizeSqm: { type: Number, required: true, min: 1 },
    floor: { type: String, trim: true },
    floor_en: { type: String, trim: true },
    bathrooms: { type: Number, required: true, min: 1 },

    address: { type: String, required: true, trim: true },
    addressDetail: { type: String, trim: true },

    cir: { type: String, trim: true, default: "" },
    cin: { type: String, trim: true, default: "" },

    amenities: {
      type: [{ type: String, enum: AMENITY_KEYS }],
      default: [],
    },
    rules: { type: RulesSchema },
    cancellation: { type: CancellationSchema },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: undefined,
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
    lat: { type: Number },
    lng: { type: Number },

    beds: { type: Number, min: 0 },
    size: { type: String },
  },
  {
    timestamps: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ApartmentSchema.index({ location: "2dsphere" });

ApartmentSchema.index({
  title: "text",
  title_en: "text",
  address: "text",
  address_en: "text",
  description: "text",
  description_en: "text",
});

const Apartment: Model<IApartment> =
  mongoose.models.Apartment ||
  mongoose.model<IApartment>("Apartment", ApartmentSchema);

export default Apartment;
