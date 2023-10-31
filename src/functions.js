const {
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

const showPlaying = async (queue, track) => {
  const buttons = getButtons();
  const embed = getPlayEmbed(track, queue);
  await queue.metadata.send({ embeds: [embed], components: [buttons] });
};

const showQueue = async (queue, track) => {
  const embed = getQueueEmbed(track);
  await queue.metadata.send({ embeds: [embed] });
};

const showSkip = async (queue, track) => {
  const embed = getSkipEmbed(track);
  await queue.metadata.send({ embeds: [embed] });
};

const showPlaylist = async (queue, tracks) => {
  const embed = playlistToEmbed(tracks);
  await queue.metadata.send({ embeds: [embed] });
};

const getPlayEmbed = (track, queue) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`📼 Now Playing ${track.title} by ${track.author}!`)
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
    .setTitle(`🎶 Queued ${track.title} by ${track.author}!`)
    .setThumbnail(track.thumbnail)
    .setDescription(`[Open in Spotify](${track.url})`)
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const getSkipEmbed = (track) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`⏭️ Skipped ${track.title} by ${track.author}!`)
    .setThumbnail(track.thumbnail)
    .setDescription(`[Open in Spotify](${track.url})`)
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const getTracksEmbed = (description) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(`🎶 Here's the Queued Songs!`)
    .setDescription(description)
    .setColor(Colors.Blue);

  return embeddedMessage;
};

const tracksToDescription = (tracks, isPlayList = false) => {
  let description = "";
  tracks.map((track, index) => {
    description += `${index + 1}. \t${track.title} by ${
      track.author
    }\n\tDuration: ${track.duration}\n${
      isPlayList ? "" : `\tRequested By: ${track.requestedBy}\n`
    }\n`;
  });
  return description;
};

const getButtons = () => {
  const playButton = new ButtonBuilder()
    .setCustomId("play")
    .setLabel("▶ Play")
    .setStyle("Success");

  const pauseButton = new ButtonBuilder()
    .setCustomId("pause")
    .setLabel("◼ Pause")
    .setStyle("Danger");

  const nextButton = new ButtonBuilder()
    .setCustomId("next")
    .setEmoji("⏭")
    .setLabel("Next")
    .setStyle("Primary");

  const showQueueButton = new ButtonBuilder()
    .setCustomId("showQueue")
    .setLabel("Show Queue")
    .setStyle("Secondary");

  const row = new ActionRowBuilder().addComponents(
    playButton,
    pauseButton,
    nextButton,
    showQueueButton
  );

  return row;
};

const playlistToEmbed = (tracks) => {
  const embeddedMessage = new EmbedBuilder()
    .setTitle(
      `Queued Playlist ${tracks[0].playlist.title} by ${tracks[0].playlist.author.name}!`
    )
    .setThumbnail(tracks[0].playlist.thumbnail)
    .setDescription(
      `[Open in Spotify](${tracks[0].playlist.url})\n\n` +
        tracksToDescription(tracks, true)
    )
    .setColor(Colors.Blue);

  return embeddedMessage;
};

module.exports = {
  showPlaying,
  showQueue,
  showSkip,
  showPlaylist,
  getTracksEmbed,
  tracksToDescription,
};
