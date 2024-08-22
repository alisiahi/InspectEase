// app/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { Navbar } from "@/components/Navbar";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-semibold text-indigo-600 mb-4">
                Welcome to InspectEase
              </h1>
              {user ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    Logged in as:{" "}
                    <span className="font-medium">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    User ID: <span className="font-medium">{user.id}</span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  Please sign in to access all features.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
