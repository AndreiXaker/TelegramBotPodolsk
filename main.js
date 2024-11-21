const { Telegraf } = require('telegraf');
const { User } = require('./db'); 
require('dotenv').config();
const bot = new Telegraf(`${process.env.BOT_TOKEN}`); 

bot.start(async (ctx) => {
  const userId = ctx.message.from.id;

  const userExist = await User.findOne({ where: { telegram_id: userId } });

  if (userExist) {
    return ctx.reply('Вы уже отправляли данные');
  }

  const keyboard = {
    reply_markup: {
      one_time_keyboard: true,
      resize_keyboard: true, 
      keyboard: [
        [{ text: "📞 Обратная связь", request_contact: true }],
      ],
    },
  };
  const startMessage = `<b>Добро пожаловать!</b>\n`


  await ctx.replyWithPhoto(
    {source : './photo.jpg'},
    {
      caption: startMessage, 
      parse_mode: 'HTML', 
      ...keyboard,
    }
  );
});





bot.on('message', async (ctx) => {
  if (ctx.message && ctx.message.from) {
    const id = ctx.message.from.id; 
    const username = ctx.message.from.username || 'Не указан';
    const contact = ctx.message.contact?.phone_number || 'Нет телефона';

    console.log(`ID пользователя: ${id}`);
    console.log(`Имя пользователя: ${username}`);
    console.log(`Телефон: ${contact}`);

    try {
      
      await User.findOrCreate({
        where: { telegram_id: id },
        defaults: {
          username: username,
          phone_number: contact,
        },
      });

      await ctx.reply(`Мы свяжемся с вами для уточнения информации ${username}`);
    } catch (err) {
      console.error('Ошибка сохранения в базу данных:', err.message);
      await ctx.reply('Произошла ошибка при сохранении данных.');
    }
  } else {
    console.log('Сообщение не содержит данных о пользователе.');
  }
});


(async () => {
  try {
    await bot.launch();
    console.log('Бот запущен');
  } catch (err) {
    console.error('Ошибка запуска бота:', err.message);
  }
})();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
