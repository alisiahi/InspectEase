"use client";

import React, { useState } from "react";
import Camera from "@/components/ui/camera/camera";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { UploadIcon, CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function Inventory() {
  const [showDialog, setShowDialog] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">Add product image</h3>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Dialog
              open={showDialog}
              onOpenChange={(open) => setShowDialog(open)}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CameraIcon className="mr-2 h-5 w-5" />
                  Capture Photo
                  <span className="sr-only">Capture</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="h-svh w-svw max-w-full p-0">
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
        </div>
      </div>
    </main>
  );
}

export default Inventory;
