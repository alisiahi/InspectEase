"use client";

import { requestVerification, revalidateAction } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserVerificationRequest = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);

        // Execute revalidateAction when countdown is 29
        if (countdown === 29) {
          revalidateAction({ userId }); // replace "user123" with actual userId
        }

        // Refresh the page when countdown reaches 0
        if (countdown === 0) {
          router.push("/my-profile");
        }
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleVerificationRequest = async () => {
    setIsLoading(true);
    try {
      const result = await requestVerification();
      if (result.success) {
        toast.success("Verification request submitted successfully!");
        setCountdown(30); // Start the countdown from 30
      } else {
        toast.error(result.error || "Failed to submit verification request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return countdown !== null ? (
    <div className="mt-6">
      <p>Verification process ends in {countdown} seconds...</p>
    </div>
  ) : (
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
