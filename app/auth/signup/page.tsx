"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignUpPage() {
  const router = useRouter();
  const [values, setValues] = useState<z.infer<typeof schema>>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof values, string>>
  >({});

  const handleChange =
    (field: keyof typeof values) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setValues((prev) => ({ ...prev, [field]: nextValue }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const result = schema.safeParse(values);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors({
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    });
    return;
  }

  setErrors({});

  const { error } = await authClient.signUp.email({
    email: values.email,
    password: values.password,
    name: values.email.split("@")[0],
  });

  if (error) {
    alert(error.message);
    return;
  }

  router.push("/");
  alert("Sign up successful! Please check your email to verify your account.");

  setValues({ email: "", password: "" });
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="flex items-center space-x-2 rounded border px-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange("email")}
              />
            </div>
            {errors.email ? (
              <p className="text-sm text-red-500">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="flex items-center space-x-2 rounded border px-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange("password")}
              />
            </div>
            {errors.password ? (
              <p className="text-sm text-red-500">{errors.password}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}