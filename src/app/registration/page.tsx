"use client";

import { Button, Checkbox, Input, Radio, RadioGroup } from "@jamsr-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormState = {
  name: string; // ✅ added
  email: string;
  password: string;
  dob: string;
  gender: "male" | "female" | "other";
  subscribe: boolean;
  terms: boolean;
};

const Page = () => {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "", // ✅ added
    email: "",
    password: "",
    dob: "",
    gender: "male",
    subscribe: false,
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.terms) {
      setError("You must accept Terms and Conditions");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: form.name.trim(), // ✅ sent to backend
          email: form.email.trim(),
          password: form.password,
          dob: form.dob, // yyyy-mm-dd
          gender: form.gender,
          subscribe: form.subscribe,
        },
        { withCredentials: true }
      );

      router.push("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-[1280px] flex justify-center items-center">
      <div className="min-w-lg max-w-lg">
        <h1 className="text-xl font-semibold text-center mb-5">
          Create an account
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Name */}
        <div className="mb-5">
          <Input
            size="lg"
            variant="standard"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <Input
            size="lg"
            variant="standard"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <Input
            size="lg"
            variant="standard"
            placeholder="Password"
            isSecuredText
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        {/* DOB */}
        <div className="mb-5 p-2 border-b border-neutral-500">
          <Input
            type="date"
            size="lg"
            variant="standard"
            label="Date of birth"
            value={form.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="mb-5 p-2 border-b border-neutral-500">
          <RadioGroup
            label="Gender"
            value={form.gender}
            onChange={(e) =>
              handleChange(
                "gender",
                (e.target as HTMLInputElement)
                  .value as FormState["gender"]
              )
            }
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </RadioGroup>
        </div>

        {/* Subscribe */}
        <div className="mb-5 p-2 border-b border-neutral-500">
          <Checkbox
            isChecked={form.subscribe}
            onCheckedChange={(value) =>
              handleChange("subscribe", Boolean(value))
            }
            label="Email me with news and offers"
          />
        </div>

        {/* Terms */}
        <div className="mb-5 p-2 border-b border-neutral-500">
          <Checkbox
            isChecked={form.terms}
            onCheckedChange={(value) =>
              handleChange("terms", Boolean(value))
            }
            label="I accept the Terms and Conditions"
          />
        </div>

        {/* Submit */}
        <Button
          size="lg"
          color="primary"
          className="w-full mb-5"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-sm text-neutral-500 text-center">
          Already have an account?
          <Link
            href="/login"
            className="ml-1 hover:text-blue-400 underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
