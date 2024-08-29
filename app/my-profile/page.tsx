"use client";

import React, { useState } from "react";
import CameraComponent from "@/components/CameraComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  const [activeCamera, setActiveCamera] = useState<"user" | "environment">(
    "user"
  );

  const handleSelfieCaptured = (image: string | null) => {
    setSelfie(image);
  };

  const handleDocumentCaptured = (image: string | null) => {
    setDocument(image);
  };

  const switchCamera = () => {
    setActiveCamera((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Profile</h1>

      <div className="grid grid-cols-1 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {activeCamera === "user" ? "Selfie" : "Document"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CameraComponent
              onCapture={
                activeCamera === "user"
                  ? handleSelfieCaptured
                  : handleDocumentCaptured
              }
              label={
                activeCamera === "user" ? "Take a Selfie" : "Capture Document"
              }
              facingMode={activeCamera}
            />
            {(activeCamera === "user" ? selfie : document) && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Captured {activeCamera === "user" ? "Selfie" : "Document"}:
                </h3>
                <img
                  src={activeCamera === "user" ? selfie! : document!}
                  alt={activeCamera === "user" ? "Selfie" : "Document"}
                  className="w-full rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    activeCamera === "user"
                      ? setSelfie(null)
                      : setDocument(null)
                  }
                  className="w-full"
                >
                  Clear {activeCamera === "user" ? "Selfie" : "Document"}
                </Button>
              </div>
            )}
            <Button onClick={switchCamera} className="w-full mt-4">
              Switch to {activeCamera === "user" ? "Back" : "Front"} Camera
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
