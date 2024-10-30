/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Ali taheri
Student ID: 163955230
Date: 10 29 2024
Replit Web App URL: 
GitHub Repository URL: 

********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const storeService = require("./store-service"); 
const cloudinary = require("./cloudinaryConfig");
const multer = require("multer");
const streamifier = require("streamifier");
const upload = multer();

const HTTP_PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});


app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});


app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});


app.get("/shop", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "shop.html"));
});


app.get("/api/shop", (req, res) => {
  storeService
    .getPublishedItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});


app.get("/items", (req, res) => {
  const { category, minDate } = req.query;

  if (category) {
    storeService.getItemsByCategory(category)
      .then(data => res.json(data))
      .catch(err => res.json({ message: err }));
  } else if (minDate) {
    storeService.getItemsByMinDate(minDate)
      .then(data => res.json(data))
      .catch(err => res.json({ message: err }));
  } else {
    storeService.getAllItems()
      .then(data => res.json(data))
      .catch(err => res.json({ message: err }));
  }
});


app.get("/item/:id", (req, res) => {
  storeService.getItemById(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.json({ message: err }));
});


app.get("/api/items", (req, res) => {
  storeService
    .getAllItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/categories.html"));
});


app.get("/api/categories", (req, res) => {
  storeService
    .getCategories()
    .then((data) => {
     
      res.json(data);
    })
    .catch((err) => {
     
      res.json({ message: err });
    });
});


app.get("/items/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addItem.html"));
});


app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;


    res.redirect("/items");
  }
});


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});


storeService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on port: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to initialize data: ", err);
  });