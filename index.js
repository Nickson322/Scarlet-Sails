let express = require('express');
let app = express();
app.use(express.static('public'));
const hbs = require('hbs');
const mysql = require('mysql2');

app.set('views','views');
app.set('view engine','hbs');

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

      console.log(result);
      users_arr = result; 
    });

    res.render(`index`, {
      users_arr: users_arr
    });
});

app.post('/register', (req, res) => { 
  let { name, email, password } = req.body; 

  let sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'; 

  let values = [name, email, password];
  connection.query(sql, values, (err, result) => { 
    if (err) throw err; 
    res.send('Пользователь успешно зарегистрирован'); 
  }); 
});
