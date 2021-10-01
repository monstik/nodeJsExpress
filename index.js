const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const orderRoutes = require("./routes/orders")
const {urlencoded} = require("express");
const User = require("./models/user");
const app = express();


const hbs = exphbs.create(
    {
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        },

        defaultLayout: 'main',
        extname: 'hbs',


    }
)

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use( async (req, res, next) => {
    try{
        req.user = await User.findById('6155c7fbb1d4058f1217fb07');
        next();
    }catch (error){
        console.log(error);
    }

});

app.use(express.static('public'));
app.use(urlencoded({extended: true}));
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);


const start = async () => {
    const urlDB = `mongodb+srv://admin:c1Z4v20ne2DkDbgi@cluster0.vr8pc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    await mongoose.connect(urlDB);

    const candidate = await User.findOne({});

    if(!candidate){
       const user = new User({
            email: 'd.krawets2026@gmail.com',
            name: 'Dania',
            cart: {items: []},
        })
        await user.save();
    }


}

start().catch(error => {
    console.log(error);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})