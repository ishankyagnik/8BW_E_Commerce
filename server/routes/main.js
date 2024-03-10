const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Recent = require('../models/Recent');
const Featured = require('../models/Featured');
const Register = require('../models/register');
const Cart = require('../models/Cart');

const mainLayout = '../views/layouts/main';

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    res.render('index', { 
      currentRoute: '/',
      layout: mainLayout
    });

  } catch (error) {
    console.log(error);
  }

});
router.get('/signup', async (req, res) => {
  try {
    res.render('register', { 
      currentRoute: '/signup',
      layout: mainLayout
    });

  } catch (error) {
    console.log(error);
  }

});router.get('/signin', async (req, res) => {
  try {
    res.render('login', { 
      currentRoute: '/signin',
      layout: mainLayout
    });

  } catch (error) {
    console.log(error);
  }

});

/**
 * GET /
 * SHOP
*/
router.get('/shop', async (req, res) => {
  try {
    const data = await Product.find();
    res.render('shop', { 
      currentRoute: '/shop',
      layout: mainLayout,
      data
    });

  } catch (error) {
    console.log(error);
  }
  
});

/**
 * GET /
 * CART
*/
router.get('/cart', async (req, res) => {
  try {
    const data = await Cart.find();
    res.render('cart', { 
      currentRoute: '/cart',
      layout: mainLayout,
      data
    });

  } catch (error) {
    console.log(error);
  }
  
});

/**
 * GET /
 * PRODUCT BY ID
*/
router.get('/product/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Product.findById({ _id: slug });

    const locals = {
      title: data.title
      }

    res.render('shoes', { 
      locals,
      data,
      currentRoute: `/shoes/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});

router.post('/addToCart', async (req, res) => {
  try {
    try {

      const newItem = await new Cart({
        title: req.params.title,
        body: req.params.body,
        price: req.params.price,
        discountPrice: req.params.discountPrice,
        img: req.params.img
      });

      await Cart.create(newItem);
      res.redirect('/cart');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});
router.post("/register", async (req, res) => {
  const dataToSave = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password
  }
  const { email } = req.body;
  const { password } = req.body;
  const { confirm_password } = req.body;

  try {
      const existingUser = await Register.findOne({ email }).exec();
      const existingpassword = await Register.findOne({ password }).exec();
      const existingconf_pass = await Register.findOne({ confirm_password }).exec();
      if (!existingUser && existingpassword === existingconf_pass) {
          Register.create(dataToSave)
          return res.redirect('/signin');
      }
      else {

          return res.redirect('/signup')
      }
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
})
router.post("/login", (req, res) => {
  const submittedEmail = req.body
  Register.findOne({ email:submittedEmail.email })
      .then(existingUser => {
          if (existingUser) {
              if (existingUser.password === submittedEmail.password) {
                  res.redirect('/');
                  return
              } else {
                  console.log("andar")
                  res.redirect('/signin')
                  return;
              }
          }
          else {
              console.log("bahar")
              res.redirect('/signin')
              return;
          }
      })
      .catch(error => {
          return res.status(500).json({ message: 'Internal server error', error: error.message });
      })
})
module.exports = router;