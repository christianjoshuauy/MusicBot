const { EmbedBuilder, Colors } = require("discord.js");

const showPlaying = async (queue, track) => {
  const embed = getPlayEmbed(track, queue);
  await queue.metadata.send({ embeds: [embed] });
};

const showQueue = async (queue, track) => {
  const embed = getQueueEmbed(track);
  await queue.metadata.send({ embeds: [embed] });
};

const showSkip = async (queue, track) => {
  const embed = getSkipEmbed(track);
  await queue.metadata.send({ embeds: [embed] });
};

const getPlayEmbed = (track, queue) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`Now Playing ${track.title} by ${track.author}!`)
    .setThumbnail(track.thumbnail)
    .setDescription(
      `[Open in Spotify](${
        track.url
      })\n${queue.node.createProgressBar()}\n\nRequested By - ${
        track.requestedBy
      }`
    )
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const getQueueEmbed = (track) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`Queued ${track.title} by ${track.author}!`)
    .setThumbnail(track.thumbnail)
    .setDescription(`[Open in Spotify](${track.url})`)
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const getSkipEmbed = (track) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`Skipped ${track.title} by ${track.author}!`)
    .setThumbnail(track.thumbnail)
    .setDescription(`[Open in Spotify](${track.url})`)
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const getTracksEmbed = (description) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`Here's the Queued Songs!`)
    .setDescription(description)
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const tracksToDescription = (tracks) => {
  let description = "";
  tracks.map((track, index) => {
    description += `${index + 1}. \t${track.title} by ${
      track.author
    }\n\tDuration: ${track.duration}\n\tRequested By: ${track.requestedBy}\n\n`;
  });
  return description;
};

module.exports = {
  showPlaying,
  showQueue,
  showSkip,
  getTracksEmbed,
  tracksToDescription,
};
