const { REST, Routes, Client, GatewayIntentBits } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

require("dotenv").config();

const commands = [
  {
    name: "play",
    description: "Plays a song from youtube",
    type: 1,
    options: [
      {
        name: "query",
        type: 3,
        description: "The song you want to play",
        required: true,
      },
    ],
  },
  {
    name: "skip",
    description: "Skip to the current song",
  },
  {
    name: "queue",
    description: "See the queue",
  },
  {
    name: "stop",
    description: "Stop the player",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "play") {
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

    const queue = player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

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
    if (!queue.playing) await queue.play();
  }
});

client.login(process.env.CLIENT_TOKEN);

const player = new Player(client);

player.on("error", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});
player.on("connectionError", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

player.on("trackStart", (queue, track) => {
  queue.metadata.send(
    `🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
  );
});

player.on("trackAdd", (queue, track) => {
  queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
  queue.metadata.send(
    "❌ | I was manually disconnected from the voice channel, clearing queue!"
  );
});

player.on("channelEmpty", (queue) => {
  queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
  queue.metadata.send("✅ | Queue finished!");
});
