import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, isVerified } = body;

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
