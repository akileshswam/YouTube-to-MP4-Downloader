# YouTube to MP4 Converter

A simple, personal YouTube video downloader with a clean web interface. Built for personal use among friends.

## ⚠️ Disclaimer

This tool is for personal use only. Please respect copyright laws and YouTube's Terms of Service. Only download content you have permission to use.

## 🚀 Features

- Clean, responsive web interface
- Multiple quality options (Best, 720p, 480p, 360p, Lowest)
- Real-time download progress
- Automatic file cleanup
- Works with any YouTube URL

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.6 or higher)
- **yt-dlp**: `pip install yt-dlp`

## 🛠️ Installation

1. Clone this repository:
```bash
git clone https://github.com/YOUR_USERNAME/youtube-converter.git
cd youtube-converter
```

2. Install dependencies:
```bash
npm install
```

3. Create the project structure:
```
youtube-converter/
├── server.js
├── package.json
├── public/
│   └── index.html
└── downloads/ (created automatically)
```

4. Move the HTML file to the `public` folder as `index.html`

## 🚀 Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and go to:
```
http://localhost:3000
```

3. Paste a YouTube URL and click download!

## 🌐 Sharing with Friends

### Option 1: Local Network
Replace `localhost` in the HTML with your computer's IP address.

### Option 2: Ngrok (Easiest)
```bash
# Install ngrok, then:
ngrok http 3000
```
Share the https URL it provides.

### Option 3: Deploy to Cloud
Deploy to Railway, Render, Heroku, or similar services.

## 📁 Project Structure

```
├── server.js          # Backend API server
├── package.json       # Node.js dependencies
├── public/
│   └── index.html     # Frontend interface
├── downloads/         # Temporary download storage
└── README.md          # This file
```

## 🔧 Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## 🤝 Contributing

This is a personal project, but feel free to fork and modify for your own use!

## 📝 License

MIT License - Feel free to use for personal projects.

## 🆘 Troubleshooting

**"yt-dlp not found"**: Make sure Python and yt-dlp are installed:
```bash
pip install --upgrade yt-dlp
```

**Downloads failing**: Try updating yt-dlp:
```bash
pip install --upgrade yt-dlp
```

**CORS errors**: Make sure you're accessing the frontend through the server (http://localhost:3000), not opening the HTML file directly.