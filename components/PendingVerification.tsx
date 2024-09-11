"use client";

import {
  checkingStatusDuringTimer,
  TryAgainVerification,
} from "@/app/actions/actions";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const PendingVerification = ({ userId }: { userId: string }) => {
  const [countdown, setCountdown] = useState(30);

  async function handleTryAgainButton() {
    await TryAgainVerification({ userId });
  }

  async function checkStatus() {
    await checkingStatusDuringTimer();
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      if (countdown % 5 === 0) {
        checkStatus();
      }
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="mt-6 p-4 rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-2">
        In case of unsuccessful verification request you can try again after 30
        seconds
      </h2>
      <p className="text-2xl font-bold">
        {countdown > 0 ? (
          countdown
        ) : (
          <Button onClick={handleTryAgainButton}>Try again</Button>
        )}
      </p>
    </div>
  );
};

export default PendingVerification;
