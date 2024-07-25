const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      const queue = await musicPlayer.getQueue(guild);
      if (queue.length === 0) {
        await interaction.reply({ content: 'The queue is empty.', ephemeral: true });
        return;
      }

      let queueEmbed = {
        color: 0x0099ff,
        title: 'Music Queue',
        fields: [],
      };

      // Display up to 10 songs in the embed
      for (let i = 0; i < Math.min(queue.length, 10); i++) {
        queueEmbed.fields.push({
          name: `${i + 1}. ${queue[i].title}`,
          value: `**Artist:** ${queue[i].artist}`,
        });
      }

      // Add a field to show that there are more songs in the queue if needed
      if (queue.length > 10) {
        queueEmbed.fields.push({
          name: '...',
          value: `And ${queue.length - 10} more songs...`,
        });
      }

      await interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to get the queue.', ephemeral: true });
    }
  },
};