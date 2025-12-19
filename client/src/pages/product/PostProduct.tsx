import PostProduct from '../../components/product/postProduct';
import Footer from '../../components/footer';

const PostProductPage = () => {
  return (
    <>
      <div className='min-h-screen bg-gray-50'>
        {/* <Header /> */}
        <PostProduct />
        <Footer />
      </div>
    </>
  );
};

export default PostProductPage;
