const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session")
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csrf = require("csurf");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const orderRoutes = require("./routes/orders");
const authRouter = require("./routes/auth");
const {urlencoded} = require("express");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");


const keys = require("./keys");

const app = express();



const hbs = exphbs.create(
    {
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        },

        defaultLayout: 'main',
        extname: 'hbs',
        helpers: require('./utils/hbs-helpers'),


    }
)
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static('public'));
app.use(urlencoded({extended: true}));
app.use(session(
    {
        secret: keys.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store
    }
));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRouter);

app.use(errorHandler);

const start = async () => {

    await mongoose.connect(keys.MONGODB_URI);

}

start().catch(error => {
    console.log(error);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})