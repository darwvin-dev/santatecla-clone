export type AmenityKey =
  | "macchina_caffe"
  | "aria_condizionata"
  | "bollitore"
  | "tostapane"
  | "lavastoviglie"
  | "self_check_in"
  | "tv"
  | "lavatrice"
  | "set_di_cortesia"
  | "microonde"
  | "biancheria"
  | "culla_su_richiesta"
  | "wifi"
  | "parcheggio_esterno"
  | "animali_ammessi"
  | "asciugacapelli"
  | "balcone";

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
  floor_en?: string;

  image: string;
  gallery: string[];
  plan?: string;

  guests: number;
  beds?: number;
  sizeSqm: string;
  floor?: string;
  bathrooms: number;

  cir?: string;
  cin?: string;

  amenities: AmenityKey[];
  rules?: {
    checkInFrom?: string;
    checkInTo?: string;
    checkOutBy?: string;
  };
  cancellation?: {
    policy: "free_until_5_days" | "flexible" | "strict";
    note?: string;
    note_en?: string;
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
