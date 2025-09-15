export type LeadState = "PENDING" | "REACHED_OUT";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  country: string;
  visas: string[];
  resume?: {
    filename: string;
    mime: string;
    base64: string;
  };
  notes?: string;
  state: LeadState;
  createdAt: string;
}
