import AsideChat from '../../components/chat/AsideChat';
import ChatBox from '../../components/chat/ChatBox';
import { UserContext } from '../../libs/contexts/user.context';
import { toast } from 'sonner';
import { useState, useEffect, useMemo, useContext } from 'react';
import { getSession } from '../../libs/session';
import { getAllChats } from '../../api/chat';
import Spinner from '../../components/chat/Spinner';
import { socket } from '../../libs/contexts/user.context';
import type { dataDto } from '../../components/chat/Card';

export interface chat {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  buyerAvt: string;
  sellerId: string;
  sellerName: string;
  sellerAvt: string;
}

const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<chat[]>([]);
  const [chatIdx, setChatIdx] = useState(-1);
  const [filterChat, setFilterChat] = useState('');

  const { user } = useContext(UserContext);

  const updateFilter = (value: string) => {
    setFilterChat(value);
  };

  const updateChatIdx = (idx: number) => {
    setChatIdx(idx);
  };

  const data = useMemo(() => {
    const tmp = [] as dataDto[];

    chats.map((item) => {
      if (item.buyerId === user?.id) {
        const dump = {
          id: item.id,
          productName: item.productName,
          productId: item.productId,
          avtUrl: item.sellerAvt,
          name: item.sellerName,
        } as dataDto;

        tmp.push(dump);
      } else {
        const dump = {
          id: item.id,
          productName: item.productName,
          productId: item.productId,
          avtUrl: item.buyerAvt,
          name: item.buyerName,
        } as dataDto;

        tmp.push(dump);
      }
    });

    return tmp;
  }, [chats, user]);

  const filterData = useMemo(() => {
    const keyword = filterChat.toLowerCase();
    return data.filter(
      (item) =>
        item.productName.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword)
    );
  }, [filterChat, data]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const productList = [];

        if (!session?.token) {
          toast.error('Vui lòng đăng nhập');
          return;
        }
        const chats = await getAllChats(
          String(session.token),
          controller.signal
        );
        setChats(chats);

        for (const chat of chats) {
          productList.push(chat.productId);
        }

        socket.emit('subscribe', productList);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Đã xảy ra lỗi');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className='w-screen h-screen flex'>
      {isLoading && <Spinner />}
      {!isLoading && (
        <AsideChat
          data={filterData}
          chatIdx={chatIdx}
          updateChatIdx={updateChatIdx}
          updateFilter={updateFilter}
        />
      )}
      {chatIdx !== -1 && (
        <ChatBox
          chatInfor={filterData[chatIdx]}
          updateChatIdx={updateChatIdx}
        />
      )}
    </div>
  );
};

export default ChatPage;
