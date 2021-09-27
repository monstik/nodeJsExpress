import {Router} from "express";
import Course from "../models/course.js";

const router = Router();

router.get('/',(req, res) =>{
    res.render('add',{
        title: 'Добавить курсы',
        isAdd: true,
    });
});

router.post('/', async (req, res)=>{
    const course = new Course(req.body.title, req.body.price, req.body.image);

   await course.save();



    res.redirect('/courses');
})

export default router;