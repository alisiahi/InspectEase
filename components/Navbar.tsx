import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "./ui/button";

export function Navbar() {
  const { userId } = auth();
  return (
    <nav className="shadow-md shadow-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                InspectEase
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/request/all"
                className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                All Requests
              </Link>
              <Link
                href="/request/new"
                className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Create a Request
              </Link>
              <Link
                href="/request/my-requests"
                className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                My Requests
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {userId ? (
              <UserButton />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
