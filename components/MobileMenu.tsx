// MobileMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const NavLinks = ({ onClose }: { onClose: () => void }) => (
  <>
    <SheetClose asChild>
      <Link
        href="/request/all"
        className="border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium w-full"
        onClick={onClose}
      >
        All Requests
      </Link>
    </SheetClose>
    <SheetClose asChild>
      <Link
        href="/request/new"
        className="border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium w-full"
        onClick={onClose}
      >
        Create a Request
      </Link>
    </SheetClose>
    <SheetClose asChild>
      <Link
        href="/request/my-requests"
        className="border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium w-full"
        onClick={onClose}
      >
        My Requests
      </Link>
    </SheetClose>
  </>
);

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="z-[1000]">
        <SheetTitle>Navigation Menu</SheetTitle>
        <nav className="flex flex-col space-y-4 mt-4">
          <NavLinks onClose={handleClose} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
