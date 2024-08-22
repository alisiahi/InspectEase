import { InspectionRequestForm } from "@/components/forms/RequestForm";
import React from "react";

const NewRequest = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <InspectionRequestForm mode="create" />
    </div>
  );
};

export default NewRequest;
