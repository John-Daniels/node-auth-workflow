const { config } = require("dotenv");
config();

require("./db/db");

const cors = require("cors");
const express = require("express");

const apiRouter = require("./routes/index");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());

app.use(express.json());

// app.get("/", (req, res) => res.send("welcome"));

app.use(express.static("public"));
app.use("/api", apiRouter);

app.listen(port, () => console.log(`Server is up on port ${port}`));
