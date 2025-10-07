"use client";

import React from "react";

const NUM_STARS = 80;

function getStars() {
  return Array.from({ length: NUM_STARS }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 2 + 1}px`,
    height: `${Math.random() * 2 + 1}px`,
    boxShadow: `0 0 8px 2px #fff`,
    key: i,
  }));
}

const Starfield = () => {
  const [stars] = React.useState(getStars());
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.key}
          className="absolute rounded-full bg-white opacity-30"
          style={star}
        />
      ))}
    </div>
  );
};

export default Starfield;
