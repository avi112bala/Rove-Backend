const { string } = require("joi");
const mongoose = require("mongoose");
const Placeschema = new mongoose.Schema({
  name: { type: String },
  desp: { type: String },
  rate: { type: Number },
  stateimage: { type: String, required: true },
  selectedState: { type: String, required: true },
});
const Place = mongoose.model("Place", Placeschema);
module.exports = Place;
