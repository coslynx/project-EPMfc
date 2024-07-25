const { SlashCommandBuilder } = require('discord.js');
const { defaultVolume, allowedMusicSources } = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage server music settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('volume')
        .setDescription('Set the default volume')
        .addIntegerOption(option =>
          option
            .setName('volume')
            .setDescription('Volume level (0-100)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('sources')
        .setDescription('Manage allowed music sources')
        .addStringOption(option =>
          option
            .setName('source')
            .setDescription('Music source to add or remove (youtube, spotify, soundcloud)')
            .setRequired(true)
            .addChoices(
              { name: 'YouTube', value: 'youtube' },
              { name: 'Spotify', value: 'spotify' },
              { name: 'SoundCloud', value: 'soundcloud' }
            )
        )
        .addBooleanOption(option =>
          option
            .setName('add')
            .setDescription('Whether to add or remove the source')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'volume') {
      const volume = interaction.options.getInteger('volume');
      if (volume < 0 || volume > 100) {
        await interaction.reply({ content: 'Invalid volume level. Please enter a value between 0 and 100.', ephemeral: true });
        return;
      }

      // Update the volume setting in the database (if using MongoDB)
      // ...

      await interaction.reply({ content: `Default volume set to ${volume}%`, ephemeral: true });
    } else if (subcommand === 'sources') {
      const source = interaction.options.getString('source');
      const addSource = interaction.options.getBoolean('add');

      if (addSource) {
        if (allowedMusicSources.includes(source)) {
          await interaction.reply({ content: `${source} is already allowed.`, ephemeral: true });
          return;
        }

        allowedMusicSources.push(source);
        // Update the allowed music sources in the database (if using MongoDB)
        // ...

        await interaction.reply({ content: `${source} added to allowed music sources.`, ephemeral: true });
      } else {
        if (!allowedMusicSources.includes(source)) {
          await interaction.reply({ content: `${source} is not currently allowed.`, ephemeral: true });
          return;
        }

        allowedMusicSources.splice(allowedMusicSources.indexOf(source), 1);
        // Update the allowed music sources in the database (if using MongoDB)
        // ...

        await interaction.reply({ content: `${source} removed from allowed music sources.`, ephemeral: true });
      }
    }
  }
};