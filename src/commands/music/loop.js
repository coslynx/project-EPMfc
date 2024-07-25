const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loop the current song or the entire queue')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of loop to enable')
        .setRequired(true)
        .addChoices(
          { name: 'Song', value: 'song' },
          { name: 'Queue', value: 'queue' }
        )
    ),
  async execute(interaction) {
    const loopType = interaction.options.getString('type');
    const guild = interaction.guild;

    try {
      if (loopType === 'song') {
        await musicPlayer.loopSong(guild);
        await interaction.reply({ content: 'Looping the current song!', ephemeral: true });
      } else if (loopType === 'queue') {
        await musicPlayer.loopQueue(guild);
        await interaction.reply({ content: 'Looping the entire queue!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Invalid loop type. Please choose "song" or "queue".', ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to enable the loop.', ephemeral: true });
    }
  }
};