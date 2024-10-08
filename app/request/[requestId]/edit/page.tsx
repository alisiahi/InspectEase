import { getInspectionRequest } from "@/app/actions/actions";
import { InspectionRequestForm } from "@/components/forms/RequestForm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const EditRequest = async ({ params }: { params: { requestId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getInspectionRequest(params.requestId);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const request = result.data;

  // Check if the current user is the owner of the request
  if (request.userId !== userId) {
    redirect("/");
  }

  if (request.mission?.id) {
    console.log("You can not edit a request on mission.");
    revalidatePath(`/request/${params.requestId}/edit`);
  }

  const initialData = {
    location: request.location,
    date: new Date(request.dateTime),
    price: request.price,
    latitude: request.latitude ?? 0,
    longitude: request.longitude ?? 0,
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center mb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Inspection Request</h1>
      </div>
      <div className="shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
        <InspectionRequestForm
          mode="edit"
          initialData={initialData}
          requestId={params.requestId}
        />
      </div>
    </div>
  );
};

export default EditRequest;
