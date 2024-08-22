import { InspectionRequestForm } from "@/components/forms/RequestForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewRequest = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <InspectionRequestForm mode="create" />
    </div>
  );
};

export default NewRequest;
