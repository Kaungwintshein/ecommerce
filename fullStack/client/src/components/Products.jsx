import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Product from "./Product";
import CircularProgress from "@material-ui/core/CircularProgress";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products?category=${cat}`
            : "http://localhost:5000/api/products"
        );
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [cat]);
  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, cat, filters]);
  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  useEffect(() => {
    const cacheImages = async (srcArray) => {
      const promises = await srcArray.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve();
          img.onerror = reject();
        });
      });
      await Promise.all(promises);
      setIsLoading(false);
    };
    const imgs = products.map((product) => product.img);
    cacheImages(imgs);
  });

  return (
    <div className="">
      {isLoading ? (
        <div className="spinner-div">
          <CircularProgress />
        </div>
      ) : (
        <Container>
          {cat
            ? filteredProducts.map((item) => (
                <Product item={item} key={item._id} />
              ))
            : products
                .slice(0, 8)
                .map((item) => <Product item={item} key={item._id} />)}
        </Container>
      )}
    </div>
  );
};

export default Products;
