var express = require('express');
var router = express.Router();
import * as db from '../database/database';

/* GET users listing. */
router.post('/registerProduct', (req, res) => {
  const productDetails = {
    ProductName: req.body.ProductName,
    Price: req.body.Price,
    Seller: req.body.Seller,
    Quantity: req.body.Quantity,
    Desc: req.body.Desc,
    Rating: req.body.Rating
  };
  db.registerProduct(productDetails).then((data) => {
    res.status(200).json({ data });
  }).catch((err) => {
    res.status(500).json({error: err })
  })
});

router.post('/updateProductDetails', (req, res) => {
  if (req.body && req.body.updates) {
    db.updateProductDetails({ updates: req.body.updates, productId: req.body.productId })
      .then((data) => {
        res.status(200).json({ data });
      }).catch((err) => {
        res.status(500).json({ error: err });
      })
  }
});

router.delete('/deleteProduct', (req, res) => {
  if (req.body && req.body.productId) {
    db.deleteProduct({ productId: req.body.productId })
      .then((data) => {
        res.status(200).json({ data });
      }).catch((err) => {
        res.status(500).json({ error: err });
      })
  }
});

export { router }
