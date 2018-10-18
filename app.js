const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/databsase')

// Create App options
let options = {
    useNewUrlParser: true
}

// Map global Promise
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, options)
    .then(
        () => console.log('Connected to Database'),
        err => console.log(`Connection Error: ${err}`)
    )

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// Method Override Middleware
app.use(methodOverride('_method'))

// ExpressSession Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Index Route 
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    })
})

// About Route
app.get('/about', (req, res) => {
    res.render('about')
})





// Use Routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})