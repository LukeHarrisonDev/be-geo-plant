const app = require('./app.js');
const { PORT = 9500 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));