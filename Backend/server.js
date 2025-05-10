require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const { setupSocket } = require('./socket');
const cors = require('cors');


const server = http.createServer(app);
app.use(cors());

setupSocket(server); // we’ll create this in next steps

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
