const express = require('express');
const ytdlp = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // Serve static files

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', (req, res) => {
    const videoURL = req.query.url;
    
    if (!videoURL) {
        return res.status(400).sendFile(path.join(__dirname, 'error.html'));
    }

    const outputFile = `video-${Date.now()}.mp4`;

    ytdlp(videoURL, {
        output: outputFile,
        format: 'bestvideo+bestaudio'
    })
    .then(() => {
        res.download(outputFile, (err) => {
            if (err) {
                console.error('Error while downloading video:', err);
                res.status(500).sendFile(path.join(__dirname, 'error.html'));
            }
            fs.unlinkSync(outputFile); // Clean up file after download
        });
    })
    .catch((error) => {
        console.error('Error while processing video:', error);
        res.status(500).sendFile(path.join(__dirname, 'error.html'));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
