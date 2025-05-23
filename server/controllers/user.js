import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import path from "path";
import fs from "fs";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.")
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).json("Unsubscription successfull.")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id},
      $pull:{dislikes:id}
    })
    res.status(200).json("The video has been liked.")
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
      await Video.findByIdAndUpdate(videoId,{
        $addToSet:{dislikes:id},
        $pull:{likes:id}
      })
      res.status(200).json("The video has been disliked.")
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      if (!req.files || !req.files.img) {
        return res.status(400).json({ error: "No image uploaded" });
      }
      const img = req.files.img;
      // Ensure the directory exists
      const publicImgDir = path.join("client", "public", "img");
      if (!fs.existsSync(publicImgDir)) {
        fs.mkdirSync(publicImgDir, { recursive: true });
      }
      const uploadPath = path.join(publicImgDir, `${req.user.id}_${Date.now()}_${img.name}`);
      await img.mv(uploadPath);
      const imgPath = `/img/${path.basename(uploadPath)}`;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { img: imgPath } },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error('Avatar upload error:', err);
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};
