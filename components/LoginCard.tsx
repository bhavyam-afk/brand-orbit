"use client";

import React, { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { useRouter } from 'next/navigation';

interface LoginCardProps {
  userType: "brand" | "influencer";
}

const LoginCard = ({ userType }: LoginCardProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type: userType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
  router.push(`/${userType}/${data.user.name}/dashboard`);
    } catch (err: any) {
      setError("Login failed. Try again.");
    }
  }

  return (
    <div className="bg-[#222] rounded-2xl shadow-2xl p-10 w-[400px] max-w-full text-white flex flex-col gap-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Login {userType === "brand" ? "as Brand" : "as Influencer"}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        <input type="email" placeholder="Email" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={password} onChange={e => setPassword(e.target.value)} required />

  <LiquidButton type="submit" className="mt-4 w-full">Login</LiquidButton>
        {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
        
      </form>
      <div className="text-sm text-gray-400 text-center">Forgot your password?</div>
    </div>
  );
};

export default LoginCard;