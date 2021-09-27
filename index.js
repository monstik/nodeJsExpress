import express, {urlencoded} from "express";
import path from "path";
import exphbs from "express-handlebars";
import homeRoutes from "./routes/home.js";
import addRoutes from "./routes/add.js";
import coursesRoutes from "./routes/courses.js";
import cardRoutes from "./routes/card.js"

const app = express();

const hbs = exphbs.create(
    {
        defaultLayout: 'main',
        extname: 'hbs'
    }
)

app.engine('hbs',hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(urlencoded({extended: true}));
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes )







const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
})