import {Router} from "express";
import Card from "../models/card.js";
import Course from "../models/course.js"

const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.getById(req.body.id);
    await Card.add(course);
    res.redirect('/courses');
})

router.get('/', async (req, res) => {
    const card = await Card.fetch();

    res.render('card',{
        title: 'Корзина',
        isCard: true,
        courses: card.courses,
        price: card.price,
    });
})

router.delete('/remove/:id',  async (req, res) => {

    const card = await Card.delete(req.params.id);


    res.status(200).json(card)
})

export default router;