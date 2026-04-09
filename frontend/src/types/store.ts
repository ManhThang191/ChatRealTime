import { User } from './User'

export interface AuthState {
  accessToken: string | null
  user: User | null
  loading: boolean
  clearState: () => void
  signUp: (
    email: string,
    password: string,
    userName: string,
    firstName: string,
    lastName: string
  ) => Promise<void>
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
