const express = require("express");
var exphbs = require("express-handlebars");

const app = express();
app.use(express.static("public"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/game/:id", function (req, res) {
  const gameID = req.params.id;
  res.render("game", {
    title: "Dota 2",
    imageUrl: "/assets/images/1.jpg",
    platform: "PC",
    genre: "Vizual Novel",
    maturityRating: "4+",
    price: "20",
    desc:
      "Lorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolor",
  });
});

app.listen(3000, () => console.log("Server is listening.."));
