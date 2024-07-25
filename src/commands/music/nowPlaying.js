const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show information about the currently playing song'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      const currentSong = await musicPlayer.getCurrentSong(guild);

      if (!currentSong) {
        await interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
        return;
      }

      const nowPlayingEmbed = {
        color: 0x0099ff,
        title: `Now Playing: ${currentSong.title}`,
        fields: [
          { name: 'Artist', value: currentSong.artist },
        ],
        thumbnail: {
          url: currentSong.thumbnail,
        },
      };

      await interaction.reply({ embeds: [nowPlayingEmbed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to get the now playing information.', ephemeral: true });
    }
  },
};