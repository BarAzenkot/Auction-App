const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@auctions-app.hdluf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected.");
});

const auctionsRoutes = require("./api/routes/auctions");
const categoriesRoutes = require("./api/routes/categories");
const usersRoutes = require("./api/routes/users");

app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//ROUTES

app.use("/auctions", auctionsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World 2",
  });
});

app.post("/auctions", (req, res) => {
  res.status(200).json({
    body: req.body,
  });
});

app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
