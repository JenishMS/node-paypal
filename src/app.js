const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const app = express();

let clientId = "ARvCThGredQ8ct-SacdEocZEf5bZ1nvepwMrIXctFfEEv5ssSbgSsxfQIYX76TgXHwZkvlzgNDcbizuo";
let clientSecret = "EHMxvxZo1vP8gQjfhccKjvO4-QtzoTCtnQdGmewALuN_ZUzAyrPYeO7tlNwBpdz3LsJ1_Xok9JGBQeqF";

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'success'
    });
});

// http://localhost:3000/pay?pay=5
app.get('/pay', async (req, res) => {
    const queryParams = req.query;
    let request = new paypal.orders.OrdersCreateRequest();
    let response;
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": queryParams.pay+".00"
                }
            }
        ]
    });
    let createOrder  = async function() {
        response = await client.execute(request);
        
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        // console.log(`Order: ${JSON.stringify(response.result)}`);
    }
    await createOrder();
    res.json(response);
});

// http://localhost:3000/response?id=6P545326W8309522L
app.get('/response', async (req, res) => {
    let response;
    let captureOrder =  async function(orderId) {
    request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    response = await client.execute(request);
}
let capture = await captureOrder(req.query.id); 
res.json(response);
})

app.listen(3000, () => console.log('App Started...'));