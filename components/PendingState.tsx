"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PendingStatus: React.FC = () => {
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.refresh();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification in Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-yellow-600 font-semibold">
          Your verification is in progress. Please wait...
        </p>
        <p className="mt-2">Time remaining: {countdown} seconds</p>
      </CardContent>
    </Card>
  );
};

export default PendingStatus;
