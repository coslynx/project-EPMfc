const { MessageEmbed } = require('discord.js');

/**
 * Builds a Discord message embed for various purposes.
 */
class EmbedBuilder {
  /**
   * Creates a new EmbedBuilder instance.
   */
  constructor() {
    this.embed = new MessageEmbed();
  }

  /**
   * Sets the title of the embed.
   *
   * @param {string} title The title of the embed.
   * @returns {EmbedBuilder} The EmbedBuilder instance.
   */
  setTitle(title) {
    this.embed.setTitle(title);
    return this;
  }

  /**
   * Sets the description of the embed.
   *
   * @param {string} description The description of the embed.
   * @returns {EmbedBuilder} The EmbedBuilder instance.
   */
  setDescription(description) {
    this.embed.setDescription(description);
    return this;
  }

  /**
   * Adds a field to the embed.
   *
   * @param {string} name The name of the field.
   * @param {string} value The value of the field.
   * @param {boolean} inline Whether to display the field inline.
   * @returns {EmbedBuilder} The EmbedBuilder instance.
   */
  addField(name, value, inline = false) {
    this.embed.addField(name, value, inline);
    return this;
  }

  /**
   * Sets the thumbnail of the embed.
   *
   * @param {string} url The URL of the thumbnail.
   * @returns {EmbedBuilder} The EmbedBuilder instance.
   */
  setThumbnail(url) {
    this.embed.setThumbnail(url);
    return this;
  }

  /**
   * Sets the color of the embed.
   *
   * @param {number} color The color of the embed.
   * @returns {EmbedBuilder} The EmbedBuilder instance.
   */
  setColor(color) {
    this.embed.setColor(color);
    return this;
  }

  /**
   * Sets the footer of the embed.
   *
   * @param {string} text The text of the footer.
   * @param {string} iconURL The URL of the footer icon.
   * @returns {EmbedBuilder} The EmbedBuilder instance.
   */
  setFooter(text, iconURL) {
    this.embed.setFooter({ text, iconURL });
    return this;
  }

  /**
   * Returns the built embed object.
   *
   * @returns {MessageEmbed} The built embed object.
   */
  build() {
    return this.embed;
  }
}

module.exports = EmbedBuilder;