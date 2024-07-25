require('dotenv').config();

module.exports = {
  // Discord Bot Token
  token: process.env.DISCORD_TOKEN,

  // Default Prefix for Bot Commands
  prefix: '!',

  // YouTube API Key (For searching and retrieving YouTube videos)
  youtubeApiKey: process.env.YOUTUBE_API_KEY,

  // Spotify API Credentials
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,

  // SoundCloud API Client ID (For accessing SoundCloud tracks and playlists)
  soundcloudClientId: process.env.SOUNDCLOUD_CLIENT_ID,

  // Genius API Access Token (For retrieving lyrics)
  geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN,

  // MongoDB Connection String (Optional: For storing user data, playlists, etc.)
  mongoURI: process.env.MONGO_URI,

  // Default Volume Level (Between 0 and 100)
  defaultVolume: 50,

  // Allowed Music Sources (YouTube, Spotify, SoundCloud, etc.)
  allowedMusicSources: ['youtube', 'spotify', 'soundcloud'],

  // Bot Owner ID (For special permissions or commands)
  botOwnerId: process.env.BOT_OWNER_ID,

  // Other configuration options can be added here as needed
};