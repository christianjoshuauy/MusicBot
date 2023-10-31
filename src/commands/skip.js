const skip = async (interaction, player, queue) => {
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
    content: `⏭️ | Skipping your track...`,
  });
  if (queue.isPlaying()) {
    await queue.node.skip();
  } else {
    await interaction.followUp({
      content: `❌ | Nothing is playing...`,
    });
  }
};

module.exports = {
  skip,
};
