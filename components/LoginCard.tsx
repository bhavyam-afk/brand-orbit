"use client";

import React, { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

interface LoginCardProps {
  userType: "brand" | "creator";
}

const LoginCard = ({ userType }: LoginCardProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // 1️⃣ Login WITHOUT redirect
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res || res.error) {
      setError("Invalid email or password");
      return;
    }

    // 2️⃣ Fetch session AFTER login
    const session = await getSession();

    if (!session?.user) {
      setError("Unable to fetch session");
      return;
    }

    const { username, role } = session.user as {
      username: string;
      role: "CREATOR" | "BRAND";
    };

    // 3️⃣ Validate role vs login page
    if (
      (userType === "brand" && role !== "BRAND") ||
      (userType === "creator" && role !== "CREATOR")
    ) {
      setError("You are logging in from the wrong portal");
      return;
    }

    // 4️⃣ Redirect dynamically
    const basePath = (role === "BRAND") ? "brand" : "creator";

    router.push(`/${basePath}/${username}/dashboard`);
  }

  return (
    <div className="bg-[#222] rounded-2xl shadow-2xl p-10 w-[400px] max-w-full text-white flex flex-col gap-6">
      <h2 className="text-3xl font-bold mb-2 text-center">
        Login {userType === "brand" ? "as Brand" : "as Creator"}
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <LiquidButton type="submit" className="mt-4 w-full invert">
          Login
        </LiquidButton>

        {error && (
          <div className="text-red-400 text-sm text-center mt-2">
            {error}
          </div>
        )}
      </form>

      <div className="text-sm text-gray-400 text-center">
        Forgot your password?
      </div>

    </div>
  );
};

export default LoginCard;
