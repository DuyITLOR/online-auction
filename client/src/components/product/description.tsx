import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  postDate: string;
  editDate: string;
  ownerId: string;
  owner: string;
  currentPrice: number;
  buyNow: number;
  description: string;
  img: string[];
}

interface User {
  id: string;
  name: string;
}

const ProductDescription = ({ product, currentUser }: { product: Product; currentUser: User }) => {
  const isOwner = currentUser && product.ownerId === currentUser.id;

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
      <div className='flex justify-between ml-3 mb-2'>
        <div></div>
        {isOwner && !isEditing && (
          <Button onClick={() => setIsEditing(true)} className='hover:bg-gray-200 rounded-md hover:cursor-pointer'>
            <Edit className='w-5! h-5!' />
          </Button>
        )}
      </div>

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
