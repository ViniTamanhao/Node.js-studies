const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// cors stands for "Cross Origin Resource Sharing"
const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) != -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// built-in middleware to handle urlenconded data
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// using routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));

app.get("^/$|/index(.html)?", (req, res) => {
  //res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); //302 by default
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 page not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
