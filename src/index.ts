import "dotenv/config";
import { Client, Events, GatewayIntentBits, ChannelType } from "discord.js";
import { handleSaveSlashCommandList, registerSlashCommandList } from "./handle";
import { MyClient } from "./type";

const { BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as MyClient;

client.once(Events.ClientReady, async (c: Client) => {
  if (!c?.user) return;
  console.log(`Ready! Logged in as ${c.user.tag}`);

  await handleSaveSlashCommandList(c as MyClient);
  await registerSlashCommandList(c as MyClient);

  const channels = c.channels.cache
    .filter((chan) => chan.type === ChannelType.GuildText)
    .map((chan) => {
      const data = chan.toJSON();
      const name = (data as any)["name"];
      return name;
    });

  console.log(channels);

  // console.log(channels);
});

client.on(Events.InteractionCreate, async (interaction) => {
  const client = interaction.client as MyClient;
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return;

  const commandFn = client.commands.get(interaction.commandName);

  if (!commandFn) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await commandFn(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(BOT_TOKEN);
