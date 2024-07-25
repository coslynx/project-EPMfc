const { MessageEmbed } = require('discord.js');

/**
 * Creates a visualizer embed for music playback.
 * @param {string} visualizerType The type of visualizer (e.g., 'waveform', 'equalizer', 'abstract').
 * @returns {MessageEmbed} The visualizer embed.
 */
const createVisualizerEmbed = (visualizerType) => {
  const embed = new MessageEmbed()
    .setTitle('Music Visualizer')
    .setDescription(`Visualizer Type: ${visualizerType}`);

  // Add visualizer content based on the type
  switch (visualizerType) {
    case 'waveform':
      embed.setImage('https://example.com/waveform_visualizer.gif');
      break;
    case 'equalizer':
      embed.setImage('https://example.com/equalizer_visualizer.gif');
      break;
    case 'abstract':
      embed.setImage('https://example.com/abstract_visualizer.gif');
      break;
    default:
      embed.setDescription('Invalid visualizer type. Please choose from waveform, equalizer, or abstract.');
      break;
  }

  return embed;
};

module.exports = {
  createVisualizerEmbed,
};