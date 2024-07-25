const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');
const playlistManager = require('../../utils/playlistManager.js');
const searchManager = require('../../utils/searchManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a playlist')
    .addStringOption(option =>
      option
        .setName('playlist')
        .setDescription('The name of the playlist to play')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist');
    const guild = interaction.guild;

    try {
      const playlist = await playlistManager.getPlaylist(guild, playlistName);
      if (playlist) {
        const searchResults = await Promise.all(playlist.songs.map(song => searchManager.search(song)));
        const validSearchResults = searchResults.filter(result => result);

        if (validSearchResults.length > 0) {
          await musicPlayer.play(guild, validSearchResults[0]);
          await interaction.reply({ content: `Now playing playlist: ${playlistName}!`, ephemeral: true });
        } else {
          await interaction.reply({ content: `No valid songs found in playlist "${playlistName}".`, ephemeral: true });
        }
      } else {
        await interaction.reply({ content: `Playlist "${playlistName}" not found.`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to play the playlist.', ephemeral: true });
    }
  },
};