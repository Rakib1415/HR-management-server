require('dotenv').config();
const app = require('./app/app');
const db = require('./models');

const PORT = process.env.PORT || 4000;

// database connection
db.sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
        console.log('Database Connected!');
    })
    .catch((err) => {
        console.log('Failed to sync db', err.message);
    });
