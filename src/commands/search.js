const { QueryType } = require("discord-player");
const { tracksToDescription } = require("../functions");

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

  const embed = new EmbedBuilder()
    .setTitle(`Your Search Results from - "${query}"!`)
    .setThumbnail(searchResult.tracks[0].thumbnail)
    .setDescription(tracksToDescription(searchResult.tracks, true))
    .setColor(Colors.Blue);

  await queue.metadata.send({ embeds: [embed] });
};

module.exports = {
  search,
};
