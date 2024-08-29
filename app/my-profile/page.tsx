"use client";

import React, { useState } from "react";
import CaptureImage from "@/components/ui/camera/capture-image";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

const Profile = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing("photoUploader");
  const { userId } = useAuth();

  const handleImageCaptured = (image: string) => {
    setCapturedImage(image);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleUpload = async () => {
    if (capturedImage && userId) {
      const filename = `profile-${userId}.jpg`;
      const file = dataURLtoFile(capturedImage, filename);
      try {
        const res = await startUpload([file]);
        console.log("Upload complete:", res);
        // Handle successful upload (e.g., save URL to user profile)
      } catch (error) {
        console.error("Upload error:", error);
        // Handle upload error
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <CaptureImage onImageCaptured={handleImageCaptured} />
      {capturedImage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Captured Image:</h2>
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-md rounded-lg shadow-lg"
          />
          <Button
            onClick={handleUpload}
            disabled={isUploading || !userId}
            className="mt-2"
          >
            {isUploading ? "Uploading..." : "Upload to Profile"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
