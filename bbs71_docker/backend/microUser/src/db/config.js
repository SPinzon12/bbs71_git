const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.connect(process.env.DB_CONNECTION, {
            autoIndex: true
        })

        console.log('DB Online')
    }catch(err){
        console.log(err)

        throw new Error('Error al conectar en DB')
    }
}

module.exports = { dbConnection }