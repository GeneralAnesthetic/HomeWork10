require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.MySQL_User,

  // Your password
  password: process.env.MySQL_Password,
  database: "bamazon_DB"
});
// connection.connect(err, res){console.log("[mysql error]", err);
function start() {
  connection.connect(function(err, res) {
    console.log("[mysql error]", err);
    displayItems();
  });
}
function displayItems() {
  var choiceArray = [];
  var query = "SELECT product_name, department_name, item_id FROM products";
  //Group by to display only prodcut ids and names
  connection.query(query, function(err, res) {
    console.table(res);
    for (var i = 0; i < res.length; i++) {
      choiceArray.push(res[i].product_name);
    }
    promptCustomer(choiceArray);
  });
}
function promptCustomer(itemChioces) {
  inquirer
    .prompt([
      {
        name: "purchasedItem",
        type: "list",
        message: "What would you like to buy?",
        choices: itemChioces
      },
      {
        type: "input",
        message: "How many would you like to buy?",
        name: "purchasedQuantity",
        validate: function(value2) {
          if (isNaN(value2) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answers) {
      // console.log(answers);
      checkAvailability(answers.purchasedItem, answers.purchasedQuantity);
    });
}
function checkAvailability(item, purchasedQuantity) {
  connection.query(
    "SELECT stock_quantity, price FROM products WHERE product_name=?",
    [item],
    function(error, results) {
      if (error) throw error;
      // console.log(results);
      var itemsLeft = results[0].stock_quantity;
      var itemPrice = results[0].price;
      var totalSale = itemPrice * purchasedQuantity;
      var updatedInventory = itemsLeft - purchasedQuantity;
      if (updatedInventory >= 0) {
        console.log(
          "Congradulations you just bought " +
            purchasedQuantity +
            " " +
            item +
            " for $" +
            totalSale
        );
        updateDB(updatedInventory, item);
      } else {
        console.log("Sorry, insufficient quantity!");
        continuePrompt();
      }
    }
  );
}
// var newInventory = "Hello";
function updateDB(newInventory, item) {
  // console.log(newInventory);
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newInventory
      },
      {
        product_name: item
      }
    ],
    function(error, results) {
      if (error) throw error;
      continuePrompt();
    }
  );
}

function continuePrompt() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to continue shopping?",
        name: "continue"
      }
    ])
    .then(function(answer) {
      if (answer.continue) {
        displayItems();
      } else {
        console.log("Thank you for shopping, please come again!");
        connection.end();
      }
    });
}
start();
// function inquire() {
//   inquirer
//     .prompt({
//       name: "name",
//       type: "input",
//       message: "What particular item ID (1-9) you are interested in?",
//       validate: function(value) {
//         if (isNaN(value) === false) {
//           return false;
//         }
//         return true;
//       }
//     })
//     .then(function(answer) {
//       var query = "SELECT product_name, price FROM products WHERE item_id = ?";
//       connection.query(query, [answer.name], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Price for item selected: " +
//               res[i].product_name +
//               " = " +
//               res[i].price
//           );
//         }
//       });
//       new function inquire() {
//         inquirer.prompt({
//           name: "name2",
//           type: "input",
//           message: "How many units of the product are interested in?",
//           validate: function(value2) {
//             if (isNaN(value2) === false) {
//               return true;
//             }
//             return false;
//           }.then(function(answer2) {
//             var query2 =
//               "SELECT stock_quantity FROM products WHERE item_id = ? IF(stock_quantity >= ?, 'We have sufficient quantities of your selection!','We do not have sufficient quanities of your selection available!')";

//             // SELECT stock_quantity (CASE item_id = ? WHEN 1 THEN 1 ELSE 0 END) as FIRST_USER FROM USER
//             //   "SELECT stock_quantity FROM products WHERE item-id = ? HAVING count(*) > 1";
//             connection.query(query2, [answer.name, answer2.name2], function(
//               error,
//               response
//             ) {
//               for (var y = 0; y < response.length; y++) {
//                 if (response[i].stock_quantity >= answer2.name2) {
//                   console.log(
//                     "Stock quantity for item selected: " +
//                       response[y].stock_quantity
//                   ),
//                     function updateProduct() {
//                       var query3 = "UPDATE products SET stock_quantity";
//                       connection.query(query3, [answer2.name2], function(
//                         err2,
//                         res2
//                       ) {
//                         console.log(
//                           "And this many items remain: " +
//                             response[y].stock_quantity -
//                             answer2.name2
//                         );
//                       });
//                     };
//                 } else {
//                   inquire();
//                 }

//                 var query4 = "SELECT * FROM products";
//                 onnection.query(query4, function(err2, res2) {
//                   console.log(res);
//                 });
//               }
//             });
//           })
//         });
//       }();
//     });
// }
// start();

// //       });
// // }

// //if(answer){
// //  var query = "SELECT price FROM products";
// //connection.query(query, {price: answer.price}, function(err, res) {
// //for (var i = 0; i < res.length; i++) {
// //console.log("Price for item selected: " + res[i].price);

// //   //Group by to display only prodcut ids and names
// //   connection.query(query, function(err, res) {
// //     if (err) throw error;
// //     {
// //       console.log(res);
// //     }
// //             //take that number and draw the product info attached to that number and display

// //         }
// //       )
// //       .prompt({
// //         type: "input",
// //         name: "name",
// //         message:
// //           "What is the quantity of the product you are searching for jerkface?"
// //       })
// //       .then(function(answer) {});
// //   });
// // }}

// //         switch (answer.action) {
// //         case "Find songs by artist":
// //           artistSearch();
// //           break;

// //         case "Find all artists who appear more than once":
// //           multiSearch();
// //           break;

// //         case "Find data within a specific range":
// //           rangeSearch();
// //           break;

// //         case "Search for a specific song":
// //           songSearch();
// //           break;

// //         case "Find artists with a top song and top album in the same year":
// //           songAndAlbumSearch();
// //           break;
// //         }
// //       });
// //   }
