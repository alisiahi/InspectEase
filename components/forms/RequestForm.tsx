"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  inspectionRequestFormSchema,
  InspectionRequestFormSchemaDataType,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import {
  createInspectionRequest,
  updateInspectionRequest,
} from "@/app/actions/requestActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    },
  });

  async function onSubmit(values: InspectionRequestFormSchemaDataType) {
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

        {/* Date Picker Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <div className="">
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          field.value ? "" : "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </div>
              <FormDescription>
                Select the date for the inspection.
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

        {/* Submit Button */}
        <Button type="submit">
          {mode === "create" ? "Create" : "Update"} Request
        </Button>
      </form>
    </Form>
  );
}
