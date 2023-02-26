const { User } = require('../db')
const { encrypt, compare } = require('../helpers/bcrypt');

const getUsers = async () => {
  
  try {
    const result = await User.findAll();
    if (result) return result;
    throw new Error("Empy users database:");
  } catch (error) {
    throw new Error("Error retrieving Users Database" + error.message);
  }
};

const getUserId = async (userId) => {
  try {
    const result = await User.findByPk(userId);
    if (result) return result;
    throw new Error("User not found with ID: " + userId);
  } catch (error) {
    throw new Error("Error retrieving User by ID: " + error.message);
  }
};

const putUser = async (user, id) => {
  const { name, lastname, email, image, password, phonenumber, country, city, address } = user

  if (!user) throw Error('User data missing')
  else {
    try {
      // const userBD = await User.findOne({ where: { email: `${email}` } });
      // if (userBD) throw Error('The email already exists')
      if (password) {
        const passwordHash = await encrypt(password);
        const changeUser = await User.update({ name, lastname, email, image, password: passwordHash, phonenumber, country, city, address }, { where: { id } })
        return changeUser
      }

      const changeUser = await User.update({ name, lastname, email, image, password, phonenumber, country, city, address }, { where: { id } })
      return changeUser


    } catch (error) {
      throw Error(error.message)
    }
  }
}






const postUsers = async (req, res) => {
  const infoUser = {}
  const regexName = /^([a-zA-Z ]+)$/i;
  const regexPassword = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
 
  try {
    const { name, lastname, email, password, } = req.body;

    if (!name || !lastname || !password || !email) return res.json({ msg: 'Missing required fields' });


    if (email && email.length > 0 && email != "") {
      if (regexEmail.test(email)) {
        const userBD = await User.findOne({ where: { email: `${email}` } });
        if (userBD) {
          return res.json({ msg: 'The email already exists' });
        } else {
          infoUser.email = `${email}`
        }
      }
    }

    if (name && name.length > 0 && name != "") {
      if (regexName.test(name)) {
        infoUser.name = `${name}`
      } else {
        return res.json({ msg: 'The name is invalid' });
      }
    }

    if (lastname && lastname.length > 0 && lastname != "") {
      if (regexName.test(lastname)) {
        infoUser.lastname = `${lastname}`
      } else {
        return res.json({ msg: 'The lastname is invalid' });
      }
    }

    if (password && password.length > 0 && password != "") {
      if (regexPassword.test(password)) {
        const passwordHash = await encrypt(password);
        infoUser.password = `${passwordHash}`
      } else {
        return res.json({ msg: 'The password is invalid' });
      }
    }

    await User.create({
      name: name,
      lastname: lastname,
      password: infoUser.password,
      email: email.toLowerCase(),
    });
    return res.json({ msg: `User create succesfully` });
  } catch (error) {
    return res.json({ msg: `Error 404 - ${error}` });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: `${email}` } });
    if (!user) return res.json({ msg: 'User not found',success: false, });

    const checkPassword = await compare(password, user.password);

    if (checkPassword) {
      res.status(200).send({
        data: user,
       success: true,
      });
    }
    if (!checkPassword) {
      return res.json({ msg: 'Invalid password', success: false, });


    }
  } catch (error) {
    return res.json({ msg: `Error 404 - ${error}` });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await await User.destroy({
      where: {
        id: `${id}`
      }
    });
    if (!deletedUser) return res.json({ msg: 'Username does not exist' });
    return res.json({ msg: 'User Deleted' });
  } catch (error) {
    return res.json({ msg: `Error 404 - ${error}` });
  }
};



module.exports = {
  putUser, getUsers, getUserId, loginUser, postUsers, deleteUser
}