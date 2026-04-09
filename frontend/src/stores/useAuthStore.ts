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

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false
    })
  },

  signUp: async (email, password, username, firstName, lastName) => {
    try {
      set({ loading: true })

      // Simulate API call
      const res = await authService.signUp(
        email,
        password,
        username,
        firstName,
        lastName
      )
      const message = res?.message || 'Đăng ký thành công!'
      // Simulate successful registration
      toast.success(message)
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký'

      toast.error(message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  signIn: async (username, password) => {
    try {
      set({ loading: true })
      const res = await authService.signIn(username, password)

      const { accessToken, user } = res

      const message = res?.message || 'Đăng nhap thành công!'
      toast.success(message)
      set({ accessToken, user })
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || 'Đăng nhập thất bại'
      toast.error(message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  signOut: async () => {
    try {
      get().clearState()
      const res = await authService.signOut()
      const message = res?.message || 'Đăng xuất thành công!'
      toast.success(message)
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || 'Đã xảy ra lỗi khi đăng xuất'
      toast.error(message)
      throw error
    }
  }
}))
