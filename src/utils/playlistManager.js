const { MessageEmbed } = require('discord.js');
const { mongoURI } = require('../config.js');
const mongoose = require('mongoose');

// Define the playlist schema
const playlistSchema = new mongoose.Schema({
  guildId: String,
  name: String,
  songs: [{
    title: String,
    artist: String,
    url: String,
    thumbnail: String,
    type: String, // 'youtube', 'spotify', 'soundcloud'
  }],
  userId: String, // The ID of the user who created the playlist
});

// Create the playlist model
const Playlist = mongoose.model('Playlist', playlistSchema);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Creates a new playlist for the specified guild and user.
 *
 * @param {Guild} guild The Discord guild to create the playlist in.
 * @param {string} playlistName The name of the playlist to create.
 * @returns {Promise<void>} A promise that resolves when the playlist is created.
 */
const createPlaylist = async (guild, playlistName) => {
  try {
    // Check if a playlist with the same name already exists
    const existingPlaylist = await Playlist.findOne({ guildId: guild.id, name: playlistName });
    if (existingPlaylist) {
      throw new Error('Playlist already exists');
    }

    // Create the new playlist
    const newPlaylist = new Playlist({
      guildId: guild.id,
      name: playlistName,
      songs: [],
      userId: guild.member(interaction.user).id,
    });

    await newPlaylist.save();
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

/**
 * Adds a song to an existing playlist.
 *
 * @param {Guild} guild The Discord guild where the playlist exists.
 * @param {string} playlistName The name of the playlist.
 * @param {string} songToAdd The title of the song to add.
 * @param {Object} searchResult The search result object from searchManager.
 * @returns {Promise<void>} A promise that resolves when the song is added to the playlist.
 */
const addSongToPlaylist = async (guild, playlistName, songToAdd, searchResult) => {
  try {
    // Find the playlist
    const playlist = await Playlist.findOne({ guildId: guild.id, name: playlistName });
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Check if the song is already in the playlist
    const songExists = playlist.songs.some(song => song.title === songToAdd);
    if (songExists) {
      throw new Error('Song already exists in playlist');
    }

    // Add the song to the playlist
    playlist.songs.push({
      title: searchResult.title,
      artist: searchResult.artist,
      url: searchResult.url,
      thumbnail: searchResult.thumbnail,
      type: searchResult.type,
    });

    await playlist.save();
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};

/**
 * Removes a song from an existing playlist.
 *
 * @param {Guild} guild The Discord guild where the playlist exists.
 * @param {string} playlistName The name of the playlist.
 * @param {string} songToRemove The title of the song to remove.
 * @returns {Promise<void>} A promise that resolves when the song is removed from the playlist.
 */
const removeSongFromPlaylist = async (guild, playlistName, songToRemove) => {
  try {
    // Find the playlist
    const playlist = await Playlist.findOne({ guildId: guild.id, name: playlistName });
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Find the song index in the playlist
    const songIndex = playlist.songs.findIndex(song => song.title === songToRemove);
    if (songIndex === -1) {
      throw new Error('Song not found in playlist');
    }

    // Remove the song from the playlist
    playlist.songs.splice(songIndex, 1);

    await playlist.save();
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    throw error;
  }
};

/**
 * Lists all playlists for the specified guild.
 *
 * @param {Guild} guild The Discord guild to list playlists for.
 * @param {string} targetUser The user whose playlists to list (optional).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of playlist objects.
 */
const listPlaylists = async (guild, targetUser) => {
  try {
    // Find all playlists for the guild
    let playlists;
    if (targetUser) {
      playlists = await Playlist.find({ guildId: guild.id, userId: guild.member(targetUser).id });
    } else {
      playlists = await Playlist.find({ guildId: guild.id });
    }

    return playlists;
  } catch (error) {
    console.error('Error listing playlists:', error);
    throw error;
  }
};

/**
 * Retrieves a playlist by name for the specified guild.
 *
 * @param {Guild} guild The Discord guild where the playlist exists.
 * @param {string} playlistName The name of the playlist to retrieve.
 * @returns {Promise<Object | null>} A promise that resolves to the playlist object, or null if the playlist is not found.
 */
const getPlaylist = async (guild, playlistName) => {
  try {
    // Find the playlist
    const playlist = await Playlist.findOne({ guildId: guild.id, name: playlistName });
    return playlist;
  } catch (error) {
    console.error('Error getting playlist:', error);
    throw error;
  }
};

/**
 * Deletes a playlist by name for the specified guild.
 *
 * @param {Guild} guild The Discord guild where the playlist exists.
 * @param {string} playlistName The name of the playlist to delete.
 * @returns {Promise<void>} A promise that resolves when the playlist is deleted.
 */
const deletePlaylist = async (guild, playlistName) => {
  try {
    // Find and delete the playlist
    await Playlist.deleteOne({ guildId: guild.id, name: playlistName });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  listPlaylists,
  getPlaylist,
  deletePlaylist,
};