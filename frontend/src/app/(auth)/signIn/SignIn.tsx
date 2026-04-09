'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from './validateForm'
import z from 'zod'

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      userName: '',
      password: ''
    }
  })

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    console.log('Data hợp lệ:', data)
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
          <Paper sx={{ p: 4, width: 400, borderRadius: 3 }}>
            <Typography variant="h5" align="center" mb={2}>
              Đăng nhập
            </Typography>

            {/* Username */}
            <TextField
              fullWidth
              label="Tên đăng nhập"
              margin="normal"
              {...register('userName')}
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Link
              href="/forgotPassword"
              underline="hover"
              sx={{ mt: 1, display: 'block' }}
            >
              Quên mật khẩu?
            </Link>
            {/* Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Đăng nhập
            </Button>
            {/* Footer */}
            <Typography variant="body2" align="center" mt={2}>
              Chưa có tài khoản?{' '}
              <Link href="/signUp" underline="hover">
                <span style={{ color: '#7b2ff7', cursor: 'pointer' }}>
                  Đăng ký
                </span>
              </Link>
            </Typography>
          </Paper>
        </Box>
      </form>
    </>
  )
}

export default SignIn
