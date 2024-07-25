const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');
const searchManager = require('../../utils/searchManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('The song or playlist to play')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const guild = interaction.guild;

    try {
      const searchResult = await searchManager.search(query);
      if (searchResult) {
        await musicPlayer.play(guild, searchResult);
        await interaction.reply({ content: `Now playing: ${searchResult.title}!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `No results found for "${query}".`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to play the music.', ephemeral: true });
    }
  },
};