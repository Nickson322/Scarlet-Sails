const express = require('express');
const app = express();
app.use(express.static('public'));
const hbs = require('hbs');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser')

app.set('views','views');
app.set('view engine','hbs');

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


// Назначение серверу порта и запуск сервера
const port = 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}/sign`);
});

//установка соединения
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3308',
  database: 'residential_complex'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Соединение с базой данных успешно установлено!');
});



//Обработчики маршрута для GET-запроса
app.get('/', (req, res) => {
  let {firstName, lastName, id_user} = req.session.user;
  let sql1 = `SELECT * FROM booking WHERE booking.id_user = '${id_user}'`;
  let sql2 = `SELECT * FROM offers INNER JOIN users ON offers.id_user = users.id_user`;
  let values = [firstName, lastName];


  let booking = [];
  let offers = [];
  connection.query(sql1, values, (err, result1) => { 
    booking = result1; 

    for(let i = 0; i < booking.length; i++){
      let year = booking[i].booking_date.getFullYear();
      let month = booking[i].booking_date.getMonth() + 1;
      let day = booking[i].booking_date.getDate();

      booking[i].booking_date = `${year}.${month}.${day}`;
    }

    connection.query(sql2, (err, result2) => {
      offers = result2;

      for(let i = 0; i < offers.length; i++){
        let year = offers[i].placement_date.getFullYear();
        let month = offers[i].placement_date.getMonth() + 1;
        let day = offers[i].placement_date.getDate();
  
        offers[i].placement_date = `${year}.${month}.${day}`;
      }

      res.render(`index`, {
        firstName: values[0],
        lastName: values[1],
        booking: booking,
        offers: offers
    });

  
    });
  });


});
//Страница авторизации
app.get('/sign', (req, res) => {



  res.render(`sign`);
});

// app.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect('/sign');
//     }
//   });
// });


app.get('/register', (req, res) => {



  res.render(`register`);
});

app.get('/booking', (req, res) => {



  res.render(`booking`);
});

app.get('/offers', (req, res) => {



  res.render(`offers`);
});

app.get('/profile', (req, res) => {
  let {firstName, lastName, flat_num} = req.session.user;




  res.render(`profile`, {
    firstName: firstName,
    lastName: lastName,
    flat_num: flat_num
  });
});





//проверка правильности введенного пароля 
app.post('/sign', (req, res) => { 
  let { log, pass } = req.body;
  let sql = 'SELECT * FROM users WHERE log = ? AND pass = ?'; 
  let values = [log, pass];

  connection.query(sql, values, (err, result) => {
    // if (err) throw err; 

    // res.send(result.length > 0); 

    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (result.length === 0) {
      res.sendStatus(401); // Неавторизованный доступ
    } else {
      const user = result[0];

      // Сохранение информации о пользователе в сессии
      req.session.user = user;
      res.sendStatus(200); // Успешная авторизация
    }
    
  }); 
});


//Для пользователей
app.post('/register', (req, res) => { 
  let { log, pass, firstName, lastName, flat_num} = req.body; 

  let sql = 'INSERT INTO users (log, pass, firstName, lastName, flat_num) VALUES (?, ?, ?, ?, ?)'; 

  let values = [log, pass, firstName, lastName, flat_num];
  connection.query(sql, values, (err, result) => { 
    if (err) throw err; 
    res.send('Пользователь успешно зарегистрирован'); 
  }); 
});





//Роуты страниц
//1. Бронирования
app.get('/booking', (req, res) => {
  res.render('booking');
})



//2. Предложения
app.get('/offers', (req, res) => {
  res.render('offers');
})

