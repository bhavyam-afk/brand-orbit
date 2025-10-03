"use client";

import React, { useState } from "react";
import { getUserByEmailAndPassword } from "../db/signup";
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
      const user = await getUserByEmailAndPassword(email, password, userType);
      if (!user || !user.username) {
        setError("Invalid credentials or user not found");
        return;
      }
      router.push(`/${user.username}/profile`);
    } catch (err) {
      setError("Login failed. Try again.");
    }
  }

  return (
    <div className="bg-[#222] rounded-2xl shadow-2xl p-10 w-[400px] max-w-full text-white flex flex-col gap-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Login {userType === "brand" ? "as Brand" : "as Influencer"}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="mt-4 px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 transition text-white font-semibold shadow">Login</button>
        {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
      </form>
      <div className="text-sm text-gray-400 text-center">Forgot your password?</div>
    </div>
  );
};

export default LoginCard;
