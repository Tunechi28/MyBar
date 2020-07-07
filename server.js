if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const app = express();
app.use(express.json());
app.use(express.urlencoded({limit:'10mb',extended : false}));
const expressLayouts = require('express-ejs-layouts');
app.use(methodOverride('_method'));
const indexRouter = require('./routes/index');
const brandsRouter = require('./routes/brands');
const drinksRouter = require('./routes/drinks');

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/brands', brandsRouter);
app.use('/drinks', drinksRouter);
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to mongoose'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log('server is running')});