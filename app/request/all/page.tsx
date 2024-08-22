// app/requests/page.tsx

import { getAllRequests } from "@/app/actions/requestActions";
import { RequestCard } from "@/components/RequestCard";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default async function AllRequests() {
  const result = await getAllRequests();

  if (!result.success) {
    toast.error(`Error loading requests: ${result.error}`);
    redirect("/");
  }

  const requests = result.data;

  if (requests?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Inspection Requests</h1>
          <p className="text-gray-600">
            There are currently no inspection requests available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Inspection Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests?.map((request) => (
          <RequestCard
            key={request.id}
            id={request.id}
            location={request.location}
            dateTime={request.dateTime}
            price={request.price}
            requesterName={request.user.fullName}
          />
        ))}
      </div>
    </div>
  );
}
