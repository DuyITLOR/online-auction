import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-gray-100 text-gray-300 py-8 border-t border-t-gray-300'>
      <div className='mx-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-15 text-gray-600'>
        <div>
          <h2 className='text-lg font-semibold mb-3'>Ebay</h2>
          <p className='text-sm'>
            Nền tảng thương mại điện tử toàn cầu, sàn giao dịch nơi người mua và người bán có thể kết nối, trao đổi hàng
            hóa và khám phá hàng triệu sản phẩm độc đáo mỗi ngày.
          </p>
        </div>

        <div>
          <h2 className='text-lg font-semibold mb-3'>Liên kết nhanh</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='#' className='hover:text-black transition'>
                Trang chủ
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-black transition'>
                Sản phẩm
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-black transition'>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-black transition'>
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-lg font-semibold mb-3'>Liên hệ</h2>
          <div className='flex flex-col space-y-2 text-sm'>
            <span className='flex items-center gap-2'>
              <Phone size={16} /> +84 123 456 789
            </span>
            <span className='flex items-center gap-2'>
              <Mail size={16} /> ntdang23@clc.fitus.edu.vn
            </span>
          </div>

          <div className='flex gap-4 mt-4 text-gray-500'>
            <a href='#' className='hover:text-blue-600'>
              <Facebook size={18} />
            </a>
            <a href='#' className='hover:text-pink-500'>
              <Instagram size={18} />
            </a>
            <a href='#' className='hover:text-sky-500'>
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className='mt-8 text-center text-gray-500 text-sm border-t border-gray-300 pt-4'>
        © {new Date().getFullYear()} Ares Dashboard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
