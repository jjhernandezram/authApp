const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Conexión a la base de datos establecida.`);
  } catch (error) {
    console.log(error);
    throw new Error(`Error a la hora de establecer conexión a la base de datos.`);
  }
};

module.exports = {
  dbConnection,
};
