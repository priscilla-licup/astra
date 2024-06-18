const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let horoscopes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'horoscopes.json')));

// Route for the homepage
app.get('/', (req, res) => {
    res.render('index', { horoscopes });
});

// Route for displaying a horoscope
app.get('/horoscope/:sign', (req, res) => {
    const sign = req.params.sign.toLowerCase();
    const horoscope = horoscopes.find(h => h.sign.toLowerCase() === sign);
    if (horoscope) {
        res.render('horoscope', { horoscope });
    } else {
        res.status(404).send('Horoscope not found');
    }
});

// Route for the admin page
app.get('/admin', (req, res) => {
    res.render('admin', { horoscopes });
});

// Route to save edited horoscope data
app.post('/admin/save', (req, res) => {
    const { sign, dateRange, dailyMessage, compatibility, image } = req.body;
    const index = horoscopes.findIndex(h => h.sign.toLowerCase() === sign.toLowerCase());
    if (index !== -1) {
        horoscopes[index] = { sign, dateRange, dailyMessage, compatibility, image };
        fs.writeFileSync(path.join(__dirname, 'data', 'horoscopes.json'), JSON.stringify(horoscopes, null, 2));
        res.redirect('/admin');
    } else {
        res.status(404).send('Horoscope not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
