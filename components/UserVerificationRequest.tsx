import { requestVerification } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserVerificationRequest = ({
  userId,
  verificationStatus,
}: {
  userId: string;
  verificationStatus: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<number | null>(null); // For countdown
  const [showRetry, setShowRetry] = useState(false); // To show retry after timer

  const handleVerificationRequest = async () => {
    setIsLoading(true);
    setTimer(30); // Start countdown from 30 seconds
    setShowRetry(false); // Hide retry button when a new request is sent

    try {
      const result = await requestVerification();
      if (result.success) {
        toast.success("Verification request submitted successfully!");
      } else {
        toast.error(result.error || "Failed to submit verification request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown logic using useEffect
  useEffect(() => {
    if (timer === null || timer <= 0) return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
    }, 1000);

    // Clear interval when timer reaches 0
    if (timer === 0) {
      clearInterval(intervalId);
      setShowRetry(verificationStatus === "PENDING"); // Show retry if status is still pending
    }

    return () => clearInterval(intervalId);
  }, [timer, verificationStatus]);

  return (
    <div>
      {/* Show timer if it's active */}
      {timer !== null && timer > 0 && (
        <p className="mt-4 text-gray-500">Please wait {timer} seconds...</p>
      )}

      {/* If verification status is pending and timer is done, show retry */}
      {showRetry && verificationStatus === "PENDING" && (
        <div className="mt-4">
          <p>Verification is still pending. Try again.</p>
          <Button
            className="mt-6"
            onClick={handleVerificationRequest}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Request Verification Again"}
          </Button>
        </div>
      )}

      {/* Initial verification request button */}
      {!timer && !showRetry && (
        <Button
          className="mt-6"
          onClick={handleVerificationRequest}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Request Verification"}
        </Button>
      )}
    </div>
  );
};

export default UserVerificationRequest;
