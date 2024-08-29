"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CameraComponentProps {
  onCapture: (image: string | null) => void;
  label: string;
  facingMode: "user" | "environment";
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onCapture,
  label,
  facingMode,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      setCapturedImage(imageSrc || null);
      onCapture(imageSrc || null);
      setError(null);
    } catch (e) {
      setError("Failed to capture image. Please try again.");
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setCapturedImage(null);
    onCapture(null);
    setError(null);
  };

  const videoConstraints = {
    facingMode: facingMode,
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">{label}</h2>
      <div className="w-full max-w-md aspect-video relative rounded-lg overflow-hidden shadow-lg">
        {!capturedImage ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            onUserMediaError={() =>
              setError(
                "Failed to access camera. Please check your permissions."
              )
            }
          />
        ) : (
          <img
            src={capturedImage}
            alt="captured"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex justify-center">
        {!capturedImage ? (
          <Button onClick={capture} className="bg-blue-500 hover:bg-blue-600">
            Capture
          </Button>
        ) : (
          <Button
            onClick={retake}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Retake
          </Button>
        )}
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CameraComponent;
