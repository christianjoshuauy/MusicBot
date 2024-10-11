const { QueryType } = require("discord-player");
const { resetSearching } = require("../states/searchState");

const play = async (interaction, player, queue) => {
  await interaction.deferReply(); // wait

  const query = interaction.options.get("query").value;
  const searchResult = await player
    .search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    })
    .catch(() => {});
  if (!searchResult || !searchResult.hasTracks())
    return void interaction.followUp({ content: "No results were found!" });

  try {
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);
  } catch {
    return void interaction.followUp({
      content: "❌ | Could not join your voice channel!",
    });
  }

  await interaction.followUp({
    content: `⏱ | Loading your ${
      searchResult.playlist ? "playlist" : "track"
    }...`,
  });
  searchResult.playlist
    ? queue.addTrack(searchResult.tracks)
    : queue.addTrack(searchResult.tracks[0]);
  if (!queue.isPlaying()) {
    await queue.node.play();
  }
};

const playFromSearch = async (track, queue) => {
  try {
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);
  } catch {
    return void interaction.followUp({
      content: "❌ | Could not join your voice channel!",
    });
  }

  await queue.metadata.send(`⏱ | Loading your track..`);
  queue.addTrack(track);
  resetSearching();
  if (!queue.isPlaying()) {
    await queue.node.play();
  }
};

module.exports = {
  play,
  playFromSearch,
};
