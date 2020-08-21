// import express
const express = require("express");
const app = express();

// import bodyParser
const bodyParser = require("body-parser");
const {
  request
} = require("express");

// import mongoDb
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const DBUrl = "mongodb://127.0.0.1:27017/";
const DBName = "arkademy";

// membuat objek koneksi database
let dbo = null;

// koneksi mongoClient dengan dburl
MongoClient.connect(DBUrl, (err, db) => {
  if (err) throw err;
  dbo = db.db(DBName);
});

// agar bodyparser bisa dieksekusi harus diletakkan diatas endpoint lainnya (diatas get dsb)
app.use(bodyParser.urlencoded({
  extended: false
}));

// menampilkan data
app.get("/siswa", (req, res) => {
  dbo
    .collection("siswa")
    .find()
    .toArray((err, ress) => {
      // jika error maka kembalikan ke node js
      if (err) throw err;
      res.json(ress);
    });
});

// nulis parameter itu pake :namaParameter
app.get("/siswa/:id", (req, res) => {
  let id = req.params.id;
  let id_object = new ObjectID(id);

  dbo.collection("siswa").findOne({
    "_id": id_object
  }, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// mengirimkan data
app.post("/siswa", (req, res) => {
  let namaSiswa = req.body.nama;
  let alamatSiswa = req.body.alamat;

  dbo
    .collection("siswa")
    .insertOne({
      nama: namaSiswa,
      alamat: alamatSiswa
    }, (err, ress) => {
      if (!err) {
        res.json(ress);
        ress.end("Data berhasil diinput!");
      } else {
        throw err;
      }
    });
});

// delete data
app.delete("/siswa/:id", (req, res) => {
  let id = req.params.id;
  let id_object = new ObjectID(id);

  dbo.collection("siswa").deleteOne({
    _id: id_object
  }, (err, ress) => {
    if (err) throw err;
    res.json(ress)
  })
});

// put untuk mengupdet data
app.put("/siswa/:id", (req, res) => {
  let id = req.params.id;
  let id_object = new ObjectID(id);
  let namaSiswa = req.body.nama;
  let alamatSiswa = req.body.alamat;

  dbo.collection("siswa").updateOne({
    "_id": id_object
  }, {
    $set: {
      nama: namaSiswa,
      alamat: alamatSiswa
    }
  }, (err, ress) => {
    if (err) throw err
    res.json(ress)
  })
});

// untuk menjalankan perintah di port 8080
app.listen("8080", (e) => console.log(e));