import { InspectionRequestForm } from "@/components/forms/RequestForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewRequest = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center mb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Create an Inspection Request
        </h1>
      </div>
      <div className="shadow-2xl shadow-primary/40 rounded-lg p-6 space-y-4 border-[1px] border-primary/40 border-dashed">
        <InspectionRequestForm mode="create" />
      </div>
    </div>
  );
};

export default NewRequest;
