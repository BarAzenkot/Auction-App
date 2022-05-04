const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const upload = require("./api/middlewares/upload");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const GridFSBucket = require("gridfs-stream");
const crypto = require("crypto");
// var cors = require("cors");
// app.use(cors());

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@auctions-app.hdluf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@auctions-app.hdluf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once("open", () => {
  gfs = GridFSBucket(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const auctionsRoutes = require("./api/routes/auctions");
const categoriesRoutes = require("./api/routes/categories");
const usersRoutes = require("./api/routes/users");
const bidsRoutes = require("./api/routes/bids");

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
app.use("/bids", bidsRoutes);

app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.status(404).json({ err: "No files." });
    }
    return res.json(files);
  });
});

app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({ err: "No file." });
    }
    // return res.json(file);

    if (file.contentType === "image/jpeg" || file.contentType === "img/png") {
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    } else {
      console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeee\n");
      res.status(500).json({ err: "Not an image." });
    }
  });
});

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Hello World 2",
//   });
// });

app.post("/auctions", (req, res) => {
  res.status(200).json({
    body: req.body,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    body: req.body,
  });
});

// app.get("/files", (req, res) => {});

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
