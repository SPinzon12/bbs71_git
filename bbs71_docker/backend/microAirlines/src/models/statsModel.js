const { Schema, model } = require("mongoose");

const StatSchema = Schema(
  {
    user_id: String,
    type: String,
    routes: [],
    stats: {},
  },
  { collection: "flight_stats" }
);

StatSchema.method('toJSON', function () {
    const { __v, _id, id, ...object } = this.toObject();
    return object;
});

module.exports = model("stats", StatSchema);