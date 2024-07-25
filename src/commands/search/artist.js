const { SlashCommandBuilder } = require('discord.js');
const searchManager = require('../../utils/searchManager.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('artist')
    .setDescription('Search for an artist and add their songs to the queue')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('The artist to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const guild = interaction.guild;

    try {
      const searchResult = await searchManager.searchArtist(query);
      if (searchResult) {
        await musicPlayer.play(guild, searchResult);
        await interaction.reply({ content: `Added songs by ${searchResult.name} to the queue!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `No artists found for \"${query}\".`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to search for the artist.', ephemeral: true });
    }
  },
};