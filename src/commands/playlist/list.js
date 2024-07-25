const { SlashCommandBuilder } = require('discord.js');
const playlistManager = require('../../utils/playlistManager.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all playlists')
    .addStringOption(option =>
      option
        .setName('user')
        .setDescription('The user whose playlists to list (optional)')
    ),
  async execute(interaction) {
    const guild = interaction.guild;
    const targetUser = interaction.options.getString('user');

    try {
      const playlists = await playlistManager.listPlaylists(guild, targetUser);

      if (playlists.length === 0) {
        await interaction.reply({ content: 'No playlists found.', ephemeral: true });
        return;
      }

      let playlistList = playlists.map(playlist => `- ${playlist.name}`).join('\n');

      await interaction.reply({ content: `**${targetUser ? `${targetUser}'s ` : ''}Playlists:**\n\n${playlistList}`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to list the playlists.', ephemeral: true });
    }
  },
};