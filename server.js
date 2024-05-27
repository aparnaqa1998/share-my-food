const express = require('express');
const sql = require('mssql');
const path = require('path');
const cors = require('cors');
const app = express();
const { getSecret } = require('./keyvault');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
async function initializeServer() {
    try {
const dbUsername = await getSecret('db-admin-user');
const dbPassword =await getSecret('db-password');
const dbName = await getSecret('db-name');
const dbConfig = {
        user:  dbUsername,
        password: dbPassword,
        server: 'sql-db-users-dev.database.windows.net',  // Replace with your database server name
        database: dbName,

};
await sql.connect(dbConfig, err => {
    if (err) console.log(err);
    else console.log('Database connected');
}); 


app.get('/foodbanks', (req, res) => {
    const location = req.query.location;
    const request = new sql.Request();
   const query =`SELECT * FROM foodbank_details WHERE foodbank_location =@location`
    request.input('location', sql.NVarChar, location);
    request.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result.recordset);
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
    }catch (err) {
        console.error('Error initializing server:', err);
      }
    }
    
    initializeServer();
