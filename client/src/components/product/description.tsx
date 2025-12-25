import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import type { Product, User } from '../../libs/types/types';
import { PlusCircle } from 'lucide-react';
import { updateProduct } from '../../api/product';

const ProductDescription = ({
  product,
  currentUser,
  token,
}: {
  product: Product;
  currentUser: User | undefined;
  token: string;
}) => {
  const isOwner = currentUser && product.sellerId === currentUser.id;

  const [isAdding, setIsAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [fullDescription, setFullDescription] = useState(product.description);
  const [newContent, setNewContent] = useState('');

  const handleSave = async () => {
    setUpdating(true);
    if (!newContent || newContent.trim() === '<p><br></p>') {
      setIsAdding(false);
      return;
    }
    const data = await updateProduct({ id: product.id, description: newContent, token: token });

    setFullDescription(data.description);

    setNewContent('');
    setIsAdding(false);
    setUpdating(false);
  };

  const handleCancel = () => {
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className='border flex flex-col border-gray-200 px-4 py-3 mb-5 rounded-md bg-white shadow-sm'>
      <div
        className='view-mode ql-editor'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(fullDescription),
        }}
      />

      {isOwner && !isAdding && (
        <div className='flex justify-end mt-4 pt-3 border-t border-gray-100'>
          <button
            onClick={() => setIsAdding(true)}
            className='flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-semibold transition-colors'
          >
            <PlusCircle className='w-4 h-4' />
            Bổ sung mô tả
          </button>
        </div>
      )}

      {isAdding && (
        <div className='editor-mode mt-4 animate-in fade-in slide-in-from-top-2 duration-200'>
          <div className='flex items-center gap-2 mb-2 text-sm font-bold text-gray-700'>
            <span>✏️ Đang viết cập nhật cho ngày {new Date().toLocaleDateString('vi-VN')}</span>
          </div>

          <ReactQuill
            theme='snow'
            value={newContent}
            onChange={setNewContent}
            placeholder='Nhập thông tin bổ sung'
            className='bg-white'
          />

          <div className='flex items-center gap-3 justify-end mt-3'>
            <button
              onClick={handleSave}
              className='px-4 py-2 text-sm font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm'
            >
              {!updating ? 'Lưu bổ sung' : 'Đang cập nhật...'}
            </button>
            <button
              onClick={handleCancel}
              className='px-4 py-2 text-sm font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
