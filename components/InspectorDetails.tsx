// components/InspectorDetails.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface InspectorDetailsProps {
  inspector: {
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  missionStatus: string;
  missionId: string;
}

const InspectorDetails = ({
  inspector,
  missionStatus,
  missionId,
}: InspectorDetailsProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // TODO: Implement file upload logic here
    // For example:
    // const result = await uploadInspectionPhoto(missionId, selectedFile);
    // if (result.success) {
    //   toast.success("Photo uploaded successfully");
    //   setSelectedFile(null);
    // } else {
    //   toast.error(result.error || "Failed to upload photo");
    // }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={inspector.avatarUrl || undefined} />
          <AvatarFallback>{inspector.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{inspector.fullName}</h3>
          <p className="text-sm text-gray-500">{inspector.email}</p>
        </div>
      </div>

      <div>
        <p>
          <span>Mission Status: </span>
          <Badge className="bg-yellow-600 hover:bg-yellow-500">
            {missionStatus}
          </Badge>
        </p>
      </div>
      <div className="flex gap-2">
        <Badge className="cursor-pointer">Start Mission</Badge>
        <Badge className="cursor-pointer bg-red-600 hover:bg-red-500">
          Terminate Mission
        </Badge>
      </div>

      <div className="space-y-2">
        <Input type="file" onChange={handleFileChange} accept="image/*" />
        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload Photo
        </Button>
      </div>
    </div>
  );
};

export default InspectorDetails;
