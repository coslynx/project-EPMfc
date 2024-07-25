const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      await musicPlayer.skip(guild);
      await interaction.reply({ content: 'Skipped to the next song!', ephemeral: true });
    } catch (error) {
      console.error(error);
      if (error.message === 'No songs in queue') {
        await interaction.reply({ content: 'There are no more songs in the queue.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to skip the song.', ephemeral: true });
      }
    }
  },
};