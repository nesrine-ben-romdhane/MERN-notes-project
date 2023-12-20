require('dotenv').config();
const express = require('express');
const dbConn = require('./config/dbConn');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const path = require('path');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler')
const { logger, logEvents } = require('./middleware/logger')

dbConn();
app.use(logger)
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());



app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'views')));
app.use('/', require('./routes/root'));
app.use('/notes', require('./routes/note'))
require("./routes/user")(app)

require("./routes/auth")(app)

// 404 Not Found handler
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.send({ message: '404 page not found' });
  } else {
    res.type('text').send('404 page not found');
  }
});
app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to database');
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
});
// creating a new log in case of db error
mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
