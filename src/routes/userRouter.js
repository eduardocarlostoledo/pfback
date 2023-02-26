const { Router } = require('express');

const { putUser, getUsers, getUserId, loginUser, postUsers, deleteUser } = require("../controllers/usersController")

const userRouter = Router()

//////////////////////////////// CREAR USUARIO /////////////////////////////////////// 
userRouter.post('/register', postUsers) // users/register

//////////////////////////////// INICIAR SESSION  /////////////////////////////////////// 

userRouter.post('/login', loginUser)

//////////////////////////////// MODIFICAR USUARIO  /////////////////////////////////////// 

userRouter.put("/:id", async (req, res) => {
  const {id}=req.params;
  try {
    const user =await putUser(req.body,id)
    res.status(200).json("Usuario actualizado")
  } catch (error) {
    res.status(400).json(error.message)
  }
 })


 //////////////////////////////// TRAER TODOS LOS USUARIOS  ////////////////////////////////

  userRouter.get("/", async (req,res) => {
    try {
        const users = await getUsers();         
        res.status(200).json({data: users,message: "Listado de usuarios"})
    } catch (error) {
        res.status(400).json(error.message)
    } 
 })

 //////////////////////////////// TRAER USUARIO POR PARAMETRO ////////////////////////////////

 userRouter.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
      const result = await getUserId(userId);
      if (result) {
        res.status(200).json({ data: result, message: "Usuario solicitado" });
      } else {
        res.status(404).json({ error: "Usuario no encontrado por ID" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

 //////////////////////////////// BORRAR USUARIO ////////////////////////////////

 userRouter.delete('/delete/:id', deleteUser)

module.exports = {userRouter}