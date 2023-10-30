const { QueryType } = require("discord-player");

const play = async (interaction, player, queue) => {
  await interaction.deferReply();

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
    void player.deleteQueue(interaction.guildId);
    return void interaction.followUp({
      content: "Could not join your voice channel!",
    });
  }

  await interaction.followUp({
    content: `⏱ | Loading your ${
      searchResult.playlist ? "playlist" : "track"
    }...`,
  });
  searchResult.playlist
    ? queue.addTracks(searchResult.tracks)
    : queue.addTrack(searchResult.tracks[0]);
  if (!queue.isPlaying()) {
    await queue.node.play();
  }
};

module.exports = {
  play,
};
