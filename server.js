const express = require('express');
const ytdlp = require('ytdlp-nodejs');
const { createWriteStream } = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', (req, res) => {
    const videoURL = req.query.url;
    const quality = req.query.quality || '1080p';

    if (!videoURL) {
        return res.status(400).send('Bad Request: No URL provided.');
    }

    const filePath = path.join(__dirname, 'downloads', 'video.mp4');
    const fileStream = createWriteStream(filePath);

    ytdlp.download(videoURL, {
        filter: 'mergevideo',
        quality: quality,
        output: {
            fileName: 'video.mp4',
            outDir: 'downloads'
        }
    })
    .on('progress', (data) => {
        console.log(data);
    })
    .on('end', () => {
        res.download(filePath, 'video.mp4', (err) => {
            if (err) {
                console.error('Download failed:', err);
                res.status(500).send('Failed to download video. Please use another method.');
            }
        });
    })
    .on('error', (err) => {
        console.error('Error:', err);
        res.status(500).send('Not found, please use another method.');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
