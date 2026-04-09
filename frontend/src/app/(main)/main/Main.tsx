'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

const Main = () => {
  const { signOut } = useAuthStore()
  const route = useRouter()
  const signOutHanl = async () => {
    await signOut().then(() => {
      route.push('/signIn')
    })
  }
  return (
    <>
      <Button onClick={() => signOutHanl()}>Sign Out</Button>
    </>
  )
}

export default Main
