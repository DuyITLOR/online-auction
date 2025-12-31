import { useContext } from 'react';
import { UserContext } from '../../libs/contexts/user.context';
import type { Message } from './ChatBox';

interface ChatBubbleProps {
  cardInfor: Message;
}

const ChatBubble = ({ cardInfor }: ChatBubbleProps) => {
  const { user } = useContext(UserContext);

  function formatTimeAgo(dateString: string): string {
    const past = new Date(dateString).getTime();
    const now = Date.now();

    const diffMs = now - past;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) {
      return 'bây giờ';
    }

    if (diffMs < hour) {
      const mins = Math.floor(diffMs / minute);
      return `${mins} phút`;
    }

    if (diffMs < day) {
      const hours = Math.floor(diffMs / hour);
      return `${hours} tiếng`;
    }

    // >= 1 ngày → trả về ngày + giờ
    const date = new Date(past);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${dd}/${mm} ${hh}:${min}`;
  }

  const time = formatTimeAgo(cardInfor.sendAt);
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
