import { getInspectionRequest } from "@/app/actions/actions";
import { RequestDeleteButton } from "@/components/RequestDeleteButton";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import dynamic from "next/dynamic";

import { Separator } from "@/components/ui/separator";
import InspectorDetails from "@/components/InspectorDetails";
import RequesterFeedback from "@/components/RequesterFeedback";
import RequestAcceptButton from "@/components/RequestAcceptButton";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default async function RequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  const { userId } = auth();
  const result = await getInspectionRequest(params.requestId);

  if (!result.success || !result.data) {
    console.log(result.error || "Inspection request not found");
    redirect("/");
  }

  const request = result.data;

  return (
    <div className="max-w-4xl mx-auto p-4 mb-20">
      <h1 className="text-3xl font-bold my-6">Inspection Request Details</h1>
      <div className="shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
        <div>
          <h2 className="text-xl font-semibold mb-2">Location on Map</h2>
          <Map
            initialPosition={[
              request.latitude ?? 51.505, // Default to London latitude
              request.longitude ?? -0.09, // Default to London longitude
            ]}
            markers={[
              [
                request.latitude ?? 51.505, // Default to London latitude
                request.longitude ?? -0.09, // Default to London longitude
              ],
            ]}
            showCurrentLocationMarker={false}
          />
        </div>

        <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-700">{request.location}</p>
        </div>
        <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Date & Time</h2>
          <p className="text-gray-700">
            {new Date(request.dateTime).toLocaleString()}
          </p>
        </div>
        <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Price</h2>
          <p className="text-gray-700">${request.price.toFixed(2)}</p>
        </div>
        <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Requested by</h2>
          <p className="text-gray-700">{request.user.fullName}</p>
        </div>
        <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Contact Email</h2>
          <p className="text-gray-700">{request.user.email}</p>
        </div>

        {userId && userId === request.userId && !request?.mission?.id ? (
          <div className="mt-6 flex gap-2">
            <Button variant="default" asChild>
              <Link href={`/request/${request.id}/edit`}>Edit request</Link>
            </Button>
            <RequestDeleteButton requestId={request.id} />
          </div>
        ) : (
          <div className="flex items-center justify-center border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              When your request is on mission, you can not delete or edit it!
            </h2>
          </div>
        )}

        {userId && userId !== request.userId && !request?.mission?.id && (
          <div className="mt-6 flex gap-2">
            <RequestAcceptButton requestId={request.id} />
          </div>
        )}
      </div>
      {/* Inspector details and area for uploading pictures */}
      {userId &&
        request.mission &&
        (userId === request.userId || request.mission?.inspectorId) && (
          <>
            <Separator className="my-10" />
            <h1 className="text-3xl font-bold mb-6">
              Inspection Mission Details
            </h1>
            <div className="shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
              <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
                <InspectorDetails
                  inspector={request.mission?.inspector}
                  missionStatus={request.mission?.status}
                  missionId={request.mission?.id}
                />
              </div>
            </div>
          </>
        )}
      {/* Requester details and area for feedback and approving mission */}
      {userId && request.mission && userId === request.userId && (
        <>
          <Separator className="my-10" />
          <h1 className="text-3xl font-bold mb-6">
            Mission Approval and Feedback
          </h1>
          <div className="shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
            <div className="border-[1px] border-primary/40 border-dashed p-2 rounded-lg">
              <RequesterFeedback missionId={request.mission?.id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
