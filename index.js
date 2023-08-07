const express = require('express');
const paypal = require('paypal-rest-sdk');

const app = express();

app.get('/', (req, res) => {
  const payment = new paypal.Payment({
    amount: 100,
    currency: 'USD',
    payer: {
      email: 'johndoe@example.com',
    },
  });

  payment.create((err, payment) => {
    if (err) {
      res.send(err);
    } else {
      res.send(payment);
    }
  });
});

app.listen(3000);