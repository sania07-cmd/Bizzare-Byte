const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// ============================
// DATABASE
// ============================
require("./db"); // just initialize connection, do NOT listen here

// ============================
// MIDDLEWARE
// ============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "college_event_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Railway handles HTTPS
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// ============================
// VIEW ENGINE
// ============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ============================
// STATIC FILES
// ============================
app.use(express.static(path.join(__dirname, "public")));

// ============================
// ROUTES
// ============================
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const organiserRoutes = require("./routes/organiserRoutes");

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/organiser", organiserRoutes);

// ============================
// HOME
// ============================
app.get("/", (req, res) => {
  res.render("index");
});

// ============================
// LOGOUT
// ============================
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ============================
// ERROR HANDLER
// ============================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send("Something went wrong!");
});

// ============================
// SERVER START (RAILWAY SAFE)
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 College Event System running on port ${PORT}`);
});

