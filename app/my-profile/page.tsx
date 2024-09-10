import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CaptureAndUpload from "@/components/CaptureAndUpload";
import { getUserVerificationStatus } from "@/app/actions/actions";
import UserVerificationRequest from "@/components/UserVerificationRequest";

import ResetImages from "@/components/ResetImages";

const MyProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { user } = await getUserVerificationStatus();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {user?.verificationStatus === "VERIFIED" ? (
        <p className="text-green-600 font-semibold">
          Your account is verified.
        </p>
      ) : user?.verificationStatus === "FAILED" ? (
        <ResetImages />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!user?.selfieUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Selfie</CardTitle>
              </CardHeader>
              <CardContent>
                <CaptureAndUpload userId={userId} type="selfie" />
              </CardContent>
            </Card>
          )}
          {!user?.documentUrl && (
            <Card>
              <CardHeader>
                <CardTitle>ID Document</CardTitle>
              </CardHeader>
              <CardContent>
                <CaptureAndUpload userId={userId} type="document" />
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {user?.selfieUrl &&
        user?.documentUrl &&
        user?.verificationStatus === "NOT_VERIFIED" && (
          <>
            <UserVerificationRequest />
            <ResetImages />
          </>
        )}
    </div>
  );
};

export default MyProfile;
