const { REST, Routes, Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
const { play, playFromSearch } = require("./src/commands/play");
const {
  showPlaying,
  showQueue,
  showSkip,
  showPlaylist,
} = require("./src/functions");
const { skip } = require("./src/commands/skip");
const { stop } = require("./src/commands/stop");
const { getQueue } = require("./src/commands/queue");
const { search } = require("./src/commands/search");
const { isSearching, getTrackFromNumber } = require("./src/states/searchState");
const { resetPlaying, getPlayMsgId } = require("./src/states/playState");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
require("dotenv").config();

const commands = [
  {
    name: "play",
    description: "Plays a song",
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
    name: "search",
    description: "Searches a song",
    type: 1,
    options: [
      {
        name: "query",
        type: 3,
        description: "The song you want to search",
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

let queue;

client.on("messageCreate", (message) => {
  if (message.author.bot || !isSearching()) return;

  const content = message.content.trim();
  const number = parseInt(content);

  if (!isNaN(number) && Number.isInteger(number)) {
    if (number >= 1 && number <= 20) {
      playFromSearch(getTrackFromNumber(number), queue);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  queue = player.nodes.create(interaction.guild, {
    metadata: interaction.channel,
  });

  if (interaction.isButton()) {
    const { customId } = interaction;

    if (customId === "play") {
      if (queue.node.isPaused()) {
        queue.node.resume();
        queue.metadata.send("▶️ | Song resumed!");
      }
      await interaction.deferUpdate();
    } else if (customId === "pause") {
      if (queue.node.isPlaying()) {
        queue.node.pause();
        queue.metadata.send("⏸ | Song paused!");
      }
      await interaction.deferUpdate();
    } else if (customId === "next") {
      skip(interaction, player, queue);
    } else if (customId === "showQueue") {
      getQueue(interaction, player, queue);
    }
  } else {
    if (interaction.commandName === "play") {
      await play(interaction, player, queue);
    } else if (interaction.commandName === "skip") {
      await skip(interaction, player, queue);
    } else if (interaction.commandName === "stop") {
      await stop(interaction, player, queue);
    } else if (interaction.commandName === "queue") {
      await getQueue(interaction, player, queue);
    } else if (interaction.commandName === "search") {
      await search(interaction, player, queue);
    }
  }
});

client.login(process.env.CLIENT_TOKEN);

let player = new Player(client);
(async () => {
  await player.extractors.loadDefault((ext) => ext !== "YoutubeExtractor");
})();

player.events.on("error", (queue, error) => {
  console.log(`General player error event: ${error.message}`);
  console.log(error);
});

player.on("connectionError", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

player.events.on("playerStart", (queue, track) => {
  showPlaying(queue, track);
});

player.events.on("audioTrackAdd", (queue, track) => {
  showQueue(queue, track);
});

player.events.on("audioTracksAdd", (queue, tracks) => {
  showPlaylist(queue, tracks);
});

player.events.on("playerSkip", (queue, track) => {
  showSkip(queue, track);
});

player.events.on("disconnect", (queue) => {
  queue.metadata.send(
    "❌ | I was manually disconnected from the voice channel, clearing queue!"
  );
});

player.events.on("emptyChannel", (queue) => {
  queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.events.on("emptyQueue", async (queue) => {
  const lastMessage = await queue.metadata.messages.fetch(getPlayMsgId());
  await lastMessage.delete();
  resetPlaying();
  queue.metadata.send("✅ | Queue finished! Closing the Player...");
});
