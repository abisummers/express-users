const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    //doc structure
    name: { type: String, required: true },
    description: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    //additional settings
    timestamps: true
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
