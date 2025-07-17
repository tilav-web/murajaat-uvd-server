import { Bot } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { EmergencyService } from 'src/modules/emergency/emergency.service';
import { CheckedUrlService } from 'src/modules/checkedurl/checkedurl.service';
import { UserRequestService } from 'src/modules/user-request/user-request.service';
import { UrlTypeService } from 'src/modules/url-type/url-type.service';

import { handleEmergencyMessage } from './utils/messages/emergency-handler';
import { handleReportCommand } from './utils/messages/report-command-handler';
import { handleClarifyCommand } from './utils/messages/clarify-command-handler';
import { handleUrlClarification } from './utils/messages/url-clarification-handler';

export const messageEvent = (
  bot: Bot,
  userService: UserService,
  emergencyService: EmergencyService,
  checkedUrlService: CheckedUrlService,
  userRequestService: UserRequestService,
  urlTypeService: UrlTypeService,
) => {
  bot.on('message', async (ctx) => {
    if (await handleEmergencyMessage(ctx, bot, userService, emergencyService)) {
      return;
    } else if (await handleReportCommand(ctx, userService)) {
      return;
    } else if (await handleClarifyCommand(ctx, userService)) {
      return;
    } else if (
      await handleUrlClarification(
        ctx,
        userService,
        checkedUrlService,
        userRequestService,
        urlTypeService,
      )
    ) {
      return;
    }
  });
};
