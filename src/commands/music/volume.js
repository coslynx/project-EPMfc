const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the playback volume')
    .addIntegerOption(option =>
      option
        .setName('volume')
        .setDescription('Volume level (0-100)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const volume = interaction.options.getInteger('volume');
    if (volume < 0 || volume > 100) {
      await interaction.reply({ content: 'Invalid volume level. Please enter a value between 0 and 100.', ephemeral: true });
      return;
    }

    try {
      await musicPlayer.setVolume(interaction.guild, volume / 100);
      await interaction.reply({ content: `Volume set to ${volume}%`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to adjust the volume.', ephemeral: true });
    }
  }
};