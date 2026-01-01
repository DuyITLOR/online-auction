import { useEffect, useState, useContext, useRef } from 'react';
import { getSession } from '../../libs/session';
import { getAllMessages } from '../../api/chat';
import { UserContext } from '../../libs/contexts/user.context';
import { toast } from 'sonner';
import type { dataDto } from './Card';
import ChatBubble from './ChatBubble';
import { socket } from '../../libs/contexts/user.context';
import Spinner from './Spinner';
import { formatTimeAgo, longTimeConversation } from '@/utils/format';

export interface Message {
  id: string;
  content: string;
  sendAt: string;
  avtUrl: string;
  senderId: string;
  senderName: string;
}

interface SendMessageDto {
  productId: string;
  senderId: string;
  content: string;
}

interface ReceivedMessageDto {
  id: string;
  senderId: string;
  productId: string;
  content: string;
  sendAt: string;
  sender: {
    fullname: string;
    avtUrl: string;
  };
}

interface ChatBoxProps {
  chatInfor: dataDto;
  updateChatIdx: (value: number) => void;
}

const ChatBox = ({ chatInfor, updateChatIdx = () => {} }: ChatBoxProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);

  const [timeline, setTimeline] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    if (!user) {
      throw new Error('Vui lòng đăng nhập');
    }

    const messageData: SendMessageDto = {
      productId: chatInfor.productId,
      senderId: String(user.id),
      content: message,
    };

    socket.emit('send_message', messageData);
    setMessage('');
  };

  const handleReceiveMessage = (data: ReceivedMessageDto) => {
    console.log('Received message:', data);
    const name = data.senderId === user?.id ? 'me' : data.sender.fullname;
    const msg: Message = {
      id: data.id,
      senderId: data.senderId,
      senderName: name,
      avtUrl: data.sender.avtUrl,
      content: data.content,
      sendAt: data.sendAt,
    };

    setTimeline((prev) => [...prev, msg]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline]);

  useEffect(() => {
    setTimeline([]);
  }, [chatInfor]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        const session = await getSession();
        setIsLoading(true);

        if (!session?.token) {
          toast.error('Vui lòng đăng nhập');
          return;
        }

        const messages = (await getAllMessages(
          String(session.token),
          chatInfor.productId,
          controller.signal
        )) as Message[];

        setTimeline(() => [...messages]);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Đã xảy ra lỗi');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
    socket.on(`chat/${chatInfor.productId}`, handleReceiveMessage);
    return () => {
      socket.off(`chat/${chatInfor.productId}`, handleReceiveMessage);
    };
  }, [chatInfor]);

  console.log(timeline);

  return (
    <div className='flex-1 flex flex-col overflow-hidden rounded-2xl bg-slate-100'>
      {/* Header */}
      {chatInfor && (
        <div
          onClick={() => updateChatIdx(-1)}
          className='flex shrink-0 items-center gap-2.5 p-7 border-b-2 border-gray-200
        '
        >
          <div
            className='w-8 h-8 flex items-center justify-center
   rounded-full cursor-pointer
   hover:bg-gray-200 active:bg-gray-300'
          >
            &lt;
          </div>

          <img className='w-10 h-10 rounded-full' src={chatInfor.avtUrl} />
          <div className='font-medium text-heading'>
            <div>{chatInfor.productName}</div>
            <div className='text-sm font-normal text-body'>
              {chatInfor.name}
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      {isLoading && <Spinner />}
      {chatInfor && (
        <div className='flex-1 flex flex-col min-h-0 overflow-y-auto p-3 pt-4 px-5'>
          {timeline.map((item, index) => {
            if (index === 0)
              return (
                <div key={`div-${index}`} className='w-full h-full'>
                  <span className='block w-full text-center'>
                    {formatTimeAgo(item.sendAt)}
                  </span>
                  <ChatBubble key={index} cardInfor={item} />
                </div>
              );
            if (longTimeConversation(timeline[index - 1].sendAt, item.sendAt)) {
              return (
                <div key={`div-${index}`} className='w-full h-full'>
                  <span className='block w-full text-center'>
                    {formatTimeAgo(item.sendAt)}
                  </span>
                  <ChatBubble key={index} cardInfor={item} />
                </div>
              );
            }
            return <ChatBubble key={index} cardInfor={item} />;
          })}
          <div ref={bottomRef} />
        </div>
      )}
      {/* Input */}
      {chatInfor && (
        <div className='border-t shrink-0 border-slate-200 bg-white px-4 py-3 pb-9'>
          <div className='flex items-center gap-3'>
            {/* Input */}
            <input
              type='text'
              value={message}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(message);
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type a message...'
              className='
        flex-1
        rounded-xl
        border border-slate-300
        bg-slate-50
        px-4 py-2
        text-sm
        text-slate-800
        placeholder-slate-400
        focus:outline-none
        focus:border-teal-500
        focus:ring-2
        focus:ring-teal-500/20
      '
            />

            {/* Send button */}
            <button
              onClick={() => handleSendMessage(message)}
              className='
        rounded-xl
        bg-teal-500
        px-4 py-2
        text-sm
        font-medium
        text-white
        hover:bg-teal-600
        active:bg-teal-700
        transition
      '
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
