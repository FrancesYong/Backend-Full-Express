const express = require('express');
const morgan = require("morgan");
const users = require('./users');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Endpoint untuk memberikan list data users
app.get("/users", (req, res) => {
    res.json(users);
});

// Endpoint untuk memberikan data user sesuai dengan permintaan client
app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = users.find((u) => u.name.toLowerCase() === name);

    if (!user) {
        return res.status(404).json({
        message: "Data tidak ditemukan"
        });
    }

    return res.send(user);
});

// Penanganan routing 404
app.use((req, res, next) => {
    res.status(404).json({
      status: "error",
      message: "resource tidak ditemukan",
    });
});
  
// Penanganan error
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "terjadi kesalahan pada server",
    });
});

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
});
