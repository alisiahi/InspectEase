"use client";

import { requestVerification } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const UserVerificationRequest = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerificationRequest = async () => {
    setIsLoading(true);
    try {
      const result = await requestVerification();
      if (result.success) {
        toast.success("Verification request submitted successfully!");
        router.push("/my-profile"); // Redirect to /my-profile after successful request
      } else {
        toast.error(result.error || "Failed to submit verification request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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
