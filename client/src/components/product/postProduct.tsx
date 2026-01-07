/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, X, DollarSign, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { getSession } from '../../libs/session';
import { toast } from 'sonner';
import { createProduct } from '../../api/product';
import type { Category } from '../../libs/types/types';
import { getCategories } from '../../api/category';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const PostProduct = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allowedExtend, setAllowedExtend] = useState(false);
  const [highRatingRequire, setHighRatingRequire] = useState(false);

  const [parentCategoryId, setParentCategoryId] = useState('');

  const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParentCategoryId(value);
    setFormData((prev) => ({ ...prev, categoryId: '' }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const childCategories = useMemo(() => {
    const parent = categories.find((c) => c.id === parentCategoryId);
    return parent ? parent.children : [];
  }, [parentCategoryId]);

  const fetchCategories = async () => {
    const categories = await getCategories();

    const categoriesMap: Record<string, Category & { children: Category[] }> = {};

    categories.forEach((cat: Category) => {
      categoriesMap[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat: Category) => {
      if (cat.parentId) {
        categoriesMap[cat.parentId].children.push(categoriesMap[cat.id]);
      }
    });

    const rootCategories = Object.values(categoriesMap).filter((cat) => !cat.parentId);
    setCategories(rootCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    startPrice: '',
    stepPrice: '',
    buyNowPrice: '',
    startTime: '',
    endTime: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      startPrice: '',
      stepPrice: '',
      buyNowPrice: '',
      startTime: '',
      endTime: '',
    });

    setAllowedExtend(false);
    setHighRatingRequire(false);
    setImages([]);
    setPreviewUrls([]);

    setParentCategoryId('');
  };

  const formatCurrency = (value: string | number) => {
    if (!value) return '';
    const cleanValue = String(value).replace(/\D/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/\./g, '');
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, [name]: rawValue ? rawValue : rawValue }));
      // console.log(formData.name);
    } else setFormData((prev) => ({ ...prev, [name]: rawValue ? rawValue : Number(rawValue) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await getSession();
      if (!session || !session.token) {
        toast.error('Vui lòng đăng nhập để đăng bán sản phẩm');
        return;
      }

      if (images.length < 3) {
        toast.error('Vui lòng chọn ít nhất 3 ảnh sản phẩm');
        return;
      }

      if (formData.name === '') {
        toast.error('Vui lòng nhập tên sản phẩm');
        return;
      }

      if (!formData.categoryId) {
        toast.error('Vui lòng chọn danh mục');
        return;
      }

      if (formData.startPrice === '') {
        toast.error('Vui lòng nhập giá khởi điểm cho sản phẩm');
        return;
      }

      if (formData.stepPrice === '') {
        toast.error('Vui lòng nhập bước giá cho sản phẩm');
        return;
      }

      if (formData.endTime === '') {
        toast.error('Vui lòng thiết lập thời gian kết thúc đấu giá cho sản phẩm');
        return;
      }

      const payload = {
        sellerId: (session?.user as any)?.id,
        categoryId: formData.categoryId,
        title: formData.name,
        description: formData.description,
        startPrice: Number(formData.startPrice),
        stepPrice: Number(formData.stepPrice),
        buyNowPrice: formData.buyNowPrice ? Number(formData.buyNowPrice) : '',
        startedAt: formData.startTime,
        endAt: formData.endTime,
        allowedExtend: allowedExtend,
        highRatingRequired: highRatingRequire,
        images: images,
      };

      console.log(session.token as string);
      await createProduct({ product: payload, token: session.token as string });

      handleResetForm();

      toast.success('Đăng bán sản phẩm thành công!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Đăng bán sản phẩm</h1>
        <p className='text-gray-500 mt-2'>Điền thông tin chi tiết để bắt đầu phiên đấu giá của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>Hình ảnh sản phẩm</h2>

            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer'
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type='file'
                multiple
                className='hidden'
                ref={fileInputRef}
                onChange={handleImageChange}
                accept='image/*'
              />
              <div className='bg-teal-100 p-3 rounded-full mb-3'>
                <Upload className='w-6 h-6 text-teal-600' />
              </div>
              <p className='text-sm font-medium text-gray-700'>Nhấn để tải ảnh lên</p>
              <p className='text-xs text-gray-500 mt-1'>Hỗ trợ JPG, PNG, WEBP (Tối thiểu 3 ảnh)</p>
            </div>

            {previewUrls.length > 0 && (
              <div className='grid grid-cols-4 gap-4 mt-4'>
                {previewUrls.map((url, index) => (
                  <div key={index} className='relative group aspect-square'>
                    <img
                      src={url}
                      alt='Preview'
                      className='w-full h-full object-cover rounded-lg border border-gray-200'
                    />
                    <button
                      type='button'
                      onClick={() => removeImage(index)}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-5'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>Thông tin chi tiết</h2>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tên sản phẩm <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Ví dụ: iPhone 15 Pro Max 256GB...'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-gray-50 rounded-lg border border-gray-100'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Danh mục chính <span className='text-red-500'>*</span>
                </label>
                <select
                  value={parentCategoryId}
                  onChange={handleParentCategoryChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white'
                >
                  <option value=''>-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='relative'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Loại sản phẩm <span className='text-red-500'>*</span>
                </label>
                <select
                  name='categoryId'
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={!parentCategoryId}
                  className={`w-full p-3 border rounded-lg outline-none bg-white ${
                    !parentCategoryId
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-teal-500'
                  }`}
                >
                  <option value=''>
                    {!parentCategoryId ? '-- Vui lòng chọn danh mục chính --' : '-- Chọn loại sản phẩm --'}
                  </option>
                  {childCategories?.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả sản phẩm</label>
              <div className='mb-10'>
                <ReactQuill
                  className='h-64 mb-5'
                  theme='snow'
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-5'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2'>
              <DollarSign className='w-5 h-5 text-teal-600' /> Thiết lập đấu giá
            </h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Giá khởi điểm (VND)</label>
                <input
                  type='text'
                  name='startPrice'
                  value={formatCurrency(formData.startPrice)}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-gray-800'
                  placeholder='0'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Bước giá (VND)</label>
                <input
                  type='text'
                  name='stepPrice'
                  value={formatCurrency(formData.stepPrice)}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none'
                  placeholder='Ví dụ: 50.000'
                />
                <p className='text-xs text-gray-500 mt-1'>Mức tăng tối thiểu cho mỗi lần trả giá.</p>
              </div>

              <div className='pt-2 border-t border-gray-100'>
                <label className='block text-sm font-medium text-teal-700 mb-1'>Giá mua ngay (VND)</label>
                <input
                  type='text'
                  name='buyNowPrice'
                  value={formatCurrency(formData.buyNowPrice)}
                  onChange={handleChange}
                  className='w-full p-3 border border-teal-200 bg-teal-50 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-teal-800 font-bold'
                />
              </div>
            </div>

            <div className='mt-8 pt-6 border-t border-gray-200'>
              <h2 className='text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2'>
                <Clock className='w-5 h-5 text-teal-600' /> Thời gian
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Thời gian bắt đầu</label>
                  <div className='relative'>
                    <input
                      type='datetime-local'
                      name='startTime'
                      value={formData.startTime}
                      onChange={handleChange}
                      className='w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm'
                    />
                    <Calendar className='w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2' />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Thời gian kết thúc</label>
                  <div className='relative'>
                    <input
                      type='datetime-local'
                      name='endTime'
                      value={formData.endTime}
                      onChange={handleChange}
                      className='w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm'
                    />
                    <Calendar className='w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2' />
                  </div>
                </div>

                <label className='flex items-center gap-2'>
                  <input
                    onClick={() => setAllowedExtend(!allowedExtend)}
                    checked={allowedExtend}
                    type='checkbox'
                    className='w-4 h-4 accent-teal-600'
                  />
                  <span className='text-sm'>Cho phép tự động gia hạn</span>
                </label>

                <label className='flex items-center gap-2'>
                  <input
                    onClick={() => setHighRatingRequire(!highRatingRequire)}
                    checked={highRatingRequire}
                    type='checkbox'
                    className='w-4 h-4 accent-teal-600'
                  />
                  <span className='text-sm'>Yêu cầu điểm uy tín lớn hơn 80%</span>
                </label>
              </div>
            </div>

            <div className='mt-6 flex gap-3'>
              <Button variant='outline' className='flex-1 h-12 border-gray-300 hover:bg-gray-100'>
                Hủy bỏ
              </Button>
              <Button
                type='submit'
                disabled={loading}
                className='flex-1 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold'
              >
                {loading ? 'Đang xử lý...' : 'Đăng bán ngay'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostProduct;
