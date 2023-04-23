import DataUriParser from "datauri/parser.js";
import path from "path";

export const sendToken = (user, res, message, statusCode) => {
  const token = user.generateToken();

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message: message,
    });
};

// export const cookieOptions = {
//   secure: process.env.NODE_ENV === 'Development' ? false : true,
//   httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
//   sameSite: process.env.NODE_ENV === 'Development' ? false : 'none',
// };


export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};