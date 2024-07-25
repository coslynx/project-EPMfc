const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the music queue'),
  async execute(interaction) {
    try {
      await musicPlayer.shuffleQueue(interaction.guild);
      await interaction.reply({ content: 'Queue shuffled!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to shuffle the queue.', ephemeral: true });
    }
  }
};