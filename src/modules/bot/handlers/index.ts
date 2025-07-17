import { Bot } from 'grammy';
import { UserService } from 'src/modules/user/user.service';
import { CheckedUrlService } from 'src/modules/checkedurl/checkedurl.service';
import { UserRequestService } from 'src/modules/user-request/user-request.service';
import { startCommand } from './commands/start.command';
import { myChatMemberEvent } from './events/my-chat-member.event';

import { EmergencyService } from 'src/modules/emergency/emergency.service';
import { messageEvent } from './events/message.event';
import { callbackQueryEvent } from './events/callback_query.event';
import { UrlTypeService } from 'src/modules/url-type/url-type.service';
import { GroupService } from 'src/modules/group/group.service';

export const registerHandlers = (
  bot: Bot,
  userService: UserService,
  emergencyService: EmergencyService,
  checkedUrlService: CheckedUrlService,
  userRequestService: UserRequestService,
  urlTypeService: UrlTypeService,
  groupService: GroupService,
) => {
  startCommand(bot, userService);
  myChatMemberEvent(bot, userService, groupService);
  messageEvent(bot, userService, emergencyService, checkedUrlService, userRequestService, urlTypeService);
  callbackQueryEvent(bot, userService, emergencyService);
};
