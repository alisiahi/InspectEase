"use client";

import React, { useState } from "react";
import Camera from "@/components/ui/camera/camera";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadIcon, CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function CaptureImage() {
  const [showDialog, setShowDialog] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  return (
    <>
      <div className="flex items-center justify-center space-x-4">
        <Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <CameraIcon className="mr-2 h-5 w-5" />
              Capture Photo
              <span className="sr-only">Capture</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="h-svh w-svw max-w-full p-0">
            <DialogTitle className="sr-only">Capture Photo</DialogTitle>
            <DialogDescription className="sr-only">
              Description
            </DialogDescription>

            <Camera
              onClosed={() => {
                setShowDialog(false);
              }}
              onCapturedImages={(images) => {
                setCapturedImages(images);
                setShowDialog(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Display captured images */}
      {capturedImages.length > 0 && (
        <img src={capturedImages[0]} alt="captured image" />
      )}
    </>
  );
}

export default CaptureImage;
