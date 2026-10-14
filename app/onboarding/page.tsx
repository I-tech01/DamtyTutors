"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  GraduationCap,
  Clock,
} from "lucide-react";
import {
  onboardingSchema,
  basicInfoSchema,
  academicSchema,
  logisticsSchema,
  type OnboardingFormData,
} from "@/types/onboarding";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null); // 💡 Tracks the active user account details

  // 💡 Pull active authentication session info client-side on mount
  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setSession(data);
        }
      }
    }
    fetchSession();
  }, []);

  const [formData, setFormData] = useState<OnboardingFormData>({
    tutorName: "",
    phoneNumber: "",
    joiningYear: new Date().getFullYear(),
    avatarUrl: "",
    education: "",
    subjects: [],
    grades: [],
    bio: "",
    timeZone: "GMT+1",
    weeklyCapacity: 10,
    institution: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    graduationYear: new Date().getFullYear(),
    startDate: new Date().toISOString().slice(0, 10),
    experienceYears: 0,
  } as OnboardingFormData);

  const [errors, setErrors] = useState<
    Partial<
      Record<
        | keyof OnboardingFormData
        | "institution"
        | "street"
        | "city"
        | "state"
        | "zip",
        { message: string }
      >
    >
  >({});

  type RegisteredField =
    | keyof OnboardingFormData
    | "institution"
    | "street"
    | "city"
    | "state"
    | "zip"
    | "graduationYear"
    | "experienceYears";

  const register = (field: RegisteredField) => ({
    name: field,
    value: String(
      (formData as OnboardingFormData & Record<string, unknown>)[field] ?? "",
    ),
    onChange: (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const rawValue = event.target.value;
      const numericFields: RegisteredField[] = [
        "joiningYear",
        "weeklyCapacity",
        "graduationYear",
        "experienceYears",
      ];
      const value = numericFields.includes(field) ? Number(rawValue) : rawValue;
      setFormData(
        (previous) => ({ ...previous, [field]: value }) as OnboardingFormData,
      );
    },
  });

  const validate = (
    schema:
      | typeof onboardingSchema
      | typeof basicInfoSchema
      | typeof academicSchema
      | typeof logisticsSchema,
    fields?: (keyof OnboardingFormData)[],
  ) => {
    const result = schema.safeParse(formData);
    const nextErrors: typeof errors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof OnboardingFormData;
        if ((!fields || fields.includes(field)) && !nextErrors[field]) {
          nextErrors[field] = { message: issue.message };
        }
      }
    }
    setErrors((previous) => {
      const updated = { ...previous };
      (
        fields ?? (Object.keys(formData) as (keyof OnboardingFormData)[])
      ).forEach((field) => delete updated[field]);
      return { ...updated, ...nextErrors };
    });
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit =
    (callback: (data: OnboardingFormData) => Promise<void>) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (validate(onboardingSchema)) await callback(formData);
    };

  const selectedSubjects = formData.subjects || [];
  const selectedGrades = formData.grades || [];

  const handleCheckboxArrayToggle = (
    fieldName: "subjects" | "grades",
    value: string,
  ) => {
    setFormData((previous) => {
      const currentArray = previous[fieldName];
      return {
        ...previous,
        [fieldName]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleNext = async () => {
    let schema:
      | typeof basicInfoSchema
      | typeof academicSchema
      | typeof logisticsSchema = basicInfoSchema;
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];
    if (currentStep === 1) {
      schema = basicInfoSchema;
      fieldsToValidate = [
        "tutorName",
        "phoneNumber",
        "joiningYear",
        "avatarUrl",
      ];
    } else if (currentStep === 2) {
      schema = academicSchema;
      fieldsToValidate = ["education", "subjects", "grades", "bio"];
    } else if (currentStep === 3) {
      schema = logisticsSchema;
      fieldsToValidate = ["timeZone", "weeklyCapacity"];
    }
    if (!schema) return;
    const isStepValid = validate(schema, fieldsToValidate);
    if (isStepValid) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);

    // Find active account identity ID across standard authentication session token schemas
    const activeUserId = session?.user?._id || session?.user?.id;

    try {
      const structuredPayload = {
       userId: session?.user?._id || session?.user?.id || session?.user?.tutorId, 
        name: data.tutorName,
        profilePictureUrl: data.avatarUrl,
        timeZone: data.timeZone,
        weeklyCapacity: data.weeklyCapacity,
        yearJoined: data.joiningYear,
        startDate: data.startDate,
        experienceYears: data.experienceYears,
        bio: data.bio,
        contactInfo: {
          phone: data.phoneNumber,
        },
        education: {
          degree: data.education,
          institution: (data as any).institution,
          graduationYear: (data as any).graduationYear,
        },
        address: {
          street: (data as any).street,
          city: (data as any).city,
          state: (data as any).state,
          zip: (data as any).zip,
        },
        subjects: data.subjects,
        grades: data.grades,
      };

      const response = await fetch("/api/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(structuredPayload),
      });

      if (response.ok) {
        // Redirect right onto the current active User Account ID to match your dynamic pipeline lookup criteria
        if (activeUserId) {
          window.location.href = `/profile/${activeUserId}`;
        } else {
          const result = await response.json();
          window.location.href = `/profile/${result._id}`;
        }
      } else {
        alert("Failed to save profile details.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
      {/* Visual Step Progress Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
        {[
          { label: "Identity", icon: User },
          { label: "Expertise", icon: GraduationCap },
          { label: "Logistics", icon: Clock },
        ].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          const Icon = step.icon;

          return (
            <div key={step.label} className="flex items-center space-x-2">
              <div
                className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                    : isDone
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-sm font-medium ${isActive ? "text-gray-900 font-semibold" : "text-gray-400"}`}
              >
                {step.label}
              </span>
              {idx < 2 && (
                <div className="h-0.5 w-12 bg-gray-100 mx-2 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Core Multi-step Form Panels */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* PANEL 1: IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800">
              Basic Workspace Identity
            </h2>
            <p className="text-sm text-gray-500">
              Configure your professional presentation profile metrics.
            </p>
            {/* 2. ADD THE UPLOADTHING COMPONENT HERE */}
            <div className="p-4 border border-dashed border-gray-200 rounded-lg flex flex-col items-center space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Profile Picture
              </label>

              {formData.avatarUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={formData.avatarUrl}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ Image uploaded successfully!
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, avatarUrl: "" }))
                    }
                    className="text-xs text-rose-500 underline"
                  >
                    Remove and change
                  </button>
                </div>
              ) : (
                <UploadButton<OurFileRouter, "profilePicture">
                  endpoint="profilePicture" // This matches your key in core.ts
                  onClientUploadComplete={(res: { url: string }[]) => {
                    // Get the secure file URL from the first uploaded item
                    const uploadedUrl = res[0].url;
                    setFormData((prev) => ({
                      ...prev,
                      avatarUrl: uploadedUrl,
                    }));
                    alert("Upload Completed!");
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg px-4 py-2 transition-all",
                  }}
                />
              )}
              {errors.avatarUrl && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tutor Name
              </label>
              <input
                {...register("tutorName")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Tutor Dave"
              />
              {errors.tutorName && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.tutorName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="+234..."
              />
              {errors.phoneNumber && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Year Joined Organization
              </label>
              <input
                type="number"
                {...register("joiningYear")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.joiningYear && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.joiningYear.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* PANEL 2: ACADEMIC EXPERTISE */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Academic & Teaching Background
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Highest Degree / Education Level
              </label>
              <input
                {...register("education")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., BSc in Pure Mathematics"
              />
              {errors.education && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Institution
              </label>
              <input
                {...register("institution")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., University of Lagos"
              />
              {errors.institution && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.institution.message}
                </p>
              )}
            </div>

            {/* Target Subjects Select Array */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subjects Qualified to Teach
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Algebra",
                  "Geometry",
                  "Calculus",
                  "SAT Prep",
                  "English Lit",
                  "Physics",
                  "Mathematics",
                  "Chemistry",
                  "Biology",
                  "Computer Science",
                  "History",
                  "Geography",
                  "Economics",
                  "Psychology",
                ].map((subject) => (
                  <button
                    type="button"
                    key={subject}
                    onClick={() =>
                      handleCheckboxArrayToggle("subjects", subject)
                    }
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      selectedSubjects.includes(subject)
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              {errors.subjects && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.subjects.message}
                </p>
              )}
            </div>
            {/* Target Grades Select Array */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Grades / Levels
              </label>
              <div className="flex flex-wrap gap-2">
                {["Senior Secondary", "Undergraduate", "Postgraduate"].map(
                  (grade) => (
                    <button
                      type="button"
                      key={grade}
                      onClick={() => handleCheckboxArrayToggle("grades", grade)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        selectedGrades.includes(grade)
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {grade}
                    </button>
                  ),
                )}
              </div>
              {errors.grades && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.grades.message}
                </p>
              )}
            </div>
            {/* 💡 NEW: Graduation Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Year of Graduation
              </label>
              <input
                type="number"
                {...register("graduationYear")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* 💡 NEW: Experience Years */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Years of Teaching Experience
              </label>
              <input
                type="number"
                {...register("experienceYears")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Professional Bio
              </label>
              <textarea
                {...register("bio")}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Describe your teaching methodologies..."
              />
              {errors.bio && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* PANEL 3: LOGISTICS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Operations & Capacities
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Primary Working Time Zone
              </label>
              <select
                {...register("timeZone")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="GMT+1">West Africa Time (GMT+1)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="EST">Eastern Time (EST)</option>
              </select>
              {errors.timeZone && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.timeZone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Target Hours Cap Per Week
              </label>
              <input
                type="number"
                {...register("weeklyCapacity")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.weeklyCapacity && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.weeklyCapacity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Street Address
              </label>
              <input
                {...register("street")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., 123 Main Street"
              />
              {errors.street && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.street.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                City
              </label>
              <input
                {...register("city")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., Lagos"
              />
              {errors.city && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                State
              </label>
              <input
                {...register("state")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., Lagos"
              />
              {errors.state && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                {...register("zip")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., 100001"
              />
              {errors.zip && (
                <p className="text-xs text-rose-500 mt=1">
                  {errors.zip.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Controls Navigation Row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <span>{isSubmitting ? "Saving..." : "Submit Registration"}</span>
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
