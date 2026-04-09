import { z } from 'zod'

export const signInSchema = z.object({
  userName: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự')
})
