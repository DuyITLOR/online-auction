import { ChevronRight, Clock, Heart, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import ProductDescription from './description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tab';
import Review from './review';
import { useState } from 'react';

const similarProducts = [
  {
    id: 1,
    name: 'Chia Harvester / JBOD Kit | Up to 44x 3.5" HDDs! | Custom Frame, Cables, & PSU',
    price: 7892737,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/JBsAAeSwsttpDQoH/s-l1600.webp',
  },
  {
    id: 2,
    name: 'Thermaltake Micro ATX Mini ITX PC Case Dual Tempered Glass Compact Tower Black',
    price: 13999000,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/O68AAeSwiC1pBjeg/s-l1600.webp',
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4090 Founders Edition | 24GB GDDR6X',
    price: 44990000,
    isLike: true,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz RGB RAM Kit',
    price: 4390000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    name: 'Meta Quest 3S 256GB (Refurbished)',
    price: 4990000,
    isLike: true,
    thumbnail: 'https://i.ebayimg.com/images/g/E-4AAOSwFsJoGMRU/s-l1600.webp',
  },
  {
    id: 6,
    name: 'UMIDIGI G9 5G 6GB+128GB 6.75 Android 14 Unlocked 18W Octa Core Smartphone Good',
    price: 10990000,
    isLike: false,
    thumbnail: 'https://i.ebayimg.com/images/g/1K4AAOSwQY5mqHz6/s-l1600.webp',
  },
  {
    id: 7,
    name: '[Near MINT] Nikon AF NIKKOR 80-200mm F2.8 ED Zoom Telephoto Lens From JAPAN',
    price: 3190000,
    isLike: true,
    thumbnail: 'https://i.ebayimg.com/images/g/elAAAeSwZilpDuiw/s-l1600.webp',
  },
  {
    id: 8,
    name: 'Lian Li O11 Dynamic EVO Case | Tempered Glass | White Edition',
    price: 3990000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 9,
    name: 'Noctua NH-D15 Chromax Black | Dual Tower CPU Cooler',
    price: 2990000,
    isLike: false,
    thumbnail: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 10,
    name: 'Raspberry Pi 5 (8GB) Developer Kit | Cooling Fan + Power Adapter',
    price: 2590000,
    isLike: true,
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-98927aab2cae?auto=format&fit=crop&w=1200&q=80',
  },
];

const product = {
  id: 101,
  name: 'Meta Quest 3S 256GB (Refurbished)',
  postDate: '10/12/2025',
  editDate: '28/12/2025',
  ownerId: 'user_123',
  owner: 'Official Meta Store (4905)',
  currentPrice: 40000000,
  buyNow: 50000000,
  description: `<h1><strong>Meta Quest 3S 256GB - Refurbished</strong></h1>
<p>Discover the magic of Meta Quest 3S and get ready to experience your favorite apps in a totally new way. The possibilities are endless when you can blend digital content into your physical space. Watch movies and shows on a vibrant screen that turns any room of your house into a giant theater. Bring games to life in your living room, or step right into the action with full immersion. Hang out with friends from anywhere, but feel like you&rsquo;re in the same place, watching a concert or meeting up in Meta Horizon. Wireless and light, enjoy out-of-this-world workouts with Quest 3S that make fitness fun. With unreal experiences at an unreal price, where will you begin? See child safety guidance online; Accounts for 10+.</p>
<h3>Features:</h3>
<ol>
<li>Transform your reality and do everything you love in totally new ways. Welcome to Meta Quest 3S.</li>
<li>Have more fun with friends in Quest. Whether you&rsquo;re stepping into an immersive game with people from around the world, watching a live concert together in Meta Horizon or inviting everyone over to cast your play onto the TV.</li>
<li>Multi-tasking has never been this easy. Pull up multiple screens at once to browse the web, watch YouTube and direct message with friends &mdash; all while keeping your room in view.</li>
<li>Turn any room into your own personal theater. Dim the space around you and play shows and movies on a giant vibrant screen.</li>
<li>Access social media apps like WhatsApp, Instagram and Facebook Messenger so you can play while you stay in the group chat.</li>
<li>Move with ultimate wireless freedom and lightweight comfort when you get your heart pumping in virtual workouts or use your whole body to bust ghosts in your living room.</li>
<li>Enjoy powerful performance that brings virtual objects to life with 2X the graphical processing (GPU) compared to Meta Quest 2*. Use your hands to swipe through content or your Touch Plus Controllers for realistic sensations and fine-tuned precision. *Based on the graphic performance of the Qualcomm Snapdragon XR2 Gen 2 platform vs the Meta Quest 2 platform.</li>
<li>Feel safe to share the fun. Manage parental controls, check your child&rsquo;s daily usage, add multiple users, share content and set permissions for everyone in the family. See child safety guidance online; Accounts for 10+.</li>
</ol>
<h3>What&rsquo;s In The Box:</h3>
<ol>
<li>Meta Quest 3S headset</li>
<li>Standard Immersive Facial Interface (pre-installed)</li>
<li>Glasses Spacer</li>
<li>2 Meta Quest Touch Plus Controllers (with AA batteries included)</li>
<li>2 Wrist Straps (pre-installed)</li>
<li>Power adaptor</li>
<li>Charging cable</li>
</ol>`,
  img: [],
};

const currentUser = {
  id: 'user_123',
  name: 'Nguyễn Văn A',
};

const pictures = [
  {
    pic: 'https://i.ebayimg.com/images/g/VN4AAOSwwCloGMRS/s-l1600.webp',
  },
  {
    pic: 'https://i.ebayimg.com/images/g/giAAAOSwZPVoGMRU/s-l1600.webp',
  },
  {
    pic: 'https://i.ebayimg.com/images/g/UEQAAOSwtP1oGMRU/s-l1600.webp',
  },
  {
    pic: 'https://i.ebayimg.com/images/g/RkkAAOSwM7hoGMRU/s-l1600.webp',
  },
  {
    pic: 'https://i.ebayimg.com/images/g/E-4AAOSwFsJoGMRU/s-l1600.webp',
  },
];

const Detail = () => {
  const [image, setImage] = useState(pictures[0].pic);
  return (
    <div className='w-full flex flex-col px-10 mt-10 mb-10'>
      <div className='flex gap-5'>
        <div className='flex flex-col'>
          <div className='flex gap-3'>
            <div className='flex flex-col items-center gap-4 w-35 h-140 overflow-y-auto scroll-container-hidden-scroll pt-2'>
              {pictures.map((item, index) => (
                <div
                  onClick={() => setImage(item.pic)}
                  key={index}
                  className={`
                    w-30 min-h-30 rounded-xl
                    bg-gray-200
                    border-2 
                    ${
                      item.pic === image
                        ? 'border-teal-400 transition delay-100 duration-300 ease-in-out scale-110'
                        : 'border-gray-300'
                    }
                  `}
                >
                  <img src={item.pic} className='rounded-xl' />
                </div>
              ))}
            </div>

            <div className='border border-gray-300 rounded-xl w-190 h-140 bg-gray-200 flex justify-center items-center'>
              <img src={image} className='w-170 h-full' />
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <p className='text-2xl font-bold line-clamp-1'>{product.name}</p>
          <div className='flex items-center gap-10 mt-3'>
            <div className='flex items-center gap-1 text-gray-500'>
              <Clock className='w-4 h-4' />
              <p className='text-sm '>Đăng: {product.postDate} </p>
            </div>

            <div className='flex items-center gap-1 text-gray-500'>
              <SquarePen className='w-4 h-4' />
              <p className='text-sm '>Chỉnh sửa: {product.editDate}</p>
            </div>
          </div>
          <div className='border-spacing-0.5 border-t border-gray-200 mt-2 mb-4 w-full' />
          <div className='flex justify-start'>
            <Avatar>
              <AvatarImage src={'/gg-logo.svg'} alt='User Avatar' className='border border-gray-400 rounded-full' />
              <AvatarFallback>{'Thanh Dang'.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>

            <div className='flex items-center justify-between w-full'>
              <div className='ml-5'>
                <p className='text-sm font-semibold'> {product.owner} </p>
                <div className='flex items-center gap-3'>
                  <Link to={'/'} className='text-sm text-teal-600 font-semibold underline'>
                    Đánh giá: 10
                  </Link>
                  <Link to={'/'} className='text-sm text-gray-500 underline'>
                    Sản phẩm khác
                  </Link>
                  <Link to={'/'} className='text-sm text-gray-500 underline'>
                    Liên hệ
                  </Link>
                </div>
              </div>
              <ChevronRight className='text-end w-10 h-10 rounded-full p-2 hover:bg-gray-200' />
            </div>
          </div>

          <div className='border-spacing-0.5 border-t border-gray-200 mt-4 mb-5 w-full' />

          <div className='flex flex-col gap-2'>
            <div className='flex items-end gap-5'>
              <p className='font-semibold text-gray-700'>Giá hiện tại: </p>
              <span className='text-xl font-bold'>{product.currentPrice.toLocaleString()} VND</span>
            </div>

            <p className='text-gray-700'>Lượt ra giá: 10</p>

            <p className='text-gray-700'>Thời gian còn lại: 2 ngày </p>
          </div>

          <div className='border-spacing-0.5 border-t border-gray-200 mt-5 mb-6 w-full' />

          <div className='flex flex-col'>
            <p className='text-gray-700 font-semibold text-lg mb-2'>Đặt mức giá tối đa cho sản phẩm</p>

            <div className='flex gap-5'>
              <input
                type='number'
                defaultValue={41000000}
                min={40000000 + 1000000}
                step={100000}
                className='h-10 p-2 border text-lg border-gray-200 rounded-md focus-visible:outline-0.5 focus-visible:outline-gray-600 w-full pl-2'
              />

              <div className='bg-gray-400 p-2 font-semibold rounded-md w-15 h-10 text-center'>VND</div>
            </div>

            <p className='text-gray-600 text-xs mt-4 '>
              Mức giá tối thiểu có thể đặt là: {(41000000).toLocaleString()} VND (Bước giá: {(100000).toLocaleString()}{' '}
              VND)
            </p>
          </div>

          <Button
            variant={'outline'}
            className='bg-black text-white transition delay-150 duration-200 ease-in-out hover:scale-102 mt-8 hover:cursor-pointer h-12'
          >
            Đặt giá ngay
          </Button>

          <Button
            variant={'outline'}
            className='bg-teal-500 transition delay-150 duration-200 ease-in-out hover:scale-102 mt-5 text-gray-100 hover:cursor-pointer h-12'
          >
            <div>
              <p className='text-base'>Mua ngay</p>
              <p>{product.buyNow.toLocaleString()} VND</p>
            </div>
          </Button>
        </div>
      </div>

      <div className='border-spacing-0.5 border-t border-gray-300 mt-20 mb-5' />

      <div className='flex justify-between'>
        <p className='text-2xl font-semibold mb-5'>Sản phẩm tương tự</p>
        <Link to={'/products'} className='underline'>
          Xem thêm
        </Link>
      </div>

      <div className='flex flex-1 items-center gap-3 overflow-x-auto scroll-container h-[400px] pb-5'>
        {similarProducts.map((item) => (
          <div key={item.id} className='flex flex-col gap-2 min-w-[250px] relative'>
            <img src={item.thumbnail} className='rounded-md w-[250px] h-[250px] object-cover' />
            <p className='line-clamp-2'>{item.name}</p>
            <span className='font-semibold text-xl'>{item.price.toLocaleString()} VND</span>

            <Heart
              className={`w-10 h-10 ${
                item.isLike ? 'stroke-0 fill-red-600' : 'stroke-2'
              } absolute right-1 top-1  bg-white hover:bg-gray-100 p-2 rounded-full`}
            />
          </div>
        ))}
      </div>

      <Tabs className='mt-15' defaultValue='description'>
        <TabsList className='grid w-1/4 grid-cols-1'>
          <TabsTrigger
            className='data-[state=active]:bg-gray-100 font-semibold data-[state=active]:py-1 data-[state=active]:rounded-md '
            value='description'
          >
            Mô tả sản phẩm
          </TabsTrigger>
        </TabsList>

        <TabsContent value='description'>
          <ProductDescription product={product} currentUser={currentUser} />
        </TabsContent>
      </Tabs>

      <Review />
    </div>
  );
};

export default Detail;
