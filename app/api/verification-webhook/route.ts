import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const apiKey = headersList.get("X-API-Key");

    if (apiKey !== process.env.FASTAPI_API_KEY) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, isVerified } = body;
    console.log("This is the result which received in next.js app", isVerified);

    if (!userId || typeof isVerified !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const res = await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: isVerified ? "VERIFIED" : "NOT_VERIFIED" },
    });

    revalidatePath("/my-profile");

    return NextResponse.json({
      message: "Verification status updated successfully",
    });
  } catch (error) {
    console.error("Error processing verification webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
