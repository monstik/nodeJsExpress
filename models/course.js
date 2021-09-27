import {v4 as uuidv4} from 'uuid';
import fs from "fs";
import path from 'path';
import {fileURLToPath} from 'url';
import e from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class Course {
    constructor(title, price, image) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.id = uuidv4();
    }

    toJSON() {
        return ({
            title: this.title,
            price: this.price,
            image: this.image,
            id: this.id,
        });
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON());

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '../data/courses.json'),
                JSON.stringify(courses),
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve()
                    }
                })
        })
    }

    static async update(course){

        const courses = await Course.getAll();
        const index = courses.findIndex(c => c.id === course.id);
        courses[index] = course;


        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '../data/courses.json'),
                JSON.stringify(courses),
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve()
                    }
                })
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            console.log(path.join(__dirname, '../data/courses.json'));
            fs.readFile(
                path.join(__dirname, '../data/courses.json'),
                'utf-8',
                (error, content) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(JSON.parse(content));
                    }
                }
            )

        });
    }

    static async getById(id){
        const courses = await Course.getAll();
        return courses.find(c => c.id === id);
    }
}

export default Course;