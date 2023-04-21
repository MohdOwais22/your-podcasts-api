import { asyncError } from '../middlewares/error.js';
import {User} from '../models/user.js';
import ErrorHandler from '../utils/error.js';
import {
    cookieOptions,
    sendToken,
  } from "../utils/features.js";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Incorrect Email or Password', 400));
  }

  if (!password) return next(new ErrorHandler('Please Enter Password', 400));

  // Handle error
  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler('Incorrect Email or Password', 400));
  }
  sendToken(user, res, `Welcome Back, ${user.name}`, 200);
});

export const signup = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler('User Already Exist', 400));

  user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, res, `Registered Successfully`, 201);
});

export const logOut = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: 'Logged Out Successfully',
    });
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});
