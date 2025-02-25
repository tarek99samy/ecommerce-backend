const dotenv = require('dotenv');
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env.production') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.development') });
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const { errorHandler, errorConverter } = require('./middlewares/errorHandler.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(process.env.UPLOADS_DIR));
app.use('/api/v1', routes);
app.use(errorConverter);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`[Server running on port ${process.env.PORT}]`);
});

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// process.on('uncaughtException', (err) => {
//   console.error('[Uncaught Exception]:', err);
//   // process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
// });

// process.on('SIGTERM', () => {
//   app.close(() => {
//     console.log('[Server closed gracefully]');
//     db.close(() => {
//       console.log('[DB closed gracefully]');
//       // process.exit(0);
//     });
//   });
// });

module.exports = app;
