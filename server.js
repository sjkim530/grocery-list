const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Create SQLite database connection
const db = new sqlite3.Database('shopping_list.db');

// Create table to store shopping list items
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, found BOOLEAN)");
});

app.use(bodyParser.json());

// Define a default GET route for the root path "/"
app.get('/', (req, res) => {
    res.send('Server is running!'); // Send a simple text response
});

// API endpoint to get the current shopping list
app.get('/shopping_list', (req, res) => {
    db.all("SELECT * FROM shopping_list", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ shopping_list: rows });
    });
});

// API endpoint to update item status
app.post('/update_item_status/:id', (req, res) => {
    const { id } = req.params;
    const { found } = req.body;
    db.run("UPDATE shopping_list SET found = ? WHERE id = ?", [found, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Item status updated successfully" });
    });
});

// API endpoint to add items to the shopping list
app.post('/add_items', (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
      res.status(400).json({ error: "Invalid request format. 'items' must be an array." });
      return;
  }

  // Prepare SQL statement to insert items into the shopping list
  const stmt = db.prepare("INSERT INTO shopping_list (item, found) VALUES (?, ?)");
  items.forEach(item => {
      stmt.run(item, false); // Initialize found status to false for each item
  });
  stmt.finalize();

  res.json({ message: "Items added successfully" });
});

// API endpoint to delete an item from the shopping list
app.delete('/delete_item/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM shopping_list WHERE id = ?", id, function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ message: "Item deleted successfully" });
  });
});

// API endpoint to reset the shopping list
app.delete('/reset_list', (req, res) => {
  db.run("DELETE FROM shopping_list", function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ message: "Shopping list reset successfully" });
  });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

