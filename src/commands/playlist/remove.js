const { SlashCommandBuilder } = require('discord.js');
const playlistManager = require('../../utils/playlistManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a song from a playlist')
    .addStringOption(option =>
      option
        .setName('playlist')
        .setDescription('The name of the playlist')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('The song to remove')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist');
    const songToRemove = interaction.options.getString('song');
    const guild = interaction.guild;

    try {
      await playlistManager.removeSongFromPlaylist(guild, playlistName, songToRemove);
      await interaction.reply({ content: `Song \"${songToRemove}\" removed from playlist \"${playlistName}\"!`, ephemeral: true });
    } catch (error) {
      console.error(error);
      if (error.message === 'Playlist not found') {
        await interaction.reply({ content: `Playlist \"${playlistName}\" not found.`, ephemeral: true });
      } else if (error.message === 'Song not found in playlist') {
        await interaction.reply({ content: `Song \"${songToRemove}\" not found in playlist \"${playlistName}\".`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to remove the song from the playlist.', ephemeral: true });
      }
    }
  },
};