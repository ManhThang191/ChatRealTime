import api from '@/libs/axios'

export const authService = {
  signUp: async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await api.post(
      '/auth/signup',
      {
        email,
        password,
        username,
        firstName,
        lastName
      },
      { withCredentials: true }
    )
    return res.data
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      '/auth/signin',
      {
        username,
        password
      },
      { withCredentials: true }
    )
    return res.data
  },
  signOut: async () => {
    const res = await api.post('/auth/signout', {}, { withCredentials: true })
    return res.data
  },
  fetchMe: async () => {
    try {
      const res = await api.get('/user/me', { withCredentials: true })
      return res.data.user
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message ||
        'Không thể lấy thông tin người dùng'
      throw new Error(message)
    }
  },
  refreshToken: async () => {
    try {
      const res = await api.post('/auth/refresh', {}, { withCredentials: true })
      return res.data.accessToken
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || 'Không thể làm mới token'
      throw new Error(message)
    }
  }
}
