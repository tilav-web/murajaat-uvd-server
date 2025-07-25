import { Bot, InlineKeyboard } from 'grammy';
import { Types } from 'mongoose';
import { EmergencyService } from 'src/modules/emergency/emergency.service';
import {
  EmergencyStatus,
  EmergencyType,
} from 'src/modules/emergency/schemas/emergency.schema';
import { UserService } from 'src/modules/user/user.service';

export const handleEmergencyMessage = async (
  ctx: any,
  bot: Bot,
  userService: UserService,
  emergencyService: EmergencyService,
) => {
  const user = await userService.findOne(ctx.from.id);

  if (user && user.action === 'awaiting_emergency_message') {
    const groupId = process.env.GROUP_ID;
    if (!groupId) {
      await ctx.reply('Xatolik yuz berdi. Iltimos, keyinroq urinib koʻring.');
      return;
    }

    let messageType: string | undefined;
    let messageContent: string | undefined;

    if (ctx.message.text) {
      messageType = 'text';
      messageContent = ctx.message.text;
    } else if (ctx.message.photo) {
      messageType = 'photo';
      messageContent = ctx.message.caption;
    } else if (ctx.message.video) {
      messageType = 'video';
      messageContent = ctx.message.caption;
    } else if (ctx.message.document) {
      messageType = 'document';
      messageContent = ctx.message.caption;
    } else if (ctx.message.audio) {
      messageType = 'audio';
      messageContent = ctx.message.caption;
    } else if (ctx.message.voice) {
      messageType = 'voice';
      messageContent = ctx.message.caption;
    } else if (ctx.message.sticker) {
      messageType = 'sticker';
    } else if (ctx.message.animation) {
      messageType = 'animation';
      messageContent = ctx.message.caption;
    } else if (ctx.message.video_note) {
      messageType = 'video_note';
    } else if (ctx.message.contact) {
      messageType = 'contact';
    } else if (ctx.message.location) {
      messageType = 'location';
    } else if (ctx.message.venue) {
      messageType = 'venue';
    } else if (ctx.message.poll) {
      messageType = 'poll';
    } else if (ctx.message.dice) {
      messageType = 'dice';
    } else if (ctx.message.game) {
      messageType = 'game';
    } else if (ctx.message.invoice) {
      messageType = 'invoice';
    } else if (ctx.message.successful_payment) {
      messageType = 'successful_payment';
    } else if (ctx.message.passport_data) {
      messageType = 'passport_data';
    } else if (ctx.message.proximity_alert_triggered) {
      messageType = 'proximity_alert_triggered';
    } else if (ctx.message.forum_topic_created) {
      messageType = 'forum_topic_created';
    } else if (ctx.message.forum_topic_closed) {
      messageType = 'forum_topic_closed';
    } else if (ctx.message.forum_topic_reopened) {
      messageType = 'forum_topic_reopened';
    } else if (ctx.message.video_chat_started) {
      messageType = 'video_chat_started';
    } else if (ctx.message.video_chat_ended) {
      messageType = 'video_chat_ended';
    } else if (ctx.message.video_chat_participants_invited) {
      messageType = 'video_chat_participants_invited';
    } else if (ctx.message.web_app_data) {
      messageType = 'web_app_data';
    } else if (ctx.message.story) {
      messageType = 'story';
    } else if (ctx.message.chat_background_set) {
      messageType = 'chat_background_set';
    } else if (ctx.message.boost_added) {
      messageType = 'boost_added';
    } else if (ctx.message.chat_shared) {
      messageType = 'chat_shared';
    } else if (ctx.message.users_shared) {
      messageType = 'user_shared';
    } else if (ctx.message.write_access_allowed) {
      messageType = 'write_access_allowed';
    } else if (ctx.message.giveaway_created) {
      messageType = 'giveaway_created';
    } else if (ctx.message.giveaway) {
      messageType = 'giveaway';
    } else if (ctx.message.giveaway_winners) {
      messageType = 'giveaway_winners';
    } else if (ctx.message.giveaway_completed) {
      messageType = 'giveaway_completed';
    } else if (ctx.message.message_auto_delete_timer_changed) {
      messageType = 'message_auto_delete_timer_changed';
    } else if (ctx.message.new_chat_members) {
      messageType = 'new_chat_members';
    } else if (ctx.message.left_chat_member) {
      messageType = 'left_chat_member';
    } else if (ctx.message.new_chat_title) {
      messageType = 'new_chat_title';
    } else if (ctx.message.new_chat_photo) {
      messageType = 'new_chat_photo';
    } else if (ctx.message.delete_chat_photo) {
      messageType = 'delete_chat_photo';
    } else if (ctx.message.group_chat_created) {
      messageType = 'group_chat_created';
    } else if (ctx.message.supergroup_chat_created) {
      messageType = 'supergroup_chat_created';
    } else if (ctx.message.channel_chat_created) {
      messageType = 'channel_chat_created';
    } else if (ctx.message.migrate_to_chat_id) {
      messageType = 'migrate_to_chat_id';
    } else if (ctx.message.migrate_from_chat_id) {
      messageType = 'migrate_from_chat_id';
    } else if (ctx.message.pinned_message) {
      messageType = 'pinned_message';
    }

    const userTelegramId = user.telegram_id;
    const userFullName = user.full_name || '';
    const userUsername = user.username ? `@${user.username}` : '';
    const userPhone = user.phone || '';

    const userDetails = `Foydalanuvchi ma'lumotlari:
ID: ${userTelegramId}
To'liq ism: ${userFullName}
Username: ${userUsername}
Telefon: ${userPhone}

`;

    let sentMessage;

    if (ctx.message.text) {
      const fullMessageText = userDetails + ctx.message.text;
      sentMessage = await bot.api.sendMessage(groupId, fullMessageText);
    } else if (ctx.message.photo && ctx.message.photo.length > 0) {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const caption = userDetails + (ctx.message.caption || '');
      sentMessage = await bot.api.sendPhoto(groupId, fileId, { caption });
    } else if (ctx.message.video) {
      const fileId = ctx.message.video.file_id;
      const caption = userDetails + (ctx.message.caption || '');
      sentMessage = await bot.api.sendVideo(groupId, fileId, { caption });
    } else if (ctx.message.document) {
      const fileId = ctx.message.document.file_id;
      const caption = userDetails + (ctx.message.caption || '');
      sentMessage = await bot.api.sendDocument(groupId, fileId, { caption });
    } else if (ctx.message.audio) {
      const fileId = ctx.message.audio.file_id;
      const caption = userDetails + (ctx.message.caption || '');
      sentMessage = await bot.api.sendAudio(groupId, fileId, { caption });
    } else if (ctx.message.voice) {
      const fileId = ctx.message.voice.file_id;
      const caption = userDetails + (ctx.message.caption || '');
      sentMessage = await bot.api.sendVoice(groupId, fileId, { caption });
    } else if (ctx.message.sticker) {
      const fileId = ctx.message.sticker.file_id;
      sentMessage = await bot.api.sendSticker(groupId, fileId);
    } else if (ctx.message.animation) {
      const fileId = ctx.message.animation.file_id;
      const caption = userDetails + (ctx.message.caption || '');
      sentMessage = await bot.api.sendAnimation(groupId, fileId, { caption });
    } else if (ctx.message.video_note) {
      const fileId = ctx.message.video_note.file_id;
      sentMessage = await bot.api.sendVideoNote(groupId, fileId);
    } else if (ctx.message.contact) {
      const contact = ctx.message.contact;
      sentMessage = await bot.api.sendContact(
        groupId,
        contact.phone_number,
        contact.first_name,
        { last_name: contact.last_name },
      );
    } else if (ctx.message.location) {
      const location = ctx.message.location;
      sentMessage = await bot.api.sendLocation(
        groupId,
        location.latitude,
        location.longitude,
      );
    } else if (ctx.message.venue) {
      const venue = ctx.message.venue;
      sentMessage = await bot.api.sendVenue(
        groupId,
        venue.latitude,
        venue.longitude,
        venue.title,
        venue.address,
      );
    } else if (ctx.message.poll) {
      const poll = ctx.message.poll;
      sentMessage = await bot.api.sendPoll(
        groupId,
        poll.question,
        poll.options.map((opt) => opt.text),
      );
    } else if (ctx.message.dice) {
      const dice = ctx.message.dice;
      sentMessage = await bot.api.sendDice(groupId, dice.emoji);
    } else if (ctx.message.game) {
      const game = ctx.message.game;
      sentMessage = await bot.api.sendGame(parseInt(groupId, 10), game.title);
    } else if (ctx.message.invoice) {
      // Invoice ni to'g'ridan-to'g'ri yuborish murakkabroq, bu yerda oddiy xabar yuboriladi
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi hisob-faktura yubordi.',
      );
    } else if (ctx.message.successful_payment) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi muvaffaqiyatli to'lov qildi.",
      );
    } else if (ctx.message.passport_data) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi pasport ma'lumotlarini yubordi.",
      );
    } else if (ctx.message.proximity_alert_triggered) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails +
          'Foydalanuvchi yaqinlik ogohlantiruvchisini ishga tushirdi.',
      );
    } else if (ctx.message.forum_topic_created) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi forum mavzusini yaratdi.',
      );
    } else if (ctx.message.forum_topic_closed) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi forum mavzusini yopdi.',
      );
    } else if (ctx.message.forum_topic_reopened) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi forum mavzusini qayta ochdi.',
      );
    } else if (ctx.message.video_chat_started) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi video chatni boshladi.',
      );
    } else if (ctx.message.video_chat_ended) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi video chatni tugatdi.',
      );
    } else if (ctx.message.video_chat_participants_invited) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails +
          'Foydalanuvchi video chatga ishtirokchilarni taklif qildi.',
      );
    } else if (ctx.message.web_app_data) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi Web App ma'lumotlarini yubordi.",
      );
    } else if (ctx.message.story) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi hikoya yubordi.',
      );
    } else if (ctx.message.chat_background_set) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi chat fonini o'rnatdi.",
      );
    } else if (ctx.message.boost_added) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi boost qo'shdi.",
      );
    } else if (ctx.message.chat_shared) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi chatni ulashdi.',
      );
    } else if (ctx.message.users_shared) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchi foydalanuvchilarni ulashdi.',
      );
    } else if (ctx.message.write_access_allowed) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Foydalanuvchiga yozish ruxsati berildi.',
      );
    } else if (ctx.message.giveaway_created) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi sovg'a yaratdi.",
      );
    } else if (ctx.message.giveaway) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi sovg'a yubordi.",
      );
    } else if (ctx.message.giveaway_winners) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi sovg'a g'oliblarini e'lon qildi.",
      );
    } else if (ctx.message.giveaway_completed) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi sovg'ani yakunladi.",
      );
    } else if (ctx.message.message_auto_delete_timer_changed) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails +
          "Foydalanuvchi xabarni avtomatik o'chirish taymerini o'zgartirdi.",
      );
    } else if (ctx.message.new_chat_members) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Yangi chat a'zolari qo'shildi.",
      );
    } else if (ctx.message.left_chat_member) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Chat a'zosi chiqib ketdi.",
      );
    } else if (ctx.message.new_chat_title) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Chat nomi o'zgartirildi.",
      );
    } else if (ctx.message.new_chat_photo) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Chat rasmi o'zgartirildi.",
      );
    } else if (ctx.message.delete_chat_photo) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Chat rasmi o'chirildi.",
      );
    } else if (ctx.message.group_chat_created) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Guruh chati yaratildi.',
      );
    } else if (ctx.message.supergroup_chat_created) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Superguruh chati yaratildi.',
      );
    } else if (ctx.message.channel_chat_created) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + 'Kanal chati yaratildi.',
      );
    } else if (ctx.message.migrate_to_chat_id) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Chat ID ga ko'chirildi.",
      );
    } else if (ctx.message.migrate_from_chat_id) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Chat ID dan ko'chirildi.",
      );
    } else if (ctx.message.pinned_message) {
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Xabar qadab qo'yildi.",
      );
    } else {
      // Boshqa turdagi xabarlar uchun umumiy ishlov
      sentMessage = await bot.api.sendMessage(
        groupId,
        userDetails + "Foydalanuvchi noma'lum turdagi xabar yubordi.",
      );
    }

    if (!sentMessage) {
      await ctx.reply('Xabar yuborishda xatolik yuz berdi.');
      return;
    }

    await emergencyService.create({
      user: new Types.ObjectId(user._id.toString()),
      user_message_id: ctx.message.message_id,
      group_message_id: sentMessage.message_id,
      status: EmergencyStatus.PENDING,
      type: EmergencyType.PENDING,
      message_type: messageType,
      message_content: messageContent,
    });

    user.action = null;
    await user.save();

    const inlineKeyboard = new InlineKeyboard()
      .text('Tasdiqlash', `confirm_emergency:${sentMessage.message_id}`)
      .text('Bekor qilish', `cancel_emergency:${sentMessage.message_id}`);

    await ctx.reply(
      'Siz yuborgan xabar uchun javobgarlikni oʻz zimmangizga olasizmi? Yolgʻon xabar berish qonunga muvofiq javobgarlikka sabab boʻlishi mumkin.',
      {
        reply_markup: inlineKeyboard,
      },
    );
    return true;
  }
  return false;
};
