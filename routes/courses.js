const {Router} = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");

const router = Router();

const isOwner = (course, req) => {
    return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({});

        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            userId: req.user._id,
            courses
        });
    } catch (error) {
        console.log(error);
    }

});

router.get('/:id/edit', auth, async (req, res) => {
    try {
        if (!req.query.allow) {
            return res.redirect('/');
        } else {

            const course = await Course.findById(req.params.id);
            if (isOwner(course, req)) {
                res.render('course-edit', {
                    title: `Редактировать ${course.title}`,
                    course
                });
            } else {
                res.redirect('/courses');
            }


        }
    } catch (error) {
        console.log(error);
    }

});

router.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body;
        const course = await Course.findById(id);

        if (isOwner(course, req)) {
            Object.assign(course, req.body);
            course.save();
        }

        res.redirect('/courses');


    } catch (error) {
        console.log(error);
    }


});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/courses');
    } catch (error) {
        console.log(error)
    }

});


router.get('/:id', async (req, res) => {
   try {
       const course = await Course.findById(req.params.id)

       res.render('course', {
           layout: 'empty',
           title: `Курс ${course.title}`,
           course,
       });
   } catch (error) {
       console.log(error);
   }

});
module.exports = router;