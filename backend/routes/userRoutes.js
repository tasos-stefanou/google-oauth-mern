import express from 'express'
import {
  authUser,
  signUpUser,
  signUpUserWithGoogle,
  authUserWithGoogle,
} from '../controllers/userController.js'
const router = express.Router()

router.route('/sign-up').post(signUpUser)
router.post('/login', authUser)
router.route('/google/sign-up').post(signUpUserWithGoogle)
router.post('/google/login', authUserWithGoogle)
export default router
