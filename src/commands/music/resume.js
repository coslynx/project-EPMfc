const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume paused music playback'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      await musicPlayer.resume(guild);
      await interaction.reply({ content: 'Resuming playback!', ephemeral: true });
    } catch (error) {
      console.error(error);
      if (error.message === 'Music is not paused') {
        await interaction.reply({ content: 'Music is not currently paused.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to resume the music.', ephemeral: true });
      }
    }
  },
};