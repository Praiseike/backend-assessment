const app = require('./src/app');
const port = process.env.APP_PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})