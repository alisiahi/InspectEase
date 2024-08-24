// components/RequesterFeedback.tsx
"use client";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface RequesterFeedbackProps {
  missionId: string;
}

const RequesterFeedback = ({ missionId }: RequesterFeedbackProps) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = async () => {
    // TODO: Implement feedback submission logic here
    // For example:
    // const result = await submitFeedback(missionId, feedback);
    // if (result.success) {
    //   toast.success("Feedback submitted successfully");
    //   setFeedback("");
    // } else {
    //   toast.error(result.error || "Failed to submit feedback");
    // }
  };

  const handleApproveMission = async () => {
    // TODO: Implement mission approval logic here
    // For example:
    // const result = await approveMission(missionId);
    // if (result.success) {
    //   toast.success("Mission approved successfully");
    // } else {
    //   toast.error(result.error || "Failed to approve mission");
    // }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handleSubmitFeedback}>
          Submit Feedback
        </Button>
        <Button onClick={handleApproveMission}>Approve Mission</Button>
        <Button variant="destructive">Terminate Mission</Button>
      </div>
    </div>
  );
};

export default RequesterFeedback;
