//const uuid = require('uuid')
const { v4: uuidv4 } = require('uuid')

const fs = require('fs')
const path = require('path')

class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuidv4()
    }

    //Helper функция, возвращает результат работы фунции
    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    //при редактировании необходимо обновить курс
    static async update(course) {
        const courses = await Course.getAll()

        const idx = courses.findIndex(c => c.id === course.id)
        courses[idx] = course

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..','data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject (err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    //Функция для сохранения вводимых данных при добавлении курса
    async save() {
        const courses = await Course.getAll() //получаем результат из функции getAll
        courses.push(this.toJSON()) //массиву courses добавляем объект this.toJSON

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..','data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject (err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    //Статический метод для получения всех вводимых данных, читаем файл
    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'), //путь где лежит файл с данными
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
    
                }
            )
        })
        
    }

    //Получаем отдельный курс
    static async getById(id) {
        const courses = await Course.getAll()
        return courses.find(c => c.id === id)
    }
}

module.exports = Course