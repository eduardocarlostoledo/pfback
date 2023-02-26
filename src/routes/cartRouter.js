const { Router } = require('express');
const { 
    getProductsCart,
    addProductCart,
    deleteProductCart
  } = require('../controllers/cartController')

const cartRouter = Router()

cartRouter.get('/', async (req,res) => {
    try {
        const productsCart = await getProductsCart()
        res.status(200).json(productsCart)
    } catch (error) {
        res.status(400).json("No hay productos en el carrito")
    }
})

cartRouter.post('/', async (req,res) => {
    try {
        const addProduct=await addProductCart(req.body)
        res.status(200).json(addProduct)
    } catch (error) {
        res.status(400).json(error.message) 
    }
})

cartRouter.delete('/:prodId', async (req,res) => {
    try {
        const deleteProduct=await deleteProductCart(req.params.prodId)
        res.status(200).json(deleteProduct)
    } catch (error) {
        res.status(400).json(error.message) 
    }
})

module.exports={cartRouter};