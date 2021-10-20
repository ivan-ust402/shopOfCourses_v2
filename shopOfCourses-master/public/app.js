const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price) 
}
//получаем все элементы с классом price с помощью forEach - обрабатываем каждый элемент node
document.querySelectorAll('.price').forEach(node =>{
   node.textContent = toCurrency(node.textContent)
})

//$card обычно доллором обозначается либо jquery объект, либо HTML элемент
//выясняем есть ли такой div с id="card"
const $card = document.querySelector('#card')

if ($card) {
    $card.addEventListener('click', event => {
        //Проверка клика по кнопке Удалить
        if (event.target.classList.contains('js-remove')) {
        const id = event.target.dataset.id   
        
        
        //Вызываем ajax запрос с клиента и отправляем его на сервер
        fetch('/card/remove/' + id, {
            method: 'delete'
        }).then(res => res.json())
          .then(card => {
              if (card.courses.length) {
                const html = card.courses.map(c => {
                    return `
                    <tr>
                    <td>${c.title}</td>
                    <td>${c.count}</td>
                    <td>
                        <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                    </td>
                </tr>
                    `
                }).join('')
                $card.querySelector('tbody').innerHTML = html
                $card.querySelector('.price').textContent = toCurrency(card.price)
              } else {
                $card.innerHTML = '<p>Корзина пуста</p>'
              }
          })
       } 
    })
}