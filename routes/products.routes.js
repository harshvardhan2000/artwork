const express = require('express');
const productsController = require('../controllers/products.controller')
const router = express.Router();

router.get('/products', productsController.getAllProducts)

router.get('/sold-product', function (req, res) {
  res.render('customer/products/sold-product');
})

router.get('/products/:id', productsController.getProductDetails);


// router.get('/', function (req, res) {
//   res.render('../views/shared/includes/home.ejs');
// })


module.exports = router;