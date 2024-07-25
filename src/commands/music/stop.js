const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the current song and clear the queue'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      await musicPlayer.stop(guild);
      await interaction.reply({ content: 'Stopped playback and cleared the queue!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to stop the music.', ephemeral: true });
    }
  },
};