"use client";

import { ArrowLeftRight, Check, GalleryVerticalEnd, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraView } from "./camera-view";
import { FC, useRef } from "react";
import { CameraType } from "@/components/ui/camera/camera-types";
import { useCamera } from "@/components/ui/camera/camera-provider";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CameraProps {
  onClosed: () => void;
  onCapturedImages: (images: string[]) => void;
}

const Camera: FC<CameraProps> = ({ onClosed, onCapturedImages }) => {
  const camera = useRef<CameraType>();
  const { images, addImage, numberOfCameras, resetImages, stopStream } =
    useCamera();

  const handleCapture = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (camera.current) {
      const imageData = camera.current.takePhoto();
      if (imageData) {
        addImage(imageData);
      }
    }
  };

  const handleOnClosed = () => {
    stopStream();
    onClosed();
  };
  const handleOnCapturedImages = (images: string[]) => {
    onCapturedImages(images);
    resetImages();
    handleOnClosed();
  };
  return (
    <div className="z-10 flex min-w-[calc(100vw_-_theme(spacing.4))] flex-1 flex-col ">
      <div className="relative w-full">
        {/* Two top  */}
        <div className="absolute z-10 w-full flex justify-between p-4">
          <Button
            className="rounded-full p-4 opacity-40 hover:opacity-100"
            size={"icon"}
            variant={images.length > 0 ? "destructive" : "default"}
            onClick={handleOnClosed}
          >
            <X className="fixed h-6 w-6  " />
          </Button>

          {images.length > 0 && (
            <Button
              className="rounded-full p-4 opacity-40 hover:opacity-100"
              size={"icon"}
              variant={"secondary"}
              onClick={() => {
                handleOnCapturedImages(images);
              }}
            >
              <Check className="fixed h-6 w-6  " />
            </Button>
          )}
        </div>

        <CameraView ref={camera} />

        <div
          className={cn(
            "absolute z-10 w-full flex items-center justify-between"
          )}
        >
          <div className={`${images.length > 0 ? "" : "disabled"}`}>
            <Gallery />
          </div>

          <div className="z-20">
            <Button
              className={cn(
                "h-12 w-12  rounded-full p-8 opacity-40 hover:opacity-100  "
              )}
              size={"icon"}
              variant={"default"}
              onClick={(e) => {
                handleCapture(e);
              }}
            >
              <div className="fixed h-11 w-11 rounded-full bg-primary-foreground group-hover:bg-primary-foreground/60"></div>
            </Button>
          </div>
          {numberOfCameras > 0 && (
            <div className="">
              <SwitchCamera />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SwitchCamera() {
  const { devices, setActiveDeviceId, activeDeviceId, switchCamera } =
    useCamera();

  if (devices.length === 2) {
    return (
      <Button
        variant="default"
        size="icon"
        className="rounded-full p-4 opacity-40 hover:opacity-100"
        onClick={switchCamera}
      >
        <ArrowLeftRight className="fixed h-6 w-6" />
      </Button>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          size={"icon"}
          className=" rounded-full   p-4 opacity-40 hover:opacity-100 "
        >
          <ArrowLeftRight className="fixed h-6 w-6  " />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Camera</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Select
            onValueChange={(value) => {
              setActiveDeviceId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function Gallery() {
  const { images, removeImage } = useCamera();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="rounded-full   p-4 opacity-40 hover:opacity-100 "
          size={"icon"}
          variant={"default"}
        >
          <GalleryVerticalEnd className="fixed h-6 w-6  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{images.length} Photos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-_theme(spacing.16))]">
          <div className="grid grid-cols-2 gap-2  ">
            {images.map((image, index) => (
              <div key={index} className="relative ">
                <img src={image} alt="captured" />
                <Button
                  className="absolute right-2 top-2 h-6 w-6 rounded-full  p-2 opacity-40 hover:opacity-100  "
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() => {
                    removeImage(index);
                  }}
                >
                  <X className="fixed h-4 w-4  " />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default Camera;
