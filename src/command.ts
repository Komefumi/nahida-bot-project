import { SlashCommandBuilder } from "discord.js";
import { CommandConfig, CommandNameEnum } from "./type";

export default [
  {
    name: CommandNameEnum.SALAAM,
    data: new SlashCommandBuilder()
      .setName(CommandNameEnum.SALAAM)
      .setDescription("Assalamu Alaykum!"),
    async execute(interaction) {
      await interaction.reply(
        "وَعَلَيْكُمُ ٱلسَّلَامُ (!wa-Alaykumu s-salaamu)"
      );
    },
  },
  {
    name: CommandNameEnum.KITAAB,
    data: new SlashCommandBuilder()
      .setName(CommandNameEnum.KITAAB)
      .setDescription("Retrieve books!"),
    async execute(interaction) {
      await interaction.reply("Books! (کتابیں)");
    },
  },
] as CommandConfig[];
