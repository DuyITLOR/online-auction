export interface dataDto {
  id: string;
  productName: string;
  productId: string;
  avtUrl: string;
  name: string;
}

interface CardProps {
  idx: number;
  data: dataDto;
  picked: boolean;
  switchChat: (idx: number) => void;
}

const Card = ({ idx, data, picked, switchChat }: CardProps) => {
  return (
    <div
      onClick={() => switchChat(idx)}
      className={`flex my-2 items-center h-20 p-5 cursor-pointer rounded-2xl w-full
		${picked ? 'bg-teal-500' : 'hover:bg-teal-400'}
	`}
    >
      <div className='shrink-0'>
        <img
          className='w-15 h-15 rounded-full'
          src={data.avtUrl}
          alt='Neil image'
        />
      </div>
      <div className='flex-1 min-w-0 ms-2'>
        <p className='font-medium text-heading truncate'>{data.productName}</p>
        <p className='text-sm text-body truncate'>{data.name}</p>
      </div>
    </div>
  );
};

export default Card;
