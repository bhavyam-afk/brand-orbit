"use client";

import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { useRouter } from 'next/navigation';

interface SignupCardProps {
  userType: "brand" | "influencer";
}

const SignupCard = ({ userType }: SignupCardProps) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Ensure any existing session is cleared when opening signup page
    signOut({ redirect: false });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, type: userType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // After creating the user, sign them in with credentials to set a fresh session cookie
      const signRes = await signIn('credentials', { redirect: false, email, password });
      if ((signRes as any)?.error) {
        // If signIn failed, still redirect to signup success page or show error
        setError('Signed up but automatic sign-in failed');
        return;
      }

      router.push(`/${userType}/${name}/dashboard`);
      

    } catch (err: any) {
      setError("Signup failed"); 
    }
  }

  return (
    <div className="bg-[#222] rounded-2xl shadow-2xl p-10 w-[400px] max-w-full text-white flex flex-col gap-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Sign Up {userType === "brand" ? "as Brand" : "as Influencer"}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        <input type="text" placeholder="Username" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

        <LiquidButton type="submit" className="mt-4 w-full">Sign Up</LiquidButton>
        {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default SignupCard;