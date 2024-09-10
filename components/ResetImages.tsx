"use client";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { requestResetImages } from "@/app/actions/actions";

const ResetImages = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificationRequest = async () => {
    setIsLoading(true);
    try {
      const result = await requestResetImages();
      if (result.success) {
        toast.success(
          "Your images are deleted. You can now take images to request for verfication."
        );
      } else {
        toast.error(result.error || "Failed to rest images. Please try again.");
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
      {isLoading ? "Processing..." : "Reset you images"}
    </Button>
  );
};

export default ResetImages;
