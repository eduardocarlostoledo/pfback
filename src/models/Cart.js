const {DataTypes} = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('cart',{
        prodId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        image:{
            type: DataTypes.STRING,
            allowNull:false
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    },{timestamps:false})}