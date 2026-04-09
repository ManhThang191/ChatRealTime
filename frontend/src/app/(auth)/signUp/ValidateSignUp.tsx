import { z } from 'zod'

export const validateSignUp = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(3, { message: 'Password must be at least 3 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' })
})
