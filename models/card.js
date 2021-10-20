const path = require('path')
const fs = require('fs')

//Объект для получения пути от абсолютного пути, сгенерированный заранее путь, который мы будем использовать в методе fetch
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'card.json'
)

class Card {
    static async add(course) {
        //получаем всю корзину, смотрим, что в ней находится
        const card = await Card.fetch()
        
        //Пытаемся по индексу найти курс в корзине
        const idx = card.courses.findIndex(c => c.id === course.id)
        //проверяем в переменной существует ли такой курс 
        const candidate = card.courses[idx]

        if (candidate) {
            //курс уже есть
            candidate.count++
            card.courses[idx] = candidate
        } else {
            //нужно добавить
            course.count = 1
            card.courses.push(course)
        }

        //Указываем общую сумму у карточки курса
        card.price += +course.price
         
        //Необходимо записать это все обратно в JSON файл
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    //Реализовываем метод ремув
    static async remove(id) {
        //Получаем данные карты из базы данных
        const card = await Card.fetch()

        //Получаем индекс данного курса
        const idx = card.courses.findIndex(c => c.id === id)
        //Кладем его в отдельную переменную
        const course = card.courses[idx]

        //Если количество курсов 1, то удаляем
        if (course.count === 1) {
            //удалить
            //обновляем массив курсов
            card.courses = card. courses.filter(c => c.id !== id)
        } else {
            //изменить количество
            card.courses[idx].count--
        }

        //пересчитываем цену
        card.price -= course.price

        //перезаписываем то что получилось в корзину
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    //Получаем данные из корзины
    static async fetch() {
       return new Promise((resolve, reject) => {
           fs.readFile(p, 'utf-8', (err, content) => {
               if (err) {
                   reject(err)
               } else {
                   resolve(JSON.parse(content))
               }
           })
       }) 
    }
}


module.exports = Card