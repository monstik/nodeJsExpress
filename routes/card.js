const {Router} = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const Course = require("../models/course.js");

const router = Router();

const mapCourses = (cart) => {

    return cart.items.map(item => ({
        ...item.courseId._doc, count: item.count, id: item.courseId.id
    }))
}

const computePrice = (courses) =>{
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/courses');
})

router.get('/', auth, async (req, res) => {

    const user = await req.user.populate('cart.items.courseId');

    const courses = mapCourses(user.cart);

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: computePrice(courses),
    });
})

router.delete('/remove/:id', auth, async (req, res) => {

    await req.user.removeFromCart(req.params.id);

    const user = await req.user.populate('cart.items.courseId');

    const courses = mapCourses(user.cart);

    const cart = {
        courses,
        price: computePrice(courses),
    }


    res.status(200).json(cart)
})

module.exports = router;