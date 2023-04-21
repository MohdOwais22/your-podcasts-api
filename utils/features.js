export const sendToken = (user, res, message, statusCode) => {
  const token = user.generateToken();

  res
    .status(statusCode)
    .cookie('token', token, {
      // ...cookieOptions,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: message,
    });
};

export const cookieOptions = {
  secure: process.env.NODE_ENV === 'Development' ? false : true,
  httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
  sameSite: process.env.NODE_ENV === 'Development' ? false : 'none',
};
