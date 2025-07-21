const dotenv = require('dotenv');
const express = require('express');
const toolCall = require('../dist/tool-call').default;

dotenv.config();

const app = express();

const { MONGODB_URI, PORT } = process.env;

if (!MONGODB_URI) {
    console.log('`MONGODB_URI` not set. Please add it to your .env file.');
    process.exit(1);
}

app.get('/', async (req, res) => {
    const { mode, input } = req.query;
    try {
        const result = await toolCall(
            typeof mode === 'string' ? mode : '',
            typeof input === 'string' ? input : '',
            MONGODB_URI
        );
        res.send(result);
    } catch (err) {
        res.status(500).send('Server error: ' + err);
    }
});

const port = PORT || 3001;
app.listen(port, () => {
    console.log(`Local development server running on port ${port}`);
});
