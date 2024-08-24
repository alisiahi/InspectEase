"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom-datepicker.css";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  inspectionRequestFormSchema,
  InspectionRequestFormSchemaDataType,
} from "@/lib/validation";

import {
  createInspectionRequest,
  updateInspectionRequest,
} from "@/app/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

interface InspectionRequestFormProps {
  mode: "create" | "edit";
  initialData?: InspectionRequestFormSchemaDataType;
  requestId?: string;
}

export function InspectionRequestForm({
  mode,
  initialData,
  requestId,
}: InspectionRequestFormProps) {
  const router = useRouter();

  const form = useForm<InspectionRequestFormSchemaDataType>({
    resolver: zodResolver(inspectionRequestFormSchema),
    defaultValues: initialData || {
      location: "",
      date: new Date(),
      price: 0,
      latitude: 0,
      longitude: 0,
    },
  });

  const handleLocationSelected = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  async function onSubmit(values: InspectionRequestFormSchemaDataType) {
    console.log("Form submitted with values:", values);
    try {
      let result;
      if (mode === "create") {
        result = await createInspectionRequest(values);
      } else {
        if (!requestId) throw new Error("Request ID is required for editing");
        result = await updateInspectionRequest(requestId, values);
      }

      if (result.success && result.data) {
        toast.success(
          mode === "create"
            ? "Inspection request created successfully"
            : "Inspection request updated successfully"
        );
        router.push(`/request/${result.data.id}`);
      } else {
        toast.error(result.error || `Failed to ${mode} inspection request`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Map Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Location on Map</FormLabel>
              <FormControl>
                <Map
                  initialPosition={
                    mode === "create"
                      ? undefined
                      : [
                          form.getValues("latitude"),
                          form.getValues("longitude"),
                        ]
                  }
                  selectable={true}
                  onLocationSelected={handleLocationSelected}
                  showCurrentLocationMarker={true}
                />
              </FormControl>
              <FormDescription>
                Click on the map to select the location for inspection. Simply
                tap on the Map to select your location.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City" {...field} />
              </FormControl>
              <FormDescription>
                Enter the location of the property for inspection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value !== "" && e.target.valueAsNumber
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Set the price you are willing to offer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Picker Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date and Time</FormLabel>
              <div className="">
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full p-2 border rounded"
                    calendarClassName="custom-datepicker"
                  />
                </FormControl>
              </div>
              <FormDescription>
                Select the date and time for the inspection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">
          {mode === "create" ? "Create" : "Update"} Request
        </Button>
      </form>
    </Form>
  );
}
