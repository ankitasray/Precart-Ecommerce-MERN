"use client";

import { Button, Checkbox, Input } from "@jamsr-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@precart.com";
const ADMIN_PASSWORD = "admin123";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      router.push("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="container mx-auto max-w-[1280px] flex justify-center items-center pt-5 mt-16">
      <div className="min-w-lg">
        <h1 className="text-xl font-semibold text-center mb-5">
          Admin
        </h1>

        <div>
          <Input
            size="lg"
            variant="standard"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

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
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <Button
          size="lg"
          color="primary"
          className="w-full mb-5"
          onClick={handleLogin}
        >
          Log In
        </Button>
      </div>
    </div>
  );
}
