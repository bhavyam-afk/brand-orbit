"use client";
import React from "react";
import { useRouter } from 'next/navigation';
interface LoginCardProps {
  userType: "brand" | "influencer";
}

const LoginCard = ({ userType }: LoginCardProps) => {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Add actual login logic here
    if (userType === 'brand') {
      router.push('/brand/profile');
    } else {
      router.push('/influencer/profile');
    }
  }

  return (
    <div className="bg-[#222] rounded-2xl shadow-2xl p-10 w-[400px] max-w-full text-white flex flex-col gap-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Login {userType === "brand" ? "as Brand" : "as Influencer"}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none" required />
        <input type="password" placeholder="Password" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none" required />
        <button type="submit" className="mt-4 px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 transition text-white font-semibold shadow">Login</button>
      </form>
      <div className="text-sm text-gray-400 text-center">Forgot your password?</div>
    </div>
  );
};

export default LoginCard;
