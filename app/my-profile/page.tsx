"use client";

import React, { useState } from "react";
import CameraComponent from "@/components/CameraComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [document, setDocument] = useState<string | null>(null);

  const handleSelfieCaptured = (image: string | null) => {
    setSelfie(image);
  };

  const handleDocumentCaptured = (image: string | null) => {
    setDocument(image);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Selfie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CameraComponent
              onCapture={handleSelfieCaptured}
              label="Take a Selfie"
              facingMode="user"
            />
            {selfie && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Captured Selfie:</h3>
                <img
                  src={selfie}
                  alt="Selfie"
                  className="w-full rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  onClick={() => setSelfie(null)}
                  className="w-full"
                >
                  Clear Selfie
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CameraComponent
              onCapture={handleDocumentCaptured}
              label="Capture Document"
              facingMode="environment"
            />
            {document && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Captured Document:</h3>
                <img
                  src={document}
                  alt="Document"
                  className="w-full rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  onClick={() => setDocument(null)}
                  className="w-full"
                >
                  Clear Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
