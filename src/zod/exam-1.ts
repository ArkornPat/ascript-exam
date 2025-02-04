import { z } from "zod";

export const registerFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    fullName: z.string().min(2, "Please enter your full name"),
    phone: z.string().regex(/^\d{10}$/, "Please enter a valid phone number"),
    address: z.string().min(5, "Please enter your address"),
    gender: z.preprocess((val) => (val === "" ? undefined : val), 
    z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select a gender" }),
    })
  ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
