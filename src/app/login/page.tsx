"use client";
import { Button, Checkbox, Input } from "@jamsr-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true } // important to send/receive cookies
      );

      console.log(res.data.message);
      setError("");

      // Redirect to dashboard or home after login
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="container mx-auto max-w-[1280px] flex justify-center items-center min-h-screen">
      <div className="min-w-lg">
        <h1 className="text-xl font-semibold text-center mb-5">Log In</h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-5">{error}</p>
        )}

        <div className="mb-5">
          <Input
            size="lg"
            variant="standard"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <Input
            size="lg"
            variant="standard"
            placeholder="Password"
            isSecuredText
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mb-5">
          <Checkbox
            label="Remember me"
            isChecked={rememberMe}
            onCheckedChange={(val) => setRememberMe(val)}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          size="lg"
          color="primary"
          className="w-full mb-5"
          onClick={handleLogin}
        >
          Log In
        </Button>

        <Button
          size="lg"
          variant="outlined"
          className="w-full"
          onClick={() => router.push("/registration")}
        >
          Create account
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
