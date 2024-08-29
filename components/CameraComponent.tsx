"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      setError(
        `Camera permission denied. Please grant access to your ${
          facingMode === "user" ? "front" : "back"
        } camera.`
      );
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, [facingMode]);

  const capture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      setCapturedImage(imageSrc || null);
      onCapture(imageSrc || null);
      setError(null);
    } catch (e) {
      console.error("Capture error:", e);
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

  const handleUserMediaError = (err: string | DOMException) => {
    console.error("Webcam error:", err);
    const errorMessage = err instanceof DOMException ? err.message : err;
    setError(`Failed to access camera: ${errorMessage}`);
    setHasPermission(false);
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">{label}</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={requestCameraPermission}>
          Request Camera Permission
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">{label}</h2>
      <div className="w-full max-w-md aspect-video relative rounded-lg overflow-hidden shadow-lg">
        {!capturedImage && hasPermission ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            onUserMediaError={handleUserMediaError}
          />
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="captured"
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex justify-center">
        {!capturedImage && hasPermission ? (
          <Button onClick={capture} className="bg-blue-500 hover:bg-blue-600">
            Capture
          </Button>
        ) : capturedImage ? (
          <Button
            onClick={retake}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Retake
          </Button>
        ) : null}
      </div>
      {error && hasPermission === true && (
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
