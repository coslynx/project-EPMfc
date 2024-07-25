const { SlashCommandBuilder } = require('discord.js');
const searchManager = require('../../utils/searchManager.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('song')
    .setDescription('Search for a song and add it to the queue')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('The song to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const guild = interaction.guild;

    try {
      const searchResult = await searchManager.search(query);
      if (searchResult) {
        await musicPlayer.play(guild, searchResult);
        await interaction.reply({ content: `Added song \"${searchResult.title}\" to the queue!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `No songs found for \"${query}\".`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to search for the song.', ephemeral: true });
    }
  },
};