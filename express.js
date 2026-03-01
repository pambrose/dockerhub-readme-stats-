const express = require("express");
const statsHandler = require("./api/index");
const badgeHandler = require("./api/badge");

const app = express();
app.get("/api", statsHandler);
app.get("/api/badge", badgeHandler);
app.listen(9000, () => console.log("Running on http://localhost:9000"));
