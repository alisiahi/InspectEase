"use client";

import React, { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";

interface CameraComponentProps {
  onCapture: (image: string) => void;
  label: string;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onCapture,
  label,
}) => {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);

  const capturePhoto = () => {
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();
      if (typeof imageSrc === "string") {
        setImage(imageSrc);
        onCapture(imageSrc);
      } else {
        // Handle ImageData
        const canvas = document.createElement("canvas");
        canvas.width = imageSrc.width;
        canvas.height = imageSrc.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.putImageData(imageSrc, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setImage(dataUrl);
          onCapture(dataUrl);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      <div className="w-full max-w-md aspect-video relative">
        {!image ? (
          <Camera
            ref={camera}
            aspectRatio={16 / 9}
            errorMessages={{
              noCameraAccessible:
                "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied:
                "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
          />
        ) : (
          <img
            src={image}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <button
        onClick={capturePhoto}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {image ? "Retake" : "Capture"}
      </button>
    </div>
  );
};

export default CameraComponent;
