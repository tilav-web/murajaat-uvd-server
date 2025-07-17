import { UserService } from 'src/modules/user/user.service';
import { UserStatus } from 'src/modules/user/schemas/user.schema';
import { CLARIFY_BUTTON_TEXT } from 'src/modules/bot/constants';

export const handleClarifyCommand = async (
  ctx: any,
  userService: UserService,
) => {
  if (ctx.message.text === CLARIFY_BUTTON_TEXT) {
    const user = await userService.findOne(ctx.from.id);
    if (user) {
      if (user.status === UserStatus.BLOCK) {
        return true;
      }
      user.action = 'awaiting_clarify_url';
      await user.save();
    }
    await ctx.reply(
      'Iltimos, aniqlashtirmoqchi boʻlgan maʼlumotingizni yuboring.',
    );
    return true;
  }
  return false;
};
