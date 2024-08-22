import { getInspectionRequest } from "@/app/actions/requestActions";
import { RequestDeleteButton } from "@/components/RequestDeleteButton";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function RequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  const { userId } = auth();
  const result = await getInspectionRequest(params.requestId);

  if (!result.success || !result.data) {
    toast.error(result.error || "Inspection request not found");
    redirect("/");
  }

  const request = result.data;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Inspection Request Details</h1>
      <div className="shadow-md rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-700">{request.location}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Date & Time</h2>
          <p className="text-gray-700">
            {new Date(request.dateTime).toLocaleString()}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Price</h2>
          <p className="text-gray-700">${request.price.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Requested by</h2>
          <p className="text-gray-700">{request.user.fullName}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Email</h2>
          <p className="text-gray-700">{request.user.email}</p>
        </div>
      </div>
      {userId && userId === request.userId && (
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/request/edit/${request.id}`}>Edit request</Link>
          </Button>
          <RequestDeleteButton requestId={request.id} />
        </div>
      )}
    </div>
  );
}
