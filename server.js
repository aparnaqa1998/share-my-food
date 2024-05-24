const express = require('express');
const sql = require('mssql');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());

const dbConfig = {
    user: 'admin-webapp-dev',
    password: 'Param@2025$#',
    server: 'sql-db-users-dev.database.windows.net',
    database: 'db-foodbank',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

sql.connect(dbConfig, err => {
    if (err) console.log(err);
    else console.log('Database connected');
});
app.use(express.static(path.join(__dirname, 'public')));

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
