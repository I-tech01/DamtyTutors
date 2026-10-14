import { z } from "zod";

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  tutorName: z.string().min(2, "Display name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  joiningYear: z.coerce.number().min(2000).max(new Date().getFullYear()),
  avatarUrl: z.string().url("Profile picture is required"),
});

// Step 2: Academic Expertise (UPDATED)
export const academicSchema = z.object({
  education: z.string().min(2, "Please state your degree or education level"),
  institution: z.string().min(1, "Please select the institution you graduated from"), // 💡 New
  graduationYear: z.coerce.number().min(1960, "Invalid year").max(new Date().getFullYear() + 5), // 💡 New
  experienceYears: z.coerce.number().min(0, "Experience cannot be negative"), // 💡 New
  subjects: z.array(z.string()).min(1, "Select at least one subject you can tutor"),
  grades: z.array(z.string()), // 💡 Note: Removed .min(1) since grades UI layout was optional/hidden earlier
  bio: z.string().min(30, "Bio should be at least 30 characters long to look professional").max(500),
});

// Step 3: Logistics & Address Details (UPDATED)
export const logisticsSchema = z.object({
  timeZone: z.string().min(1, "Please choose your local timezone"),
  weeklyCapacity: z.coerce.number().min(1, "Minimum 1 hour per week").max(60),
  startDate: z.string().min(1, "Please pick a target start date"), // 💡 New (HTML date format validation)
  
  // 💡 New Address Valuations
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State or region is required"),
  zip: z.string().min(3, "Please enter a valid ZIP/Postal code"),
});

// Combined Schema for the final API submission
export const onboardingSchema = basicInfoSchema.merge(academicSchema).merge(logisticsSchema);
export type OnboardingFormData = z.infer<typeof onboardingSchema>;