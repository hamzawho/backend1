const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  // host: '13.60.192.9',
  user: 'root', 
  password: 'hamza', 
  database: 'rockhairsaloon',
  // port: 3306  
});


// Connect to the database
db.connect( (err) => { // Notice the parentheses after 'connect'
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

app.get('/', (req, res) => {
   return res.json(" BACKENNNND SIDE");
});

app.get('/getusers', (req, res) => {
   const sql = 'SELECT * FROM `user` ORDER BY id DESC';
   db.query(sql, (err, data) => {
      if (err) return res.json(err);

      // Format the date before sending it back
      const formattedData = data.map(user => ({
         id: user.id,
         name: user.name,
         age: user.age,
         Death: new Date(user.Death).toLocaleDateString('en-GB') // Format the date as 'YYYY-MM-DD'
      }));

      return res.json(formattedData);
   });
});;

app.post('/saveuser', (req, res) => {
   const body = req.body;
   const sql = `INSERT INTO user (name, age, Death) VALUES (?, ?, ?)`;
   const values = [body.name, body.age, body.Death];

   db.query(sql, values, (err, results) => {
      if (err) {
         console.log(err);
         res.status(500).json({ status: 'error' });
      } 
      else {
         res.status(200).json({ status: 'inserted' });
      }
   });
});

app.delete('/delete', (req, res) => {
   const id = req.query.id;
   const sql = 'DELETE FROM user WHERE id = ?';
   const values = [id];

   db.query(sql, values, (err, result) => {
      if (err) 
      {
         console.log(err);
         res.status(500).json({ status: 'error' });
      } 
      else {
         if (result.affectedRows > 0)
          {
            res.status(200).json({ status: 'deleted' });
         }
      }
   });
});

// app.put('/update', (req, res) => {
//    const id = req.query.id;
//    const body = req.body;
 
//    const sql = `UPDATE user SET name=?, age=?, Death=? WHERE id=?`;
//    const values = [body.name, body.age, body.Death, id];
 
//    db.query(sql, values, (err, result) => {
//      if (err) {
//        console.log(err);
//        res.status(500).json({ status: 'error' });
//      } else {
//        if (result.affectedRows > 0) {
//          res.status(200).json({ status: 'updated' });
//        } else {
//          res.status(404).json({ status: 'not found' });
//        }
//      }
//    });
//  });

app.put('/update', (req, res) => {
  const id = req.query.id;
  const body = req.body;
  
  if (!id || !body.name || !body.age || !body.Death) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const sql = `UPDATE user SET name='${body.name}', age=${body.age}, Death='${body.Death}' WHERE id=${id}`;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ status: 'updated' });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  });
});
app.listen(8083, () => {
   console.log("LISTENING");
});
