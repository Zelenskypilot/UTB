const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).sendFile(path.join(__dirname, 'error.html'));
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
        if (format && format.url) {
            res.redirect(format.url);  // Redirect the user to the video URL for direct download
        } else {
            res.status(500).sendFile(path.join(__dirname, 'error.html'));
        }
    } catch (error) {
        res.status(500).sendFile(path.join(__dirname, 'error.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
