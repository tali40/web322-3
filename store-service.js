const fs = require('fs');
const path = require('path');

let itemsArray = [];
let categoriesArray = [];

const pathToItems = path.join(__dirname, 'data', 'items.json');
const pathToCategories = path.join(__dirname, 'data', 'categories.json');

function initialize() {
    return Promise.all([loadItems(), loadCategories()]);
}

function loadItems() {
    return new Promise((resolve, reject) => {
        fs.readFile(pathToItems, 'utf8', (err, data) => {
            if (err) {
                return reject("Unable to read items.json");
            }
            try {
                itemsArray = JSON.parse(data);
                resolve();
            } catch (error) {
                reject("Error parsing items.json");
            }
        });
    });
}

function loadCategories() {
    return new Promise((resolve, reject) => {
        fs.readFile(pathToCategories, 'utf8', (err, data) => {
            if (err) {
                return reject("Unable to read categories.json");
            }
            try {
                categoriesArray = JSON.parse(data);
                resolve();
            } catch (error) {
                reject("Error parsing categories.json");
            }
        });
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        itemsArray.length === 0
            ? reject("No results returned!")
            : resolve(itemsArray);
    });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = itemsArray.filter(item => item.published);
        publishedItems.length === 0
            ? reject("No results returned")
            : resolve(publishedItems);
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        categoriesArray.length === 0
            ? reject("No results returned")
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
        itemData.id = itemsArray.length + 1; // Adjust ID assignment as needed
        itemsArray.push(itemData);
        resolve(itemData);
    });
}

function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = itemsArray.filter(item => item.category === category);
        filteredItems.length === 0
            ? reject("No results returned")
            : resolve(filteredItems);
    });
}

function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredItems = itemsArray.filter(item => new Date(item.postDate) >= minDate);
        filteredItems.length === 0
            ? reject("No results returned")
            : resolve(filteredItems);
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = itemsArray.find(item => item.id == id);
        item ? resolve(item) : reject("Item not found");
    });
}

// Initialize and log results
initialize()
    .then(() => {
        console.log("Initialization successful!");
        return getAllItems();
    })
    .then(items => {
        console.log("All items:", items);
        return getPublishedItems();
    })
    .then(publishedItems => {
        console.log("Published items:", publishedItems);
        return getCategories();
    })
    .then(categories => {
        console.log("Categories:", categories);
    })
    .catch(err => {
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
