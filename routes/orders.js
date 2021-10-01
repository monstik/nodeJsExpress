const {Router} = require("express");
const Order = require("../models/orders");

const router = Router();

router.get('/', async (req, res) => {
    const orders = await Order.find({
        userId: req.user._id,
    }).populate('user.userId');
    console.log(orders.map(item => ({
        id: item._id,
        userName: item.user.userId.name,
        courses: {...item.courses},
        price: item.courses.reduce((total, course) => {
            return total += course.count * course.course.price;
        }, 0)

    })));


    res.render('orders', {
        title: 'Заказы',
        isOrders: true,
        orders: orders.map(item => ({
            id: item._id,
            date: item.date,
            userName: item.user.userId.name,
            courses: {...item.courses},
            price: item.courses.reduce((total, course) => {
                return total += course.count * course.course.price;
            }, 0),
        }))
    });
});


router.post('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId')

    const courses = user.cart.items.map(item => ({
        course: {...item.courseId._doc},
        count: item.count,
    }))

    console.log(courses);
    const order = await Order({
        courses: courses,
        user: {
            userId: req.user,
        },
    });

    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
});

module.exports = router;