const express = require('express');
const app = express();
app.use(express.static('public'));
const hbs = require('hbs');
const mysql = require('mysql2');
const session = require('express-session');

app.set('views','views');
app.set('view engine','hbs');

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));


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
// Обработчик маршрута для GET-запроса на корневой маршрут
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

app.get('/register', (req, res) => {
  res.render(`register`);
});



//проверка правильности введенного пароля 
app.post('/sign', (req, res) => { 
  let { login, password } = req.body;
  let sql = 'SELECT * FROM users WHERE login = ? AND password = ?'; 
  let values = [login, password];

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
  let { name, email, password } = req.body; 

  let sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'; 

  let values = [name, email, password];
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