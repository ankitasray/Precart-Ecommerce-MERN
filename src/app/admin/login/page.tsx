"use client";

import { Button, Checkbox, Input } from "@jamsr-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ Only admin can reach here
      if (res.data.role === "admin") {
        router.push("/admin");
      } else {
        setError("You are not an admin");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-[1280px] flex justify-center items-center pt-5 mt-16">
      <div className="min-w-lg w-[360px]">
        <h1 className="text-xl font-semibold text-center mb-5">
          Admin Login
        </h1>

        <Input
          size="lg"
          variant="standard"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-5">
          <Input
            size="lg"
            variant="standard"
            placeholder="Password"
            isSecuredText
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center my-5">
          <Checkbox label="Remember me" />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <Button
          size="lg"
          color="primary"
          className="w-full mb-5"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </div>
    </div>
  );
}
