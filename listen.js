app = require("./app");

const requestedPort = process.argv[2] || 5555;

app.listen(requestedPort, () => {
  console.log(`listening on port ${requestedPort}...`);
});
