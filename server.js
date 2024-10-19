require("dotenv").config();

const express = require("express");
const path = require("path");
const routes = require("./routes");
const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("Pronto");
  })
  .catch((e) => {
    console.log(e);
  });

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const helmet = require("helmet");
const csrf = require("csurf");

const {
  meuMiddleware,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware");

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "kaoi39i492034i2901",
  // store: new MongoStore({ mongooseConnection: monsoge.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());
// Nossos próprios middlewares
app.use(meuMiddleware);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on("Pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
