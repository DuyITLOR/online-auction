import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ label = 'Select option', items = [] }: { label: string; items: string[] }) => {
  const [open, setOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutSide(e: any) {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  return (
    <div className='w-40 relative'>
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between w-full border border-gray-300 px-2 py-1 rounded-md'
      >
        {label}

        <ChevronDown className='w-5 h-5' />
      </button>

      {open && (
        <ul className='absolute w-full bg-white left-0 border border-gray-200 mt-0.5 rounded-md z-10'>
          {items.map((item: string, index: number) => (
            <li
              key={index}
              className='px-4 py-1 hover:text-white cursor-pointer hover:bg-gray-300 '
              onClick={() => {
                console.log('open', item);
                setOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
