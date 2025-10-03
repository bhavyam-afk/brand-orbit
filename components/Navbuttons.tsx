import React, { useState } from 'react';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';

interface NavbuttonsProps {
  type: "login" | "signup";
}

const Navbuttons = ({ type }: NavbuttonsProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cardType, setCardType] = useState<null | "brand" | "influencer">(null);
  const isLogin = type === "login";

  function handleDropdown(choice: "brand" | "influencer") {
    setCardType(choice);
    setDropdownOpen(false);
  }

  function handleClose() {
    setCardType(null);
  }

  return (
    <>
      <div className="relative">
        <button
          className={
            isLogin
              ? "px-4 py-2 rounded-3xl transition text-white font-semibold shadow hover:bg-[#0f172a]"
              : "px-4 py-2 rounded-3xl border-2 transition text-white font-semibold shadow hover:bg-[#0f172a]"
          }
          onClick={() => setDropdownOpen((open) => !open)}
        >
          {isLogin ? "Login" : "Signup"}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-[#222] rounded-lg shadow-lg z-40">
            <button
              className="block w-full px-6 py-3 text-left text-white hover:bg-blue-700 rounded-t-lg"
              onClick={() => handleDropdown("brand")}
            >
              {isLogin ? "As Brand" : "As Brand"}
            </button>
            <button
              className="block w-full px-6 py-3 text-left text-white hover:bg-purple-700 rounded-b-lg"
              onClick={() => handleDropdown("influencer")}
            >
              {isLogin ? "As Influencer" : "As Influencer"}
            </button>
          </div>
        )}
      </div>
      {cardType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'}}>
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-900"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
            {isLogin ? <LoginCard userType={cardType} /> : <SignupCard userType={cardType} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbuttons;


