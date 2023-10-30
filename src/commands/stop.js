const stop = async (interaction, player, queue) => {
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
    content: `⏱ | Stopping the bot...`,
  });
  if (queue.isPlaying()) {
    await queue.node.stop();
  } else {
    await interaction.followUp({
      content: `⏱ | Bot is not playing...`,
    });
  }
};

module.exports = {
  stop,
};
