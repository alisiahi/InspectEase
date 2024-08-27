"use client";

import { useState, useRef } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VerficationForms = () => {
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [currentUploadType, setCurrentUploadType] = useState<
    "passport" | "selfie" | null
  >(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentUploadType === "selfie" ? "user" : "environment",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${currentUploadType}-capture.jpg`, {
            type: "image/jpeg",
          });
          setCapturedImage(file);
        }
      }, "image/jpeg");

      // Stop the camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const renderCameraOrUpload = (uploadType: "passport" | "selfie") => {
    if (currentUploadType === uploadType) {
      return (
        <>
          <video ref={videoRef} className="w-full mb-2" />
          <Button className="w-full mb-2" onClick={captureImage}>
            Capture Image
          </Button>
          <Button className="w-full" onClick={() => setCurrentUploadType(null)}>
            Cancel
          </Button>
        </>
      );
    } else if (capturedImage && currentUploadType === null) {
      return (
        <UploadButton
          endpoint={
            uploadType === "passport"
              ? "passportOrIdPhotoUploader"
              : "selfiePhotoUploader"
          }
          onClientUploadComplete={(res) => {
            console.log(`${uploadType} upload complete:`, res);
            setCapturedImage(null);
          }}
          onUploadError={(error: Error) => {
            console.error("Upload failed:", error.message);
          }}
          content={{
            button({ ready }) {
              return ready ? "Upload captured image" : "Preparing...";
            },
          }}
        />
      );
    } else {
      return (
        <Button
          className="w-full"
          onClick={() => {
            setCurrentUploadType(uploadType);
            startCamera();
          }}
        >
          Capture {uploadType === "passport" ? "Passport/ID" : "Selfie"}
        </Button>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your Documents</h1>

      <Card className="mb-4 w-full max-w-md">
        <CardHeader>
          <CardTitle>Passport/ID Upload</CardTitle>
        </CardHeader>
        <CardContent>{renderCameraOrUpload("passport")}</CardContent>
      </Card>

      <Card className="mb-4 w-full max-w-md">
        <CardHeader>
          <CardTitle>Selfie Upload</CardTitle>
        </CardHeader>
        <CardContent>{renderCameraOrUpload("selfie")}</CardContent>
      </Card>
    </div>
  );
};

export default VerficationForms;
