const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML file from public folder

// Downloads directory
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR);
}

// Helper function to sanitize filename
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Download endpoint
app.post('/api/download', async (req, res) => {
    const { url, quality } = req.body;
    
    console.log('Download request:', { url, quality });
    
    // Basic URL validation
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const outputTemplate = path.join(DOWNLOADS_DIR, `video_${timestamp}_%(title)s.%(ext)s`);
    
    // Build yt-dlp command based on quality
    let formatSelector;
    switch(quality) {
        case 'best':
            formatSelector = 'best[ext=mp4]';
            break;
        case 'worst':
            formatSelector = 'worst[ext=mp4]';
            break;
        case '720p':
            formatSelector = 'best[height<=720][ext=mp4]';
            break;
        case '480p':
            formatSelector = 'best[height<=480][ext=mp4]';
            break;
        case '360p':
            formatSelector = 'best[height<=360][ext=mp4]';
            break;
        default:
            formatSelector = 'best[ext=mp4]';
    }
    
    const command = `yt-dlp -f "${formatSelector}" --no-playlist -o "${outputTemplate}" "${url}"`;
    
    console.log('Executing command:', command);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Download error:', error);
            console.error('stderr:', stderr);
            return res.status(500).json({ 
                error: 'Download failed', 
                details: stderr || error.message 
            });
        }
        
        console.log('Download completed:', stdout);
        
        // Find the downloaded file
        const files = fs.readdirSync(DOWNLOADS_DIR)
            .filter(file => file.startsWith(`video_${timestamp}_`))
            .map(file => ({
                name: file,
                path: path.join(DOWNLOADS_DIR, file),
                time: fs.statSync(path.join(DOWNLOADS_DIR, file)).mtime
            }))
            .sort((a, b) => b.time - a.time);
        
        if (files.length === 0) {
            return res.status(500).json({ error: 'Downloaded file not found' });
        }
        
        const downloadedFile = files[0];
        const filename = downloadedFile.name.replace(/^video_\d+_/, '');
        
        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'video/mp4');
        
        // Stream the file
        const fileStream = fs.createReadStream(downloadedFile.path);
        fileStream.pipe(res);
        
        // Clean up file after streaming (optional)
        fileStream.on('end', () => {
            setTimeout(() => {
                fs.unlink(downloadedFile.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                    else console.log('File cleaned up:', downloadedFile.path);
                });
            }, 5000); // Delete after 5 seconds
        });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'YouTube converter API is running' });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log('📁 Make sure to put your HTML file in the "public" folder');
    console.log('⚠️  Make sure yt-dlp is installed: pip install yt-dlp');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    process.exit(0);
});