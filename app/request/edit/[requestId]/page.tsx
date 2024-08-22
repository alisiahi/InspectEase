import { getInspectionRequest } from "@/app/actions/requestActions";
import { InspectionRequestForm } from "@/components/forms/RequestForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const EditRequest = async ({ params }: { params: { requestId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getInspectionRequest(params.requestId);

  if (!result.success || !result.data) {
    toast.error(result.error || "Inspection request not found");
    redirect("/");
  }

  const request = result.data;

  // Check if the current user is the owner of the request
  if (request.userId !== userId) {
    toast.error("You do not have permission to edit this request");
    redirect("/");
  }

  const initialData = {
    location: request.location,
    date: new Date(request.dateTime),
    price: request.price,
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Inspection Request</h1>
      </div>
      <InspectionRequestForm
        mode="edit"
        initialData={initialData}
        requestId={params.requestId}
      />
    </div>
  );
};

export default EditRequest;
