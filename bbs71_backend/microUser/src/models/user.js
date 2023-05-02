const { Schema, model } = require("mongoose");

const UserSchema = Schema(
  {
    user_id: String,
    name: String,
    user: String,
    password: String,
    type: String,
  },
  { collection: "users" }
);

UserSchema.method('toJSON', function () {
    const { __v, _id, id, ...object } = this.toObject();
    return object;
});

module.exports = model("user", UserSchema);
