import { useContext, useMemo } from 'react';
import { UserContext } from '../../libs/contexts/user.context';
import type { Message } from './ChatBox';
import { formatTimeAgo } from '@/utils/format';

interface ChatBubbleProps {
  cardInfor: Message;
}

const ChatBubble = ({ cardInfor }: ChatBubbleProps) => {
  const { user } = useContext(UserContext);

  const time = useMemo(() => {
    return formatTimeAgo(cardInfor.sendAt);
  }, [cardInfor.sendAt]);
  return (
    <div
      className={`flex items-start my-5 gap-2
	${cardInfor.senderId === String(user?.id) ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <img
        src={cardInfor.avtUrl}
        alt={
          cardInfor.senderId === String(user?.id) ? 'Bạn' : cardInfor.senderName
        }
        className='w-9 h-9 rounded-full object-cover'
      />

      {/* Bubble */}
      <div
        className={`max-w-[420px] rounded-2xl px-4 py-3 text-[#1F2937] shadow
        ${
          cardInfor.senderId === String(user?.id)
            ? 'bg-[#14B8A6]'
            : 'bg-[#F3F4F6]'
        }`}
      >
        {/* Name + time */}
        <div
          className={`flex justify-between mb-1 items-center gap-2 text-sm text-[#1F2937] ${
            cardInfor.senderId === String(user?.id) ? 'flex-row-reverse' : ''
          }`}
        >
          <span
            className={`font-semibold
            ${
              cardInfor.senderId === String(user?.id)
                ? 'text-[#FFFFFF]'
                : 'text-[#1F2937]'
            }`}
          >
            {cardInfor.senderId === String(user?.id)
              ? 'Bạn'
              : cardInfor.senderName}
          </span>
          <span
            className={`${
              cardInfor.senderId === String(user?.id)
                ? 'text=[#CCFBF1]'
                : 'text-[#9CA3AF]'
            }`}
          >
            {time}
          </span>
        </div>

        {/* Content */}
        <p
          className={`text-sm leading-relaxed
    whitespace-pre-wrap wrap-break-words break-all
    ${
      cardInfor.senderId === String(user?.id)
        ? 'text-[#FFFFFF]'
        : 'text-[#1F2937]'
    }
  `}
        >
          {cardInfor.content}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
