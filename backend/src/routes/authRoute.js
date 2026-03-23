import express from 'express'
import { signUp } from '../controllers/authController.js'

const router = express.Router()

// @route   POST /api/auth/register
router.post('/signup', signUp)

// @route  POST /api/auth/login

// @access  Public

export default router
