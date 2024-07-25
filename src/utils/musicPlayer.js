const { MessageEmbed, VoiceChannel, VoiceState, Guild, User } = require('discord.js');
const ytdl = require('ytdl-core');
const { defaultVolume, allowedMusicSources } = require('../config.js');
const { getLyrics } = require('./lyrics.js');

const queue = new Map(); // Map for storing queue data across guilds

const getVoiceChannel = (guild) => {
  return guild.members.me.voice.channel;
};

const joinVoiceChannel = async (guild, voiceChannel) => {
  if (!getVoiceChannel(guild)) {
    try {
      const connection = await guild.members.me.voice.join(voiceChannel);
      return connection;
    } catch (error) {
      console.error('Error joining voice channel:', error);
      throw new Error('Failed to join voice channel.');
    }
  } else {
    throw new Error('Bot is already in a voice channel.');
  }
};

const play = async (guild, song) => {
  // Ensure the bot is in the same voice channel as the user
  const voiceChannel = getVoiceChannel(guild);
  if (!voiceChannel) {
    throw new Error('Bot is not in a voice channel.');
  }

  const serverQueue = queue.get(guild.id);

  // If no queue exists for the guild, create one
  if (!serverQueue) {
    const newQueue = {
      connection: null,
      voiceChannel: voiceChannel,
      songs: [],
      volume: defaultVolume / 100,
      playing: false,
      loop: false,
      loopType: 'song', // 'song' or 'queue'
    };
    queue.set(guild.id, newQueue);
  }

  // Add the song to the queue
  serverQueue.songs.push(song);

  // Play the first song if the queue isn't playing
  if (!serverQueue.playing) {
    playNext(guild);
  }
};

const playNext = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return;
  }

  // If the queue is empty, leave the voice channel
  if (serverQueue.songs.length === 0) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.end();
    await serverQueue.voiceChannel.leave();
    return;
  }

  // Get the next song in the queue
  const currentSong = serverQueue.songs[0];
  serverQueue.playing = true;

  // Create a stream for the song based on its type
  let stream;
  switch (currentSong.type) {
    case 'youtube':
      stream = ytdl(currentSong.url, { filter: 'audioonly' });
      break;
    case 'spotify':
      // Use spotify-web-api-node to get the track's URI for streaming
      // ...
      break;
    case 'soundcloud':
      // Use soundcloud-node to get the track's stream URL
      // ...
      break;
    default:
      throw new Error('Invalid music source type.');
  }

  // Create a dispatcher for the stream
  serverQueue.connection = joinVoiceChannel(guild, serverQueue.voiceChannel);
  const dispatcher = serverQueue.connection.play(stream, {
    volume: serverQueue.volume,
    type: 'opus',
  });

  // Handle the end of the current song
  dispatcher.on('finish', async () => {
    serverQueue.songs.shift();

    // Loop the song or queue if enabled
    if (serverQueue.loop) {
      if (serverQueue.loopType === 'song') {
        serverQueue.songs.unshift(currentSong); // Loop the current song
      } else if (serverQueue.loopType === 'queue') {
        serverQueue.songs.push(currentSong); // Loop the entire queue
      }
    }

    await playNext(guild);
  });

  // Handle errors during playback
  dispatcher.on('error', (error) => {
    console.error('Error playing song:', error);
    serverQueue.songs.shift();
    playNext(guild);
  });

  // Display information about the currently playing song
  const nowPlayingEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Now Playing: ${currentSong.title}`)
    .setURL(currentSong.url)
    .setThumbnail(currentSong.thumbnail)
    .addField('Artist', currentSong.artist, true)
    .addField('Duration', formatTime(currentSong.duration), true);

  // Get lyrics and add them to the embed if available
  const lyrics = await getLyrics(currentSong.title, currentSong.artist);
  if (lyrics) {
    nowPlayingEmbed.addField('Lyrics', lyrics.substring(0, 1024), false);
  }

  // Send the embed message to the voice channel
  voiceChannel.send({ embeds: [nowPlayingEmbed] });
};

const getCurrentSong = (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return null;
  }

  if (serverQueue.songs.length === 0) {
    return null;
  }

  return serverQueue.songs[0];
};

const getQueue = (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return [];
  }

  return serverQueue.songs;
};

const skip = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    throw new Error('No songs in queue');
  }

  if (serverQueue.songs.length <= 1) {
    throw new Error('No songs in queue');
  }

  serverQueue.connection.dispatcher.end();
};

const stop = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return;
  }

  serverQueue.songs = [];
  serverQueue.playing = false;
  serverQueue.connection.dispatcher.end();
  await serverQueue.voiceChannel.leave();
};

const pause = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    throw new Error('Music is not playing');
  }

  if (serverQueue.connection.dispatcher.paused) {
    throw new Error('Music is not paused');
  }

  serverQueue.connection.dispatcher.pause();
};

const resume = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    throw new Error('Music is not playing');
  }

  if (!serverQueue.connection.dispatcher.paused) {
    throw new Error('Music is not paused');
  }

  serverQueue.connection.dispatcher.resume();
};

const loopSong = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return;
  }

  if (serverQueue.loop) {
    if (serverQueue.loopType === 'song') {
      serverQueue.loop = false;
      serverQueue.loopType = 'song'; // Reset to song loop
    } else if (serverQueue.loopType === 'queue') {
      serverQueue.loop = false;
      serverQueue.loopType = 'queue'; // Reset to queue loop
    }
    return;
  }

  serverQueue.loop = true;
  serverQueue.loopType = 'song'; // Loop the current song
};

const loopQueue = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return;
  }

  if (serverQueue.loop) {
    if (serverQueue.loopType === 'song') {
      serverQueue.loop = false;
      serverQueue.loopType = 'song'; // Reset to song loop
    } else if (serverQueue.loopType === 'queue') {
      serverQueue.loop = false;
      serverQueue.loopType = 'queue'; // Reset to queue loop
    }
    return;
  }

  serverQueue.loop = true;
  serverQueue.loopType = 'queue'; // Loop the entire queue
};

const shuffleQueue = async (guild) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return;
  }

  // Fisher-Yates Shuffle Algorithm
  for (let i = serverQueue.songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [serverQueue.songs[i], serverQueue.songs[j]] = [
      serverQueue.songs[j],
      serverQueue.songs[i],
    ];
  }
};

const setVolume = async (guild, volume) => {
  const serverQueue = queue.get(guild.id);
  if (!serverQueue) {
    return;
  }

  serverQueue.volume = volume;
  serverQueue.connection.dispatcher.setVolumeLogarithmic(volume);
};

// Helper function to format time in seconds to HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedTime =
    (hours > 0 ? `${hours}:` : '') +
    `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;

  return formattedTime;
};

module.exports = {
  play,
  getCurrentSong,
  getQueue,
  skip,
  stop,
  pause,
  resume,
  loopSong,
  loopQueue,
  shuffleQueue,
  setVolume,
};