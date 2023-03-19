const express = require('express');
const morgan = require("morgan");
const users = require('./users');
// note: body-parser untuk ExppressJS versi 4.16-
/*
const bodyParser = require('body-parser'); // request body
*/
const multer = require("multer"); // file upload
const fs = require("fs"); // mengubah nama file yg di upload
const path = require('path');
const storage = multer.diskStorage({
    // menentukan lokasi penyimpanan file
    destination: (req, file, callback) => {
        callback(null, 'assets/') // file disimpan dalam folder assets
    },
    // mengganti nama file - file yg diupload akan diubah namanya
    filename: (req, file, callback) => {
        console.log(file)
        callback(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Endpoint untuk mengupload file
// routers.post("/upload", upload.single("file"), (req, res) => {
//     res.send(req.file);
// });

app.get("/upload", (req, res) => {
    res.send("Halaman upload");
})

app.post("/upload", upload.single("image"), (req, res) => {
    const fileName = req.file.filename;
    console.log('File yang diunggah:', fileName);
    res.send("file berhasil diupload")
});

// app.use(express.static(path.join(__dirname, "public")));
// app.post("/upload", upload.single("file"), (req, res) => {
//     const file = req.file;
//     if (file){
//         const target = path.join(__dirname, "public", file.originalname);
//         fs.renameSync(file.path, target);
//         res.send("file berhasil diupload");
//     } else{
//         res.send("file gagal diupload");
//     }
// });

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

// Endpoint untuk menambahkan data user
app.post("/users", (req, res) => {
    const { id, name } = req.body;
    const newUser = { id, name };
    users.push(newUser);
    res.json(`Berhasil menambahkan username: ${name}, dan id: ${id}`);
});

// Penanganan routing 404
app.use((req, res, next) => {
    res.status(404).json({
      status: "error",
      message: "resource tidak ditemukan",
    });
});
  
// Penanganan error handling
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "terjadi kesalahan pada server",
    });
});

// Menangani Request Body
    // note: ExppressJS versi 4.16-
    // parse x-www-form-url-encode
    /*
    app.use(bodyParser.urlencoded({ extended: true }))
    */
    // parse JSON
    /*
    app.use(bodyParser.json())
    */
    // note: ExppressJS versi 4.16+ built-in
    // parse x-www-form-url-encode
    app.use(express.urlencoded({ extended: true }))
    // parse JSON
    app.use(express.json())

// app.post('/login', (req, res) => {
//     const { username, password } = req.body
//     res.send(`Anda login dengan username ${username} dan password ${password}`)
// });

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
});
