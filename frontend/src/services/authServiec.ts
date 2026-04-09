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
  }
}
