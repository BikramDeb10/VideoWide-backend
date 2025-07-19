import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      // cloudinary url string
      type: String,
      required: [true, "Video file field is required"],
    },

    thumbnail: {
      type: String,
      required: [true, "Thumbnail field is required"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner field id required"],
    },

    title: {
      type: String,
      required: [true, "Title field is required"],
    },

    description: {
      type: String,
      required: [true, "Description field is required"],
    },

    duration: {
      type: Number,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps },
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
