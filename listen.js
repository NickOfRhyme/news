const { PORT = 9090 } = process.env;

app = require("./app");

app.listen(requestedPort, () => {
  console.log(`listening on port ${PORT}...`);
});
