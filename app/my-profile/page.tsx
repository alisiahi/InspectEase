import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CaptureAndUpload from "@/components/CaptureAndUpload";
import { getUserVerificationStatus } from "@/app/actions/actions";
import UserVerificationRequest from "@/components/UserVerificationRequest";

const MyProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { user } = await getUserVerificationStatus();

  if (user?.isVerified) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <p>Your account is verified.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
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
      {user?.selfieUrl && user?.documentUrl && <UserVerificationRequest />}
    </div>
  );
};

export default MyProfile;
