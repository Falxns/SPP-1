const { request } = require("express");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const formData = require("express-form-data");
const fs = require("fs");
const path = require("path");

mongoose
  .connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongodb."))
  .catch(() => console.log("Error connecting to mongodb."));

const gameSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  platform: String,
  genre: String,
  maturity: Number,
  price: Number,
  desc: String,
});
const Game = mongoose.model("Game", gameSchema, "games");

const app = express();
app.use(express.static("public"));

app.use(formData.parse());
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.post("/game", function (req, res) {
  const { title, platform, genre, maturity, price, desc, image } = req.body;

  const imageName = mongoose.Types.ObjectId().toHexString() + ".jpg";
  const imagePath = "/public/images/games/" + imageName;

  fs.writeFileSync(
    path.join(process.cwd(), imagePath),
    fs.readFileSync(image.path)
  );

  const game = new Game({
    title,
    platform,
    genre,
    maturity,
    price,
    desc,
    imageUrl: "http://localhost:3000/images/games/" + imageName,
  });

  game
    .save()
    .then(() => res.redirect("http://localhost:3000/game/" + game._id))
    .catch(() => console.log("500"));
});

app.get("/filter", function (req, res) {
  const platform = req.query.platform;
  const genre = req.query.genre;
  const maturity = req.query.maturity;
  Game.find({ platform, genre, maturity })
    .lean()
    .then((games) => {
      res.render("index", { games });
    })
    .catch(() => res.send("404"));
});

app.get("/", function (req, res) {
  Game.find()
    .lean()
    .then((games) => {
      res.render("index", { games });
    })
    .catch(() => res.send("404"));
});

app.get("/game/:id", function (req, res) {
  const gameID = req.params.id;

  Game.findById(gameID)
    .then((game) =>
      res.render("game", {
        title: game.title,
        imageUrl: game.imageUrl,
        platform: game.platform,
        genre: game.genre,
        maturity: game.maturity,
        price: game.price,
        desc: game.desc,
      })
    )
    .catch(() => res.send("404"));
});

app.listen(3000, () => console.log("Server is listening.."));
