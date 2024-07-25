const { SlashCommandBuilder } = require('discord.js');
const playlistManager = require('../../utils/playlistManager.js');
const searchManager = require('../../utils/searchManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a song to a playlist')
    .addStringOption(option =>
      option
        .setName('playlist')
        .setDescription('The name of the playlist')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('The song to add')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist');
    const songToAdd = interaction.options.getString('song');
    const guild = interaction.guild;

    try {
      const searchResult = await searchManager.search(songToAdd);
      if (searchResult) {
        await playlistManager.addSongToPlaylist(guild, playlistName, songToAdd, searchResult);
        await interaction.reply({ content: `Song "${songToAdd}" added to playlist "${playlistName}"!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `No results found for "${songToAdd}".`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      if (error.message === 'Playlist not found') {
        await interaction.reply({ content: `Playlist "${playlistName}" not found.`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to add the song to the playlist.', ephemeral: true });
      }
    }
  },
};