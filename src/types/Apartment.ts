export type Apartment = {
  _id: string;

  title: string;
  description: string;
  details?: string;
  address: string;
  addressDetail?: string;

  title_en?: string;
  description_en?: string;
  details_en?: string;
  address_en?: string;
  addressDetail_en?: string;

  image: string;
  gallery: string[];
  plan?: string;

  guests: number;
  beds?: number;
  sizeSqm: number;
  floor?: string;
  bathrooms: number;

  cir?: string;
  cin?: string;

  amenities: string[]; 
  rules?: {
    checkInFrom?: string;
    checkInTo?: string;
    checkOutBy?: string;
  };
  cancellation?: {
    policy: "free_until_5_days" | "flexible" | "strict";
    note?: string;
  };

  lat?: number;
  lng?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };

  size?: string;

  createdAt?: string;
  updatedAt?: string;

  link?: string;
};
