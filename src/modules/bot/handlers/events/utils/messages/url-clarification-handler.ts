import * as stringSimilarity from 'string-similarity';
import {
  CheckedUrl,
  CheckedUrlDocument,
  CheckedUrlStatus,
} from 'src/modules/checkedurl/schemas/checkedurl.schema';
import { CheckedUrlService } from 'src/modules/checkedurl/checkedurl.service';
import { UserRequestService } from 'src/modules/user-request/user-request.service';
import { UrlTypeService } from 'src/modules/url-type/url-type.service';
import { UrlTypeDocument } from 'src/modules/url-type/schemas/url-type.schema';
import { UserService } from 'src/modules/user/user.service';
import { isValidUrl } from './url-validator';

export const handleUrlClarification = async (
  ctx: any,
  userService: UserService,
  checkedUrlService: CheckedUrlService,
  userRequestService: UserRequestService,
  urlTypeService: UrlTypeService,
) => {
  const user = await userService.findOne(ctx.from.id);

  if (user && user.action === 'awaiting_clarify_url') {
    const url = ctx.message.text;

    if (!isValidUrl(url)) {
      await ctx.reply(
        'Yuborgan maʼlumotingiz URL emas. Iltimos, toʻgʻri URL yuboring.',
      );
      return true;
    }

    let checkedUrl: CheckedUrlDocument | null =
      await checkedUrlService.findOneByUrl(url);

    let urlType: string | undefined;
    const allUrlTypes = await urlTypeService.findAll();
    const lowerCaseUrl = url.toLowerCase();

    let foundUrlType: UrlTypeDocument | undefined;
    for (const type of allUrlTypes) {
      if (type.name && lowerCaseUrl.includes(type.name.toLowerCase())) {
        foundUrlType = type;
        break;
      }
    }

    if (foundUrlType) {
      urlType = foundUrlType._id.toString();
    } else {
      // Find or create 'others' type
      let othersType = allUrlTypes.find(
        (type: UrlTypeDocument) => type.name.toLowerCase() === 'others',
      );
      if (!othersType) {
        // If 'others' type does not exist, create it
        othersType = await urlTypeService.create({
          name: 'Others',
          description: 'Other types of URLs',
        });
      }
      urlType = othersType._id.toString();
    }

    if (checkedUrl) {
      // URL already exists in CheckedUrl collection
      let message = '';
      switch (checkedUrl.status) {
        case CheckedUrlStatus.ALLOWED:
          message = 'Bu URL ruxsat etilgan.';
          break;
        case CheckedUrlStatus.BLOCKED:
          message = 'Bu URL taqiqlangan.';
          if (checkedUrl.category) {
            message += ` Sababi: ${checkedUrl.category}.`;
          }
          break;
        case CheckedUrlStatus.PENDING:
          message = 'Bu URL tekshirilmoqda. Iltimos, kuting.';
          break;
        case CheckedUrlStatus.UNKNOWN:
          message = 'Bu URL holati nomaʼlum. Tekshirilmoqda.';
          break;
      }
      await ctx.reply(message);

      // Create a user request for this existing checkedUrl
      await userRequestService.create({
        user: user._id.toString(),
        checkedUrl: checkedUrl._id.toString(),
      });
    } else {
      // URL does not exist, check for similarity
      const allCheckedUrls = await checkedUrlService.findAll();
      let mostSimilarUrl: CheckedUrl | null = null;
      let highestSimilarity = 0;

      for (const existingUrl of allCheckedUrls) {
        const similarity = stringSimilarity.compareTwoStrings(
          url,
          existingUrl.url,
        );
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarUrl = existingUrl;
        }
      }

      if (highestSimilarity >= 0.7 && mostSimilarUrl) {
        // If similarity is 70% or more, consider it blocked
        checkedUrl = await checkedUrlService.create({
          url: url,
          status: CheckedUrlStatus.BLOCKED,
          category: mostSimilarUrl.category, // Copy category from similar URL
          type: urlType, // Assign identified URL type
        });
        await ctx.reply(
          `Siz yuborgan URL (${url}) bazadagi taqiqlangan URLga juda o'xshash (${(
            highestSimilarity * 100
          ).toFixed(2)}%). Shu sababli u taqiqlangan deb topildi.`,
        );
      } else {
        // Otherwise, set to PENDING for admin review
        checkedUrl = await checkedUrlService.create({
          url: url,
          status: CheckedUrlStatus.PENDING,
          type: urlType, // Assign identified URL type
        });
        await ctx.reply(
          'URL qabul qilindi va tekshirish uchun yuborildi. Natija haqida xabar beramiz.',
        );
      }

      // Create a user request for the newly created checkedUrl
      await userRequestService.create({
        user: user._id.toString(),
        checkedUrl: checkedUrl._id.toString(),
      });
    }
    // Reset user action after processing the URL
    await userService.update(user.telegram_id, {
      action: null,
    });
    return true;
  }
  return false;
};
