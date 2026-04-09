'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { validateSignUp } from './ValidateSignUp'
import z from 'zod'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm({
    resolver: zodResolver(validateSignUp),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: ''
    }
  })

  const { signUp } = useAuthStore()
  const route = useRouter()

  const onSubmit = (data: z.infer<typeof validateSignUp>) => {
    console.log('Data hợp lệ:', data)
    const { email, password, username, firstName, lastName } = data
    // Gọi hàm đăng ký từ store
    signUp(email, password, username, firstName, lastName)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #ffffff, #3b82f6)'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: 400,
              borderRadius: 3
            }}
          >
            {/* Logo */}
            <Typography
              variant="h5"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Tạo tài khoản
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={3}
            >
              Chào mừng bạn! Hãy đăng ký để bắt đầu!
            </Typography>

            {/* Form */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Họ"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Tên đăng nhập"
              margin="normal"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {/* Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #7b2ff7, #9b4dff)'
              }}
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Tạo tài khoản
            </Button>

            {/* Footer */}
            <Typography variant="body2" align="center" mt={2}>
              Đã có tài khoản?{' '}
              <Link href="/signIn">
                <span style={{ color: '#7b2ff7', cursor: 'pointer' }}>
                  Đăng nhập
                </span>
              </Link>
              .
            </Typography>
          </Paper>
        </Box>
      </form>
    </>
  )
}

export default SignUp
