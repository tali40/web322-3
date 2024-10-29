/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Ali taheri
Student ID: 163955230
Date: 10 29 2024
Replit Web App URL: 
GitHub Repository URL: 

********************************************************************************/

const fs = require("fs");

var itemsArray = [];
var categoriesArray = [];

var pathToItems = "./data/items.json";
var pathToCat = "./data/categories.json";

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToItems, "utf8", (err, jsonString) => {
      if (err) {
        return reject("Unable to read ITEMS file");
      }

      try {
      
        itemsArray = JSON.parse(jsonString);

        fs.readFile(pathToCat, "utf-8", (err, jsonString) => {
          if (err) {
            return reject("Unable to read CATEGORIES file");
          }
          try {
           
            categoriesArray = JSON.parse(jsonString);
            resolve("Initialization successfull!");
          } catch (error) {
            reject("Unable to parse CATEGORIES file");
          }
        });
      } catch (error) {
        reject("Unable to parse ITEMS file");
      }
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    itemsArray.length === 0
      ? reject("no results returned!")
      : resolve(itemsArray);
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = itemsArray.filter((item) => item.published);
    publishedItems.length === 0
      ? reject("no results returned")
      : resolve(publishedItems);
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    categoriesArray.length == 0
      ? reject("no results returned")
      : resolve(categoriesArray);
  });
}


function addItem(itemData) {
  return new Promise((resolve, reject) => {
    if (itemData.published === undefined) {
      itemData.published = false;
    } else {
      itemData.published = true;
    }
    itemData.id = itemsArray.length + 1;
    itemsArray.push(itemData);
    resolve(itemData);
  });
}

function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredItems = itemsArray.filter(
      (item) => item.category == category
    );
    filteredItems.length === 0
      ? reject("no results returned")
      : resolve(filteredItems);
  });
}

function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const filteredItems = itemsArray.filter(
      (item) => new Date(item.postDate) >= minDate
    );
    filteredItems.length === 0
      ? reject("no results returned")
      : resolve(filteredItems);
  });
}

function getItemById(id) {
  return new Promise((resolve, reject) => {
    const item = itemsArray.find((item) => item.id == id);
    item ? resolve(item) : reject("item not found");
  });
}

initialize()
  .then((message) => {
    console.log(message); 
    return getAllItems();
  })
  .then((items) => {
    console.log("All items: ", items);
    return getPublishedItems();
  })
  .then((publishedItems) => {
    console.log("Published items: ", publishedItems);
    return getCategories();
  })
  .then((categories) => {
    console.log("Categories: ", categories);
  })
  .catch((err) => {
    console.error(err);
  });


module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
};
