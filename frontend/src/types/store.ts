import { User } from './User'

export interface AuthState {
  accessToken: string | null
  user: User | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    userName: string,
    firstName: string,
    lastName: string
  ) => Promise<void>
}
