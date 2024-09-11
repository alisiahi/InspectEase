"use client";

import { useState, useEffect } from "react";

const PendingVerification = () => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="mt-6 p-4 bg-blue-100 rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-2">
        In case of unsuccessful verification request you can try again after 30
        seconds
      </h2>
      <p className="text-2xl font-bold">
        {countdown > 0 ? countdown : "Time's up!"}
      </p>
    </div>
  );
};

export default PendingVerification;
