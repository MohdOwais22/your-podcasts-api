import { asyncError } from '../middlewares/error.js';
import { Podcast } from '../models/podcast.js';
import { User } from '../models/User.js';
import ErrorHandler from '../utils/error.js';
import { sendToken } from '../utils/features.js';

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
      // ...cookieOptions,
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

export const getAllUsers = asyncError(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



export const addToFavorites = asyncError(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    if (user.favorites.includes(podcast._id)) {
      return res.status(400).json({ message: 'Podcast already in favorites' });
    }

    user.favorites.push(podcast._id);
    await user.save();

    res.status(200).json({ message: 'Podcast added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export const removeFavorite = asyncError(async (req, res, next) => {
// router.delete('/favorites/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    if (!user.favorites.includes(podcast._id)) {
      return res.status(400).json({ message: 'Podcast not in favorites' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== podcast._id.toString());
    await user.save();

    res.status(200).json({ message: 'Podcast removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export const getMyFavorites = asyncError(async (req, res, next) => {
// router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
