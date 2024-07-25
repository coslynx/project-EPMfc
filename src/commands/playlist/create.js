const { SlashCommandBuilder } = require('discord.js');
const playlistManager = require('../../utils/playlistManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a new playlist')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The name of the playlist')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('name');
    const guild = interaction.guild;

    try {
      await playlistManager.createPlaylist(guild, playlistName);
      await interaction.reply({ content: `Playlist "${playlistName}" created!`, ephemeral: true });
    } catch (error) {
      console.error(error);
      if (error.message === 'Playlist already exists') {
        await interaction.reply({ content: `A playlist with the name "${playlistName}" already exists.`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error trying to create the playlist.', ephemeral: true });
      }
    }
  },
};