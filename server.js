const express = require('express');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL) {
        return res.status(400).sendFile(path.join(__dirname, 'error.html'));
    }

    const outputFile = path.join(__dirname, 'video.mp4');

    youtubedl(videoURL, {
        output: outputFile,
        format: 'bestvideo+bestaudio',
        mergeOutputFormat: 'mp4'
    })
    .then(() => {
        res.download(outputFile, 'video.mp4', (err) => {
            if (err) {
                res.status(500).sendFile(path.join(__dirname, 'error.html'));
            }
        });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).sendFile(path.join(__dirname, 'error.html'));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
