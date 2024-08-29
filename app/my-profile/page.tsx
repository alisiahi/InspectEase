"use client";

import React, { useState } from "react";
import CaptureImage from "@/components/ui/camera/capture-image";

const Profile = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCaptured = (image: string) => {
    setCapturedImage(image);
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
        </div>
      )}
    </div>
  );
};

export default Profile;
