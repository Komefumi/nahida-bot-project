import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandConfig, CommandNameEnum, KitaabSubEnum } from "./type";

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
      .setDescription("Books! | !کتابیں")
      .addSubcommand((subcommand) =>
        subcommand

          .setName(KitaabSubEnum.LIST_BOOKS)
          .setDescription("List Books | کتابوں کی فہروت بنایٔں")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(KitaabSubEnum.ADD_BOOK)
          .setDescription("Add Book | کتاب شامل کریں")
          // TODO: Validation incluing string length
          .addStringOption((option) =>
            option
              .setName("book_name")
              .setDescription("Name of book | کتاب کا نام")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("book_location")
              .setDescription("Book Link | کتاب کا مقام")
              .setRequired(true)
          )
      ),
    async execute(interaction: ChatInputCommandInteraction) {
      const subName = interaction.options.getSubcommand();
      switch (subName as KitaabSubEnum) {
        case KitaabSubEnum.LIST_BOOKS: {
          await interaction.reply("Listing books");
        }
        case KitaabSubEnum.ADD_BOOK: {
          const name = interaction.options.getString("book_name");
          const location = interaction.options.getString("book_location");
          await interaction.reply(`${name} - ${location}`);
        }
        default: {
          await interaction.reply("Unkonwn sub command");
        }
      }
      await interaction.reply("Books! (کتابیں)");
    },
  },
] as CommandConfig[];
