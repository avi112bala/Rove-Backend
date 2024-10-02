const { string } = require("joi");
const mongoose = require("mongoose");
const Cityschema = new mongoose.Schema({
  name: { type: String },
  desp: { type: String },
  rate: { type: Number },
  stateimage: { type: String, required: true },
  selectedState: { type: String, required: true },
});
const City = mongoose.model("City", Cityschema);
module.exports = City;
