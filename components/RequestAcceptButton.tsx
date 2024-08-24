"use client";

import { acceptInspectionRequest } from "@/app/actions/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";

const RequestAcceptButton = ({ requestId }: { requestId: string }) => {
  const handleAcceptRequest = async () => {
    const result = await acceptInspectionRequest(requestId);
    if (result.success) {
      toast.success("Inspection request accepted successfully");
      // Optionally, you can redirect the user or update the UI
    } else {
      toast.error(result.error || "Failed to accept inspection request");
    }
  };
  return (
    <Button variant="default" onClick={handleAcceptRequest}>
      Accept request
    </Button>
  );
};

export default RequestAcceptButton;
