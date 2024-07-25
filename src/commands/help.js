const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),
  async execute(interaction) {
    const commands = interaction.client.application.commands.cache.map(command => `/${command.name}`);
    await interaction.reply({ content: `Here are all available commands:\n\n${commands.join('\n')}`, ephemeral: true });
  },
};