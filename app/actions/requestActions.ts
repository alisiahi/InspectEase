"use server";

import prisma from "@/lib/db";
import {
  inspectionRequestFormSchema,
  InspectionRequestFormSchemaDataType,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
      include: {
        user: {
          select: {
            fullName: true,
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
