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
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title;
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { format: 'mp4' }).pipe(res);
    } catch (error) {
        res.status(500).send('Failed to download video');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
