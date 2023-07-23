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
  console.log(`http://localhost:${port}`);
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


let users_arr = [];
//Обработчики маршрута для GET-запроса
app.get('/', (req, res) => {

  let sql = 'SELECT * FROM users';
  connection.query(sql, (err, result) => { 
    users_arr = result; 
  });

  res.render(`index`, {
    users_arr: users_arr,
  });

  console.log(req.session);
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

app.get('/profile', (req, res) => {
  const user = req.session.user; // Получение информации о пользователе из объекта сессии
  if (user) {
    // Действия, которые вы хотите выполнить с информацией о пользователе
    res.send(`Привет, ${user.username}! Ваш email: ${user.email}`);
  } else {
    res.sendStatus(401); // Неавторизованный доступ
  }
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

//Создание предложения
app.post('/create_offer', (req, res) => {
  
})