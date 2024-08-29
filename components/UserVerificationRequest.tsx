"use client";

import { requestVerification } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";

const UserVerificationRequest = () => {
  const handleVerificationRequest = async () => {
    const result = await requestVerification();
    if (result.success) {
      toast.success("Verification request submitted successfully!");
      // Optionally, you can re-fetch user data here if needed
    } else {
      toast.error("Failed to submit verification request. Please try again.");
    }
  };
  return (
    <Button className="mt-6" onClick={handleVerificationRequest}>
      Request Verification
    </Button>
  );
};

export default UserVerificationRequest;
