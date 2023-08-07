import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";

const app = express();

try {
    app.use(express.static("public"));
} catch(err) {
  res.status(500).send(err.message);
  }
//get client token
app.post("/api/token", async (req, res) => {
  try {
    const token= await paypal.generateClientToken();
    res.json(token);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/success',async(req,res) => {
if(req.query.liability_shift==true || req.query.liability_shift=='UNKNOWN');
res.sendFile('./public/success.html', {root:'.'});
});
// create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(8888);
