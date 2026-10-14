export interface Employee {
  _id?: string;
  name: string;
  contactInfo: { email: string; phone?: string };
  address: { street: string; city: string; state: string; zip: string };
  startDate: Date;
  profilePictureUrl?: string;
  education: { degree: string; institution: string; graduationYear: number };
  experienceYears: number;
  subjects?: string[];
  bio?: string;
  position?: string;
  yearJoined?: string | number;
  roles?: string[]; // e.g., ["admin", "employee"]
}
