import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // console.log("req.files: ", req.files);

  // 1) ----- Get user details from frontend

  const { username, fullName, email, password } = req.body;
  console.log("email: ", email);

  // 2) ----==  Validation - not empty
  if (
    [username, fullName, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 3) ---- Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // 4) ------ Check if user Already exists:username, email
  const existedUser = await User.findOne({
    // $or use for, if you check multiple input value
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username are already exists");
  }

  // 5) ------   Check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6) --------  Upload them to cloudinary, avatar

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 7) --------  Create user Object - create entry in DB

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // 8) -------Remove password and refresh token field from response
  //  -------here use "select" for which one data remove in your database in createdUser
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // 9) ------------- Check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering the User");
  }

  //  10) If user creation is ok Done then Return Response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
