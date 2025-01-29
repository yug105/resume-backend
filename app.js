require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const templateroute = require('./routes/template');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/templates',templateroute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




