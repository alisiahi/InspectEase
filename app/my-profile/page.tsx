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
      <Card>
        <CardHeader>
          <CardTitle>This Button is Here mainly for testing</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetImages />
        </CardContent>
      </Card>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {user?.verificationStatus === "VERIFIED" ? (
        <p className="text-green-600 font-semibold">
          Your account is verified.
        </p>
      ) : user?.verificationStatus === "FAILED" ? (
        <ResetImages />
      ) : user?.verificationStatus === "PENDING" ? (
        <div className="flex flex-col gap-2">
          <p>Try again and send another verification reuquest</p>
          <UserVerificationRequest />
        </div>
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
          <UserVerificationRequest />
        )}
    </div>
  );
};

export default MyProfile;
