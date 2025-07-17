import { Bot, Keyboard } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { UserStatus } from 'src/modules/user/schemas/user.schema';
import { CLARIFY_BUTTON_TEXT, REPORT_BUTTON_TEXT } from '../../constants';

export const startCommand = (bot: Bot, userService: UserService) => {
  bot.command('start', async (ctx) => {
    console.log('Start command received from user:', ctx.from.id);
    const from = ctx.from;
    if (!from) {
      console.log('ctx.from is undefined. Returning.');
      return;
    }
    const user = await userService.findOne(from.id);
    if (user && user.status === UserStatus.BLOCK) {
      console.log('User is blocked. Returning.');
      return;
    }
    const telegram_id = from.id;
    const full_name = `${from.first_name} ${from.last_name || ''}`.trim();
    const username = from.username;

    let updatedUser = user;
    if (!updatedUser) {
      console.log('User not found in DB. Creating new user.');
      updatedUser = await userService.create({
        telegram_id,
        full_name,
        username,
      });
    } else {
      console.log('User found in DB. Status:', updatedUser.status);
      if (updatedUser.status === UserStatus.NOT_ACTIVE) {
        updatedUser.status = UserStatus.ACTIVE;
        await updatedUser.save();
        console.log('User status updated to ACTIVE.');
      }
    }

    const keyboard = new Keyboard()
      .text(REPORT_BUTTON_TEXT)
      .text(CLARIFY_BUTTON_TEXT)
      .resized();

    await ctx.reply(
      'Assalomu alaykum! Bu bot orqali siz noqonuniy harakatlar haqida xabar berishingiz yoki maʼlumotlarni aniqlashtirishingiz mumkin.',
      {
        reply_markup: keyboard,
      },
    );
    console.log('Welcome message and keyboard sent.');
  });
};
