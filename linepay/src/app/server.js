require('dotenv').config()
const express = require('express');
var app = express();
const Pay = require("line-pay");
var bodyParser = require('body-parser');
const cache = require("memory-cache");
var logger = require('log4js').getLogger();

const port = process.env.PORT || 6789

const pay = new Pay({
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET_KEY,
    isSandbox: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/healthy', (req,res) => {
    res.status(200).send("LinePay is healthy! Everyone, let`s be nice and respectful to others! by KeisukeYamashita");
})

app.use("/v1/reserve", (req,res) => {
    logger.log("request processing...")
    const body = req.body
    let options = {
        productName: body.item,
        amount: body.amount,
        currency: "JPY",
        confirmUrl: process.env.LINE_PAY_CONFIRM_URL, 
        orderId: body.orderId,
        productImageUrl: body.imageUrl || "https://storage.googleapis.com/jphack2018-219415.appspot.com/logo.JPG"
    }

    logger.info(`reserving payment of item: ${options.productName}, orderId: ${options.orderId}, amount:${options.amount}...`)

    pay.reserve(options)
        .then((response)=> {
            logger.info("reserve successfully finish")

            let reservation = options
            reservation.transactionId = response.info.transactionId;
            reservation.redirectUrl =  body.redirectUrl

            cache.put(reservation.transactionId, reservation);

            res.status(200).json({
                error: "",
                message: {
                    paymentURL: response.info.paymentUrl.app,
                    amount: options.amount,
                    orderId: options.orderId,
                    item: options.productName
                }
            })
        })
        .catch(error => {
            logger.error(error)
            res.status(404).json({
                error: {
                    status: 404,
                    message: error
                }
            })
        })
});


app.get('/v1/confirm', (req, res) => {
    logger.info(`confirming payment...`)
    let reservation = cache.get(req.query.transactionId);

    let confirmation = {
        transactionId: req.query.transactionId,
        amount: reservation.amount,
        currency: reservation.currency
    }

    pay.confirm(confirmation)
        .then((response) => {
            logger.info(`confirm successfully finish`)
            res.status(200).json({
                error: "",
                message: {
                    redirectUrl: reservation.redirectUrl
                }
            })
            
        })
        .catch((error => {
            logger.error(error)
            res.status(404).json({
                error: {
                    status: 404,
                    message: error
                }
            })
        }));
})


app.listen(port, () => logger.info(`LinePay server is running on port ${port}`))