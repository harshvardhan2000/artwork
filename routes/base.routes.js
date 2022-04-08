const express = require('express');

const router = express.Router();

router.get('/product', function (req, res) {
  res.redirect('/products');
});
router.get('/401', function (req, res) {
  res.status(401).render('shared/401');
});
router.get('/403', function (req, res) {
  res.status(403).render('shared/403');
});

router.get('/', function (req, res) {
  res.render('home/home');
})
router.get('/acrylic', function (req, res) {
  res.render('home/acrylic');
})
router.get('/signature', function (req, res) {
  res.render('home/signature');
})
router.get('/gallery', function (req, res) {
  res.render('home/gallery');
})

module.exports = router;