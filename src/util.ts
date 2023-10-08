import { REST } from "discord.js";

const { BOT_TOKEN } = process.env;

export const discordREST = new REST().setToken(BOT_TOKEN as string);
