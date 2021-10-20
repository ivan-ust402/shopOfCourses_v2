//const express.Router = require('express') либо
const {Router} = require('express') //подключаем Router
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная страница',
        isHome: true 
    })
})

module.exports = router //экспортируем наружу объект роутер