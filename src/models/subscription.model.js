import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      // One who is subscribing.
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    channel: {
      // One to whom "subscriber" is subscribing.

      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
