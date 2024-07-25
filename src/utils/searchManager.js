const { MessageEmbed } = require('discord.js');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const { youtubeApiKey } = require('../config.js');
const Spotify = require('spotify-web-api-node');
const SoundCloud = require('soundcloud-node');
const fetch = require('node-fetch');
const { soundcloudClientId } = require('../config.js');

const spotifyApi = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const soundCloud = new SoundCloud({
  client_id: soundcloudClientId,
});

/**
 * Searches for a song on YouTube, Spotify, and SoundCloud.
 *
 * @param {string} query The search query.
 * @returns {Promise<Object | null>} A promise that resolves to an object containing the search result, or null if no results are found.
 */
const search = async (query) => {
  // YouTube Search
  try {
    const youtubeResults = await ytsr(query, { limit: 1 });
    if (youtubeResults.items.length > 0) {
      const video = youtubeResults.items[0];
      const info = await ytdl.getInfo(video.url);
      return {
        type: 'youtube',
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url,
        artist: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        views: video.views,
      };
    }
  } catch (error) {
    console.error('Error searching YouTube:', error);
  }

  // Spotify Search
  try {
    const spotifyResults = await spotifyApi.searchTracks(query, { limit: 1 });
    if (spotifyResults.body.tracks.items.length > 0) {
      const track = spotifyResults.body.tracks.items[0];
      const artists = track.artists.map((artist) => artist.name).join(', ');
      return {
        type: 'spotify',
        title: track.name,
        url: track.external_urls.spotify,
        thumbnail: track.album.images[0].url,
        artist: artists,
        duration: track.duration_ms / 1000,
        views: null,
      };
    }
  } catch (error) {
    console.error('Error searching Spotify:', error);
  }

  // SoundCloud Search
  try {
    const soundCloudResults = await soundCloud.get('/tracks', {
      q: query,
      limit: 1,
    });
    if (soundCloudResults.length > 0) {
      const track = soundCloudResults[0];
      const artists = track.user.username;
      return {
        type: 'soundcloud',
        title: track.title,
        url: track.permalink_url,
        thumbnail: track.artwork_url,
        artist: artists,
        duration: track.duration / 1000,
        views: track.playback_count,
      };
    }
  } catch (error) {
    console.error('Error searching SoundCloud:', error);
  }

  // No results found
  return null;
};

/**
 * Searches for a specific song on YouTube.
 *
 * @param {string} query The song title, artist, or keyword to search for.
 * @returns {Promise<Object | null>} A promise that resolves to an object containing the search result, or null if no results are found.
 */
const searchSong = async (query) => {
  try {
    const youtubeResults = await ytsr(query, { limit: 1 });
    if (youtubeResults.items.length > 0) {
      const video = youtubeResults.items[0];
      const info = await ytdl.getInfo(video.url);
      return {
        type: 'youtube',
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url,
        artist: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        views: video.views,
      };
    }
  } catch (error) {
    console.error('Error searching YouTube:', error);
  }
  return null;
};

/**
 * Searches for an artist on YouTube.
 *
 * @param {string} query The artist name to search for.
 * @returns {Promise<Object | null>} A promise that resolves to an object containing the search result, or null if no results are found.
 */
const searchArtist = async (query) => {
  try {
    const youtubeResults = await ytsr(query, { limit: 1 });
    if (youtubeResults.items.length > 0) {
      const channel = youtubeResults.items[0];
      return {
        type: 'youtube',
        name: channel.title,
        url: channel.url,
        thumbnail: channel.bestThumbnail.url,
        description: channel.description,
      };
    }
  } catch (error) {
    console.error('Error searching YouTube:', error);
  }
  return null;
};

/**
 * Searches for an album on YouTube.
 *
 * @param {string} query The album name to search for.
 * @returns {Promise<Object | null>} A promise that resolves to an object containing the search result, or null if no results are found.
 */
const searchAlbum = async (query) => {
  try {
    const youtubeResults = await ytsr(query, { limit: 1 });
    if (youtubeResults.items.length > 0) {
      const playlist = youtubeResults.items[0];
      return {
        type: 'youtube',
        title: playlist.title,
        url: playlist.url,
        thumbnail: playlist.bestThumbnail.url,
        description: playlist.description,
      };
    }
  } catch (error) {
    console.error('Error searching YouTube:', error);
  }
  return null;
};

/**
 * Extracts information about a playlist from a YouTube URL.
 *
 * @param {string} playlistUrl The URL of the YouTube playlist.
 * @returns {Promise<Object | null>} A promise that resolves to an object containing playlist information, or null if the URL is invalid or the playlist is not found.
 */
const getPlaylistInfo = async (playlistUrl) => {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistUrl.split('/').pop()}&key=${youtubeApiKey}`);
    if (!response.ok) {
      throw new Error(`YouTube API request failed: ${response.status}`);
    }
    const data = await response.json();
    if (data.items.length === 0) {
      return null;
    }
    const playlist = data.items[0];
    return {
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      thumbnail: playlist.snippet.thumbnails.default.url,
    };
  } catch (error) {
    console.error('Error getting playlist info:', error);
    return null;
  }
};

module.exports = {
  search,
  searchSong,
  searchArtist,
  searchAlbum,
  getPlaylistInfo,
};