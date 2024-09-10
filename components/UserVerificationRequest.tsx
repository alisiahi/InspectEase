"use client";

import { requestVerification, revalidateAction } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserVerificationRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0); // Retry counter
  const router = useRouter();

  const handleRevalidate = async () => {
    try {
      await revalidateAction();
      router.refresh(); // Force page refresh after revalidation
    } catch (error) {
      console.error("Revalidation failed:", error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleRevalidate();

      // Retry logic if verification is still not successful
      const interval = setInterval(async () => {
        setRetryCount((prev) => prev + 1);
        await handleRevalidate();

        // Stop polling after 5 retries (or any limit you want)
        if (retryCount >= 5) {
          clearInterval(interval);
        }
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }

    return () => clearTimeout(timer);
  }, [countdown, retryCount, router]);

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
        <p>Verification process ends in {countdown} seconds...</p>
      </div>
    );
  }

  if (countdown === 0) {
    <Button className="mt-6" onClick={revalidateAction}>
      Try again
    </Button>;
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
