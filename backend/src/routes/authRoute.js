import express from 'express'
import { signUp, signIn } from '../controllers/authController.js'

const router = express.Router()

// @route   POST /api/auth/register
router.post('/signup', signUp)

// @route  POST /api/auth/login
router.post('/signin', signIn)

// @access  Public

export default router
