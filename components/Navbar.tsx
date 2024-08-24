import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import { MobileMenu } from "./MobileMenu";

const NavLinks = () => (
  <>
    <Link
      href="/request/new"
      className="border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    >
      New Request
    </Link>
    <Link
      href="/request/my-requests"
      className="border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    >
      My Requests
    </Link>
    <Link
      href="/my-missions"
      className="border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    >
      My Missions
    </Link>
  </>
);

export function Navbar() {
  const { userId } = auth();

  return (
    <nav className="shadow-md shadow-primary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                InspectEase
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLinks />
            </div>
          </div>
          <div className="sm:ml-6 flex items-center justify-center gap-2">
            {userId ? (
              <UserButton />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            )}
            <ModeToggle />
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
