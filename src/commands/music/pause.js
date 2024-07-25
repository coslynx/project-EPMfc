const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause music playback'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      await musicPlayer.pause(guild);
      await interaction.reply({ content: 'Paused playback!', ephemeral: true });
    } catch (error) {
      console.error(error);
      if (error.message === 'Music is not playing') {
        await interaction.reply({ content: 'There is no music currently playing.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to pause the music.', ephemeral: true });
      }
    }
  },
};