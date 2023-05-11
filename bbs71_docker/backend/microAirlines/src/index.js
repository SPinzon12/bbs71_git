require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./db/config');
const morgan = require('morgan');
const cors = require('cors');


const app = express();
const port = process.env.PORT;
const paths = {
    airlines: '/airlines'
};

dbConnection()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors());

app.use(paths.airlines, require('./routes/airlinesRoutes'))

app.listen(port, () => {
    console.log('Server listening on', process.env.PORT)
})