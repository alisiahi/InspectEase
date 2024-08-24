import { getUserMissions } from "@/app/actions/actions";
import { RequestCard } from "@/components/RequestCard";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function MyMissions() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getUserMissions();

  if (!result.success) {
    toast.error(`Error loading your missions: ${result.error}`);
    redirect("/");
  }

  const missions = result.data;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Inspection Missions</h1>
      {!missions || missions.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">
              You have not accepted any inspection missions yet.
            </p>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Find available missions
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <RequestCard
              key={mission.id}
              id={mission.inspectionRequest.id}
              location={mission.inspectionRequest.location}
              dateTime={mission.inspectionRequest.dateTime}
              price={mission.inspectionRequest.price}
              requesterName={mission.inspectionRequest.user.fullName}
              position={[
                mission.inspectionRequest.latitude as number,
                mission.inspectionRequest.longitude as number,
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
