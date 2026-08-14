import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  role: z
    .string()
    .min(1, { message: 'Role is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Project name must be at least 3 characters' })
    .max(100, { message: 'Project name cannot exceed 100 characters' }),
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters' })
    .max(500, { message: 'Description cannot exceed 500 characters' }),
  status: z.enum(['Pending', 'In-Progress', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
  projectId: z.string().min(1, { message: 'Project selection is required' }),
  title: z
    .string()
    .min(2, { message: 'Task title must be at least 2 characters' })
    .max(150, { message: 'Title cannot exceed 150 characters' }),
  description: z.string().optional(),
  status: z.enum(['Pending', 'In-Progress', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
