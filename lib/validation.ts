import { z } from "zod";

export const inspectionRequestFormSchema = z.object({
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  date: z.date({
    required_error: "Date is required.",
    invalid_type_error: "Please enter a valid date.",
  }),
  price: z.number().positive("Price must be greater than 0."),
});

export type InspectionRequestFormSchemaDataType = z.infer<
  typeof inspectionRequestFormSchema
>;
