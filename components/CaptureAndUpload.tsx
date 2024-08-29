"use client";

import React, { useState } from "react";
import CaptureImage from "@/components/ui/camera/capture-image";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateUserImage } from "@/app/actions/actions";

const CaptureAndUpload = ({
  userId,
  type,
}: {
  userId: string;
  type: "selfie" | "document";
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing("photoUploader");

  const handleImageCaptured = (image: string) => {
    setCapturedImage(image);
    setShowDialog(true);
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
      const randomNumber = Math.floor(Math.random() * 10000);
      const filename = `${userId}-${type}-${randomNumber}.jpg`;
      const file = dataURLtoFile(capturedImage, filename);
      try {
        const res = await startUpload([file]);
        if (res && res[0] && res[0].url) {
          const imageUrl = res[0].url;
          const updateResult = await updateUserImage(imageUrl, type);
          if (updateResult.success) {
            toast.success(
              `The ${type} picture uploaded and saved successfully!`
            );
          } else {
            toast.error(`Failed to save ${type} picture. Please try again.`);
          }
        } else {
          toast.error(`Failed to upload ${type} picture. Please try again.`);
        }
        setCapturedImage(null);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${type} picture. Please try again.`);
      } finally {
        setShowDialog(false);
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center mx-auto p-4 gap-2">
      <CaptureImage onImageCaptured={handleImageCaptured} />
      {capturedImage && (
        <div className="flex items-center justify-center space-x-4">
          <Dialog
            open={showDialog}
            onOpenChange={(open) => setShowDialog(open)}
          >
            <DialogTrigger className="sr-only"></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Upload {type.charAt(0).toUpperCase() + type.slice(1)} Picture
                </DialogTitle>
                <DialogDescription>
                  Review your captured image before uploading.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !userId}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default CaptureAndUpload;
