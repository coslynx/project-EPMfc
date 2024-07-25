const { SlashCommandBuilder } = require('discord.js');
const playlistManager = require('../../utils/playlistManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete a playlist')
    .addStringOption(option =>
      option
        .setName('playlist')
        .setDescription('The name of the playlist to delete')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist');
    const guild = interaction.guild;

    try {
      await playlistManager.deletePlaylist(guild, playlistName);
      await interaction.reply({ content: `Playlist "${playlistName}" deleted!`, ephemeral: true });
    } catch (error) {
      console.error(error);
      if (error.message === 'Playlist not found') {
        await interaction.reply({ content: `Playlist "${playlistName}" not found.`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to delete the playlist.', ephemeral: true });
      }
    }
  },
};