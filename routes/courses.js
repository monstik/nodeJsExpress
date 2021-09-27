import {Router} from "express";
import Course from "../models/course.js";

const router = Router();


router.get('/', async (req, res) =>{
    const courses = await Course.getAll();


    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/:id/edit', async (req, res) =>{
    if(!req.query.allow){
        return res.redirect('/');
    }else{
        const course = await Course.getById(req.params.id);
       res.render('course-edit',{
           title: `Редактировать ${course.title}`,
           course
       });

    }
})

router.post('/edit', async (req, res) =>{
    console.log(req.body);
    await Course.update(req.body);
    res.redirect('/courses');
});


router.get('/:id', async (req, res) =>{
    const course = await Course.getById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course,
    });
})
export default router;