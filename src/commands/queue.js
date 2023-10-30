const { tracksToDescription, getTracksEmbed } = require("../functions");

const getQueue = async (interaction, player, queue) => {
  await interaction.deferReply();

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
    content: `⏱ | Fetching the queue...`,
  });
  if (queue.isPlaying()) {
    if (queue.tracks === undefined || queue.tracks.size === 0) {
      await interaction.followUp({
        content: `⏱ | Queue is empty...`,
      });
    } else {
      const description = tracksToDescription(queue.tracks);
      await interaction.followUp({
        embeds: [getTracksEmbed(description)],
      });
    }
  } else {
    await interaction.followUp({
      content: `⏱ | Bot is not playing...`,
    });
  }
};

module.exports = {
  getQueue,
};
