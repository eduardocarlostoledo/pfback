const { Product, User, Type, Brand } = require("../db");
const {Op} = require('sequelize')


// Obtiene los tipos de productos de la BDD

const getTypeProducts = async() => {
  try {
    
    const products = await Type.findAll();  
    return products;
  } catch (error) {
    throw new Error("Error retrieving product by Type: " + error.message);

  }
}

// Obtiene las marcas de la BDD

const getBrandProducts = async() => {
  try {
    
    const products = await Brand.findAll();
    return products;
  } catch (error) {
    throw new Error("Error retrieving products by brand: " + error.message);
  }
}

// Obtiene los productos si contienen la palabra que recibe por parametro (Para la busqueda)

const getProductsByName = async (productName) => {
  try {
    const products = await Product.findAll({
      include: [Type,Brand],
      where: {
        name: {
          [Op.iLike]: `%${productName}%`,
        },
      },
    });
    const result = products.map((p) => {
      return {
        id: p.id,
        name: p.name,
        image:p.image,
        price:p.price,
        description: p.description,
        type: p.type.name,
        brand: p.brand.name
      }
    })
    return result;
  } catch (error) {
    throw new Error("Error retrieving product by Name: " + error.message);
  }
};


//Obtiene todos los productos de la BDD

const getProducts = async () => {
    try {
      const allProducts = await Product.findAll({include: [Type,Brand]});
      const result = allProducts.map((p) => {
        return {
          id: p.id,
          name: p.name,
          image:p.image,
          price:p.price,
          description: p.description,
          type: p.type.name,
          brand: p.brand.name,
          info_adicional: p.info_adicional
        }
      })
      return result;
    } catch (error) {
      throw new Error("Error retrieving products: " + error.message);
    }
  };
  

// Obtiene los productos cuando tienen el nombre exactamente igual al que reciben por parametro (Sirve para la ruta Detail en el Front)

const getProductName = async (product) => {
  try {
    const products = await Product.findAll({include: [Type,Brand],where:{name:product}});
    const result = products.map((p) => {
      return {
        id: p.id,
        name: p.name,
        image:p.image,
        price:p.price,
        description: p.description,
        type: p.type.name,
        brand: p.brand.name
      }
    })
    if (result) return result;
    throw new Error("Product not found with exact name: " + product);
  } catch (error) {
    throw new Error("Error retrieving product by name: " + error.message);
  }
};

// Crea un producto en la BDD, esta accion sirve para testear. (Unicamente va a ser ejecutada por un administrador, no el usuario)
const postProduct = async (product) => {
  const { name, price, type, brand, image, description,info_adicional } = product;
  console.log(product.name, "POST")
  if (!name || !price || !type || !brand || !description || !image ) throw Error("Mandatory data missing");
  else {
    try {
      const [typeData, createdType] = await Type.findOrCreate({
        where: { name: type },
        defaults: { name: type }
      });
      console.log(typeData.name, "POST")

      const [brandData, createdBrand] = await Brand.findOrCreate({
        where: { name: brand },
        defaults: { name: brand }
      });
      console.log(brandData.name, "POST")

      const newProduct = await Product.create({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        typeId: typeData.id,
        brandId: brandData.id,
        info_adicional
      });
    

      console.log(product.name, newProduct, "POSTOK")

      return newProduct;
    } catch (error) {
      throw Error(error.message);
    }
  }
};

const BuildSearch = async (socket) => {
  try {
    const products = await Product.findAll({
      include: [Type,Brand],
      where: {
        "info_adicional.socket": socket,
      },
    });
    const result = products.map((p) => {
      return {
        id: p.id,
        name: p.name,
        image:p.image,
        price:p.price,
        description: p.description,
        info_adicional: p.info_adicional,
        type: p.type.name,
        brand: p.brand.name
      }
    })
    return result;
  } catch (error) {
    throw new Error("Error retrieving products by brand: " + error.message);
  }
};

module.exports = {
  postProduct,
  getProducts,
  getProductName,
  getProductsByName,
  getBrandProducts,
  getTypeProducts,
  BuildSearch
};