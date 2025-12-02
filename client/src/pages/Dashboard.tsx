import Footer from "../components/footer";
import Header from "../components/header";
import Banner from "../components/banner";
import DisplayProduct from "../components/displayProduct";
import NavBar from "../components/navBar";
import { useEffect, useState } from "react";
import type { Category } from "../libs/types/types";
import { getCategories } from "../api/category";

const Dashboard = () => {
  const [categories, setCategories] =
    useState<Record<string, Category & { children: Category[] }>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();

      const categoriesMap: Record<string, Category & { children: Category[] }> =
        {};

      categories.forEach((cat: Category) => {
        categoriesMap[cat.id] = { ...cat, children: [] };
      });

      categories.forEach((cat: Category) => {
        if (cat.parentId) {
          categoriesMap[cat.parentId].children.push(categoriesMap[cat.id]);
        }
      });
      setCategories(categoriesMap);
      setLoading(false);
    };

    fetchCategories();
  }, []);
  return (
    <>
      {loading && <div className='loader' />}

      {!loading && (
        <>
          <Header />
          <NavBar categories={categories || {}} />
          <Banner />
          <DisplayProduct />

          <Footer />
        </>
      )}
    </>
  );
};

export default Dashboard;
