"use server";

import prisma from "@/lib/db";
import {
  inspectionRequestFormSchema,
  InspectionRequestFormSchemaDataType,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Creating an inspection request
export async function createInspectionRequest(
  data: InspectionRequestFormSchemaDataType
) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    inspectionRequestFormSchema.parse(data);
  } catch (error) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    const newRequest = await prisma.inspectionRequest.create({
      data: {
        userId,
        location: data.location,
        dateTime: data.date,
        price: data.price,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    revalidatePath("/request/new");
    return { success: true, data: newRequest };
  } catch (error) {
    console.error("Failed to create inspection request:", error);
    return { success: false, error: "Failed to create inspection request" };
  }
}

// Getting an inspection request
export async function getInspectionRequest(requestId: string) {
  try {
    const request = await prisma.inspectionRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        mission: {
          include: {
            inspector: {
              select: {
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!request) {
      return { success: false, error: "Inspection request not found" };
    }

    return { success: true, data: request };
  } catch (error) {
    console.error("Failed to fetch inspection request:", error);
    return { success: false, error: "Failed to fetch inspection request" };
  }
}

// Updating an inspection request
export async function updateInspectionRequest(
  requestId: string,
  data: InspectionRequestFormSchemaDataType
) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    inspectionRequestFormSchema.parse(data);
  } catch (error) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    // First, check if the request exists and belongs to the user
    const existingRequest = await prisma.inspectionRequest.findUnique({
      where: {
        id: requestId,
        userId: userId,
        mission: null,
      },
    });

    if (!existingRequest) {
      return {
        success: false,
        error:
          "Inspection request not found or you don't have permission to update it",
      };
    }

    // If the request exists and belongs to the user, update it
    const updatedRequest = await prisma.inspectionRequest.update({
      where: {
        id: requestId,
      },
      data: {
        location: data.location,
        dateTime: data.date,
        price: data.price,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    revalidatePath(`/request/${requestId}`);
    revalidatePath(`/request/edit/${requestId}`);
    return { success: true, data: updatedRequest };
  } catch (error) {
    console.error("Failed to update inspection request:", error);
    return { success: false, error: "Failed to update inspection request" };
  }
}

// Deleting an inspection request
export async function deleteInspectionRequest(requestId: string) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // First, check if the request exists and belongs to the user
    const existingRequest = await prisma.inspectionRequest.findUnique({
      where: {
        id: requestId,
        userId: userId,
        mission: null,
      },
    });

    if (!existingRequest) {
      return {
        success: false,
        error:
          "Inspection request not found or you don't have permission to delete it",
      };
    }

    // If the request exists and belongs to the user, delete it
    await prisma.inspectionRequest.delete({
      where: {
        id: requestId,
      },
    });

    return {
      success: true,
      message: "Inspection request deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete inspection request:", error);
    return { success: false, error: "Failed to delete inspection request" };
  }
}

// Getting all the requests
export async function getAllRequests() {
  try {
    const requests = await prisma.inspectionRequest.findMany({
      where: {
        mission: null, // This filters out requests that have an associated mission
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        mission: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Failed to fetch inspection requests:", error);
    return { success: false, error: "Failed to fetch inspection requests" };
  }
}

// Getting all of the requests of the user
export async function getUserRequests() {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const requests = await prisma.inspectionRequest.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Failed to fetch user's inspection requests:", error);
    return {
      success: false,
      error: "Failed to fetch your inspection requests",
    };
  }
}

// Accepting a request
export async function acceptInspectionRequest(requestId: string) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Check if the request exists and is not already accepted
    const existingRequest = await prisma.inspectionRequest.findUnique({
      where: { id: requestId },
      include: { mission: true },
    });

    if (!existingRequest) {
      return { success: false, error: "Inspection request not found" };
    }

    if (existingRequest.mission) {
      return {
        success: false,
        error: "This request has already been accepted",
      };
    }

    // Create a new inspection mission
    const newMission = await prisma.inspectionMission.create({
      data: {
        inspectionRequestId: requestId,
        inspectorId: userId,
        status: "PENDING",
      },
    });

    revalidatePath(`/request/${requestId}`);
    return { success: true, data: newMission };
  } catch (error) {
    console.error("Failed to accept inspection request:", error);
    return { success: false, error: "Failed to accept inspection request" };
  }
}

// Getting all of the missions of the user
export async function getUserMissions() {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const missions = await prisma.inspectionMission.findMany({
      where: {
        inspectorId: userId,
      },
      include: {
        inspectionRequest: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: missions };
  } catch (error) {
    console.error("Failed to fetch user's inspection missions:", error);
    return {
      success: false,
      error: "Failed to fetch your inspection missions",
    };
  }
}

// User photo upload for itself
export async function updateUserImage(
  imageUrl: string,
  type: "selfie" | "document"
) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data:
        type === "selfie" ? { selfieUrl: imageUrl } : { documentUrl: imageUrl },
    });
    revalidatePath("/my-profile");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Failed to update user image:", error);
    return { success: false, error: "Failed to update user image" };
  }
}

// Getting User Verification Status
export async function getUserVerificationStatus() {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationStatus: true,
        selfieUrl: true,
        documentUrl: true,
      },
    });

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Failed to fetch user verification status:", error);
    return {
      success: false,
      error: "Failed to fetch user verification status",
    };
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to verify face match

async function sendVerificationRequest(
  userId: string,
  selfieUrl: string,
  documentUrl: string
) {
  try {
    const apiKey = process.env.NEXTJS_API_KEY;
    console.log("Sending request with API Key:", apiKey);

    const response = await fetch(`${process.env.FASTAPI_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.NEXTJS_API_KEY as string,
      },
      body: JSON.stringify({
        userId,
        selfie_url: selfieUrl,
        id_url: documentUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Verification request failed:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending verification request:", error);
    return false;
  }
}

export async function requestVerification() {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { selfieUrl: true, documentUrl: true, verificationStatus: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.verificationStatus === "VERIFIED") {
      return { success: false, error: "User is already verified" };
    }

    if (!user.selfieUrl || !user.documentUrl) {
      return { success: false, error: "Selfie or ID document missing" };
    }

    const requestSent = await sendVerificationRequest(
      userId,
      user.selfieUrl,
      user.documentUrl
    );

    if (!requestSent) {
      return { success: false, error: "Failed to send verification request" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: "PENDING" },
    });

    revalidatePath("/my-profile");
    return { success: true, message: "Verification request sent successfully" };
  } catch (error) {
    console.error("Failed to request verification:", error);
    return { success: false, error: "Failed to request verification" };
  }
}
////////////////////////////////////////////////////////////////////////////////////////
export async function requestResetImages() {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { selfieUrl: true, documentUrl: true, verificationStatus: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.verificationStatus === "VERIFIED") {
      return { success: false, error: "User is already verified" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "NOT_VERIFIED",
        selfieUrl: null,
        documentUrl: null,
      },
    });

    revalidatePath("/my-profile");
    return { success: true, message: "Images are reset successfully" };
  } catch (error) {
    console.error("Failed to reset images:", error);
    return { success: false, error: "Failed to reset images" };
  }
}
