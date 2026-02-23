import { z } from "zod";

// Schema for Login
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Schema for Registration
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "employee"]).optional(), 
});


// Schema for Agent Registration (Public)
export const AgentRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agencyName: z.string().min(2, "Agency Name is required"), // 👈 Mandatory for agents
});




// Schema for New CRM Leads
export const LeadSchema = z.object({
  customerName: z.string().min(2, "Customer Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(5, "Phone number is required"),
  destination: z.string().min(2, "Destination is required"),
  travelDates: z.string().optional(),
  numberOfTravelers: z.number().min(1, "Must have at least 1 traveler"),
  budget: z.number().optional(),
  currency: z.string().default("USD"),
  notes: z.string().optional()
});