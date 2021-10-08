const {Router} = require("express");
const Order = require("../models/orders");
const auth = require("../middleware/auth");

const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id,
        }).populate('user.userId');



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


    } catch (error) {
        console.log(error);
    }
});


router.post('/', auth, async (req, res) => {
    const user = await req.user.populate('cart.items.courseId')

    const courses = user.cart.items.map(item => ({
        course: {...item.courseId._doc},
        count: item.count,
    }))

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