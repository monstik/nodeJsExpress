import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";


const dataPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../data/card.json'
)

class Card {
    static async add(course) {
        const card = await Card.fetch();
        const courseIndex = card.courses.findIndex(c => c.id === course.id);
        const candidate = card.courses[courseIndex];

        if (candidate) {
            candidate.count++;
            card.courses[courseIndex] = candidate;
        } else {
            course.count = 1;
            card.courses.push(course);
        }

        card.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(dataPath, JSON.stringify(card), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            })
        })
    }

    static async delete(id){
        const card = await  Card.fetch();
        const courseIndex = card.courses.findIndex(c => c.id === id)
        const deleteCourse = card.courses[courseIndex];
        console.log(card.courses);
        if(deleteCourse.count > 1){

            card.courses[courseIndex].count--;

        }else{
            card.courses = card.courses.filter(c => c.id !== id);
        }
        card.price -= deleteCourse.price;
        console.log(card.courses);

        return new Promise((resolve, reject) => {
            fs.writeFile(dataPath, JSON.stringify(card), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(card);
                }

            })
        })

    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(dataPath, 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(content));
            })
        })
    }
}

export default Card;