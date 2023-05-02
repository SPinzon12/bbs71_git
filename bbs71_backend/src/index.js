require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const paths = {
  airline: "/airline",
  airport: "/airport",
  user: "/user"
};

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use(paths.airline, require("./routes/airlines"));
app.use(paths.airport, require("./routes/airports"));
app.use(paths.user, require("./routes/users"));

app.listen(port, () => {
  console.log("Server listening on", process.env.PORT);
});