"use client";

import React, { useState } from "react";
import CameraComponent from "@/components/CameraComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [document, setDocument] = useState<string | null>(null);

  const handleSelfieCaptured = (image: string) => {
    setSelfie(image);
  };

  const handleDocumentCaptured = (image: string) => {
    setDocument(image);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selfie</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraComponent
              onCapture={handleSelfieCaptured}
              label="Take a Selfie"
            />
            {selfie && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Captured Selfie:</h3>
                <img
                  src={selfie}
                  alt="Selfie"
                  className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSelfie(null)}
                >
                  Clear Selfie
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraComponent
              onCapture={handleDocumentCaptured}
              label="Capture Document"
            />
            {document && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Captured Document:</h3>
                <img
                  src={document}
                  alt="Document"
                  className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setDocument(null)}
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
