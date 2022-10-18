import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateTokens.js'

// @desc Register a new user
// @route Post /api/users/sign-up
// @access Public
const signUpUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExistsByEmail = await User.findOne({ email: email })
  if (userExistsByEmail) {
    res.status(400)
    throw new Error('User with email already exists!')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})
// @desc Register a new user with google
// @route Post /api/users/google/sign-up
// @access Public
const signUpUserWithGoogle = asyncHandler(async (req, res) => {
  const { name, email, googleId, pictureURL } = req.body

  console.log('Sign up user with google')
  console.log(name, email, googleId)

  const userExistsByEmail = await User.findOne({ email: email })
  if (userExistsByEmail) {
    res.status(400)
    throw new Error('User with email already exists!')
  }
  const user = await User.create({
    name,
    googleId,
    email,
    password: googleId,
    pictureURL,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.pictureURL,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc Auth user & get token
// @route Post /api/users/google/login
// @access Public
const authUserWithGoogle = asyncHandler(async (req, res) => {
  const { email, googleId } = req.body
  console.log('Authenticating with google')
  const user = await User.findOne({ email: email })
  if (user && user.googleId === googleId) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.pictureURL,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password!')
  }
})
// @desc Auth user & get token
// @route Post /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password!')
  }
})

export { authUser, authUserWithGoogle, signUpUserWithGoogle, signUpUser }
