import React from "react";

interface SignupCardProps {
  userType: "brand" | "influencer";
}

const SignupCard = ({ userType }: SignupCardProps) => {
  return (
    <div className="bg-[#222] rounded-2xl shadow-2xl p-10 w-[400px] max-w-full text-white flex flex-col gap-6">
  <h2 className="text-3xl font-bold mb-2 text-center">Sign Up {userType === "brand" ? "as Brand" : "as Influencer"}</h2>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Full Name" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none" required />
        <input type="email" placeholder="Email" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none" required />
        <input type="password" placeholder="Password" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none" required />
        <input type="password" placeholder="Confirm Password" className="px-4 py-3 rounded bg-gray-800 text-white focus:outline-none" required />
        <button type="submit" className="mt-4 px-4 py-2 rounded bg-purple-700 hover:bg-purple-600 transition text-white font-semibold shadow">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupCard;
