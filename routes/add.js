const Router = require("express");
const Course = require("../models/course.js");
const auth = require("../middleware/auth");

const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить курсы',
        isAdd: true,
    });
});

router.post('/', auth, async (req, res) => {

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        userId: req.user
    })
    try {
        await course.save();
        res.redirect('/courses');
    } catch (error) {
        console.log(error);
    }



})

module.exports = router;