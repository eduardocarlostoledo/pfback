const { Router } = require('express');
const payRouter = Router()
const mercadopago = require("mercadopago");

payRouter.post("/create_preference", (req, res) => {
    console.log(req.body)
        let preference = {
            items: [
                {
                    title: req.body.description,
                    unit_price: Number(req.body.price),
                    quantity: Number(req.body.quantity),
                }
            ],		
            back_urls: {
                "success": "https://pfback-production.up.railway.app/pay/feedback/success",
                "failure": "https://pfback-production.up.railway.app/pay/feedback/failure",
                "pending": "https://pfback-production.up.railway.app/pay/feedback/pending"
            },
            auto_return: "approved",
        };console.log("PREFERENCE", preference)
    
        mercadopago.preferences.create(preference)
            .then(function (response) {
                res.send({
                    id: response.body.id
                })
                console.log("MERCADOPAGO.PREFERENCES.CREATE", response.body.id);
            }).catch(function (error) {
                console.log(error);
            });
    });

    
    payRouter.get('/feedback/success', function (req, res) {
        const paymentId = req.query.payment_id;
        const status = req.query.status;
        const merchantOrderId = req.query.merchant_order_id;
    
    
            res.send(`
            <!DOCTYPE html>
            <html>            
              <head>
                <title>Mi página HTML</title>
                <link rel="stylesheet" type="text/css" href="./payStyles/succes.css">
              </head>
              <body>
                <div class="contenedor_succes">
                  <a href="https://main--tangerine-muffin-10d4f4.netlify.app/"><svg class='succes_svg' width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path style="fill:#232326" d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg></a>
                    <h1 class="succes_h1">Payment Successful</h1>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_xXsXXnglKn4YmVFVx39Pd-0LgWqhiUVk5g&usqp=CAU" alt="" class='succes_img'>
                    <a href="https://main--tangerine-muffin-10d4f4.netlify.app/Products" class="succes_a">Keep Buying</a>
                    <p class="succes_p">COMPUTER STORE</p>
                    <ul class="succes_ul">          
                      <li class="succes_li">Payment ID: ${paymentId}</li>
                      <li class="succes_li">Status: ${status}</li>
                      <li class="succes_li">Merchant Order ID: ${merchantOrderId}</li>
                  </ul>
                </div>
              </body>
            </html>
            `)
    })
    payRouter.get('/feedback/pending', function (req, res) {
        res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Mi página HTML</title>
            <link rel="stylesheet" type="text/css" href="./payStyles/pending.css">
          </head>
          <body>
            <div class="contenedor_pending">
              <a href="https://main--tangerine-muffin-10d4f4.netlify.app/"><svg class='pending_svg' width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path style="fill:#232326" d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg></a>
              <h1 class="pending_h1"> Pending Pay !</h1>
              <img class='pending_img'src="https://img.freepik.com/fotos-premium/simbolo-signo-exclamacion-azul-atencion-o-icono-signo-precaucion-fondo-problema-peligro-alerta-representacion-3d-senal-advertencia_256259-2831.jpg" alt="">
              <a href="https://main--tangerine-muffin-10d4f4.netlify.app/Products" class="succes_a">Keep Buying</a>
              <p class="pending_p">COMPUTER STORE</p>
            </div>
          </body>
        </html>
      `)
    })
    
    payRouter.get('/feedback/failure', function (req, res) {
        res.send(`
        <!DOCTYPE html>
	<html>
	  <head>
		<title>Mi página HTML</title>
		<link rel="stylesheet" type="text/css" href="./payStyles/failure.css">
	  </head>
	  <body>
		<div class="contenedor_failure">
			<a href="https://main--tangerine-muffin-10d4f4.netlify.app/"><svg class='failure_svg' width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path style="fill:#232326" d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg></a>
			<h1 class="failure_h1"> Failure Pay!</h1>
			<img class="failure_img" src="https://static.vecteezy.com/system/resources/thumbnails/017/178/563/small/cross-check-icon-symbol-on-transparent-background-free-png.png" alt="">
			<a href="https://main--tangerine-muffin-10d4f4.netlify.app/Products" class="succes_a">Keep Buying</a>
			<p class="failure_p">COMPUTER STORE</p>
		</div>
	  </body>
</html>
      `)
    })

    module.exports = {payRouter}
