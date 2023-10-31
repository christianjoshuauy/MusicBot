const { QueryType } = require("discord-player");
const { EmbedBuilder, Colors } = require("discord.js");
const { tracksToDescription } = require("../functions");
const {
  setSearching,
  isSearching,
  getSearchMsgId,
} = require("../states/searchState");

const search = async (interaction, player, queue) => {
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
    return void interaction.followUp({
      content: "❌ | Could not join your voice channel!",
    });
  }

  await interaction.followUp({
    content: `⏱ | Loading your ${
      searchResult.playlist ? "playlist" : "track"
    } search results...`,
  });

  if (isSearching()) {
    const pastMsg = await queue.metadata.messages.fetch(getSearchMsgId());
    await pastMsg.delete();
  }

  const embed = new EmbedBuilder()
    .setTitle(`Your Search Results - "${query}"`)
    .setThumbnail(searchResult.tracks[0].thumbnail)
    .setDescription(tracksToDescription(searchResult.tracks, true))
    .setColor(Colors.Blue);

  const msg = await queue.metadata.send({ embeds: [embed] });
  setSearching(msg.id, searchResult.tracks);
};

module.exports = {
  search,
};
