import { SlashCommandBuilder } from "discord.js";
import { CommandConfig, CommandNameEnum } from "./type";

export default [
  {
    data: new SlashCommandBuilder()
      .setName(CommandNameEnum.SALAAM)
      .setDescription("Assalamu Alaykum!"),
    async execute(interaction) {
      try {
        await interaction.reply(
          "وَعَلَيْكُمُ ٱلسَّلَامُ (!wa-Alaykumu s-salaamu)"
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
] as CommandConfig[];
