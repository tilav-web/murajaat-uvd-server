import { Bot } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { EmergencyService } from 'src/modules/emergency/emergency.service';
import { EmergencyStatus } from 'src/modules/emergency/schemas/emergency.schema';

export const callbackQueryEvent = (
  bot: Bot,
  userService: UserService,
  emergencyService: EmergencyService,
) => {
  bot.on('callback_query:data', async (ctx) => {
    const [action, groupMessageId] = ctx.callbackQuery.data.split(':');
    const user = await userService.findOne(ctx.from.id);

    if (!user) {
      return;
    }

    const groupId = process.env.GROUP_ID;
    if (!groupId) {
      console.error('GROUP_ID .env faylda topilmadi.');
      await ctx.answerCallbackQuery({
        text: 'Xatolik yuz berdi. Iltimos, keyinroq urinib koʻring.',
        show_alert: true,
      });
      return;
    }

    try {
      let statusText = '';
      let emergencyStatus: EmergencyStatus;

      if (action === 'confirm_emergency') {
        statusText = '✅ <b>Tasdiqlangan xabar:</b>';
        emergencyStatus = EmergencyStatus.CONFIRMED;
      } else if (action === 'cancel_emergency') {
        statusText = '❌ <b>Bekor qilingan xabar:</b>';
        emergencyStatus = EmergencyStatus.CANCELED;
      } else {
        await ctx.answerCallbackQuery({
          text: 'Nomaʼlum amal.',
          show_alert: true,
        });
        return;
      }

      // Update the emergency record in the database
      const updatedEmergency = await emergencyService.updateEmergencyStatus(
        parseInt(groupMessageId, 10),
        emergencyStatus,
      );

      if (!updatedEmergency) {
        await ctx.answerCallbackQuery({
          text: 'Xatolik yuz berdi. Murojaat topilmadi.',
          show_alert: true,
        });
        return;
      }

      const userTelegramId = updatedEmergency.user.telegram_id;
      const userFullName = updatedEmergency.user.full_name || '';
      const userUsername = updatedEmergency.user.username ? `@${updatedEmergency.user.username}` : '';
      const userPhone = updatedEmergency.user.phone || '';

      const userDetails = `Foydalanuvchi ma'lumotlari:\nID: ${userTelegramId}\nTo'liq ism: ${userFullName}\nUsername: ${userUsername}\nTelefon: ${userPhone}\n\n`;

      if (updatedEmergency.message_type === 'text') {
        newText = `${statusText}\n\n${userDetails}${updatedEmergency.message_content}`;
      } else if (
        updatedEmergency.message_type === 'photo' ||
        updatedEmergency.message_type === 'video' ||
        updatedEmergency.message_type === 'document' ||
        updatedEmergency.message_type === 'audio' ||
        updatedEmergency.message_type === 'voice' ||
        updatedEmergency.message_type === 'animation'
      ) {
        newCaption = `${statusText}\n\n${userDetails}${updatedEmergency.message_content || ''}`;
