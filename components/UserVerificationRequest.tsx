"use client";

import { requestVerification } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserVerificationRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      router.push("/my-profile");
    }
    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleVerificationRequest = async () => {
    setIsLoading(true);
    try {
      const result = await requestVerification();
      if (result.success) {
        toast.success(
          "Verification request submitted successfully! Please wait while we process your request."
        );
        setCountdown(30); // Start the countdown
      } else {
        toast.error(
          result.error ||
            "Failed to submit verification request. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (countdown !== null) {
    return (
      <div className="mt-6">
        <p>Refreshing in {countdown} seconds...</p>
      </div>
    );
  }

  return (
    <Button
      className="mt-6"
      onClick={handleVerificationRequest}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Request Verification"}
    </Button>
  );
};

export default UserVerificationRequest;
