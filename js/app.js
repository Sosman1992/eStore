const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'estore-database.c5zmihuupuqo.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '0549954089',
  database: 'estore-database'
});

pool.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB');
    conn.query('SELECT * FROM product')
      .then(rows => {
        console.log(rows); // log the retrieved data to the console
      })
      .catch(err => {
        console.log('Error fetching data: ' + err);
      })
      .finally(() => {
        conn.release(); // release the database connection
      });
  })
  .catch(err => {
    console.log('Error connecting to database: ' + err);
  })
  .finally(() => {
    pool.end(); // close the database connection pool
  });


// Get a reference to the table body element
const tbody = document.getElementById('tbody');

// Get a reference to the product template row
const productTemplate = document.getElementById('product-template');

// Function to retrieve the products from the database and add them to the table
function displayProducts() {
  // Clear the current table rows
  tbody.innerHTML = '';

  // Query the database for all products
  connection.query('SELECT * FROM products', function(error, results) {
    if (error) {
      // Display an error message if there was an error retrieving the products
      console.error(error);
      document.getElementById('notfound').textContent = 'Error retrieving products.';
      return;
    }

    // If there are no products, display a message in the table
    if (results.length === 0) {
      document.getElementById('notfound').textContent = 'No products found.';
      return;
    }

    // For each product, create a new row in the table using the product template
    results.forEach(function(product) {
      // Clone the product template row and make it visible
      const newRow = productTemplate.cloneNode(true);
      newRow.removeAttribute('style');

      // Set the text content of the row's cells to the product data
      newRow.querySelector('.product-id').textContent = product.id;
      newRow.querySelector('.product-name').textContent = product.name;
      newRow.querySelector('.product-seller').textContent = product.seller;
      newRow.querySelector('.product-price').textContent = product.price;

      // Add an event listener to the Edit button that will display the product data in the form
      newRow.querySelector('.btn-edit').addEventListener('click', function() {
        document.getElementById('userid').value = product.id;
        document.getElementById('proname').value = product.name;
        document.getElementById('seller').value = product.seller;
        document.getElementById('price').value = product.price;
      });

      // Add an event listener to the Delete button that will remove the product from the database and the table
      newRow.querySelector('.btn-delete').addEventListener('click', function() {
        connection.query('DELETE FROM products WHERE id = ?', [product.id], function(error, result) {
          if (error) {
            console.error(error);
            return;
          }
          newRow.remove();
        });
      });

      // Append the new row to the table
      tbody.appendChild(newRow);
    }); // <-- Add this closing parenthesis and curly brace
  });
}
