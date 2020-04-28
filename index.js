const express = require("express");

const server = express();

server.get("/", (req, res) => {
  res.json({
    message: "Welcome!",
  });
});

server.listen(4400, () => {
  console.log("Server listening on port 4400");
});
