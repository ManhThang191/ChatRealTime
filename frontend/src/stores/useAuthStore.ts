import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { authService } from '@/services/authServiec'
import { AuthState } from '@/types/store'

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  //   refreshToken: null,
  user: null,
  loading: false,

  signUp: async (email, password, username, firstName, lastName) => {
    try {
      set({ loading: true })
      toast.loading('Đang đăng ký...')

      // Simulate API call

      await authService.signUp(email, password, username, firstName, lastName)

      // Simulate successful registration
      toast.success('Đăng ký thành công!')
    } catch (error) {
      console.log(error)
      toast.error('Đã xảy ra lỗi khi đăng ký')
    } finally {
      set({ loading: false })
    }
  }
}))
