import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import type { Product, User } from '../../libs/types/types';

const ProductDescription = ({ product, currentUser }: { product: Product; currentUser: User }) => {
  const isOwner = currentUser && product.sellerId === currentUser.id;

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(product.description);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(description);
    setIsEditing(false);
  };

  return (
    <div className='border border-gray-200 px-3 py-2 mb-5'>
      {isEditing ? (
        <div className='editor-mode'>
          <ReactQuill theme='snow' value={description} onChange={setDescription} />

          <div className='flex items-center gap-3 justify-end mt-5 mb-4'>
            <button
              onClick={handleSave}
              className='border border-gray-300 px-2 text-sm font-semibold h-10 w-15 rounded-md bg-teal-500 text-white'
            >
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className='border border-gray-300 px-1 text-sm font-semibold h-10 w-15 rounded-md bg-slate-200'
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div
          className='view-mode ql-editor '
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description),
          }}
        />
      )}
    </div>
  );
};

export default ProductDescription;
