import {
  REST,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import { UnexpectedError } from "./error";

export const prisma = new PrismaClient();

const { BOT_TOKEN } = process.env;

export const discordREST = new REST().setToken(BOT_TOKEN as string);

export function makeSlashCommand(name: string, description: string) {
  return new SlashCommandBuilder().setName(name).setDescription(description);
}

export function makeSubCommand(
  sub: SlashCommandSubcommandBuilder,
  name: string,
  description: string
) {
  return sub.setName(name).setDescription(description);
}

export function makeStringOption(
  option: SlashCommandStringOption,
  name: string,
  description: string = "",
  required: boolean = true
) {
  return option.setName(name).setDescription(description).setRequired(required);
}

export function printFull(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

export function runWithThrowUnexpectedError(
  fnToRun: () => Promise<void>,
  customErrorMessage: undefined | string = undefined
) {
  try {
    fnToRun();
  } catch (error) {
    const args: [Error, string | undefined] = [error, customErrorMessage];
    throw new UnexpectedError(...args);
  }
}
