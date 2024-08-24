// app/request/my-requests/page.tsx

import { getUserRequests } from "@/app/actions/requestActions";
import { RequestCard } from "@/components/RequestCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function MyRequests() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getUserRequests();

  if (!result.success) {
    toast.error(`Error loading your requests: ${result.error}`);
    redirect("/");
  }

  const requests = result.data;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Inspection Requests</h1>
      {!requests || requests.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">
              You have not created any inspection requests yet.
            </p>
            <a
              href="/request/new"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Create your first request
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              id={request.id}
              location={request.location}
              dateTime={request.dateTime}
              price={request.price}
              requesterName="You"
              position={[
                request.latitude as number,
                request.longitude as number,
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
