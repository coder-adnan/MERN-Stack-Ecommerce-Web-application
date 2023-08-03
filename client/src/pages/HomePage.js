import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import SliderImages from "../components/slider/Slider";
import "../index.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow } from "../components/NextArrow";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter(c => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"Home - Best offers "}>
      {/* Slider */}
      <SliderImages />
      {/* Slider */}
      <div className="container-fluid row mt-3 home-page">
        {/* Reset filters start */}
        <div className="col-md-3 filters">
          <div className="filter-containter-shadow bg-white rounded-lg shadow p-4">
            <h4 className="text-center text-xl font-bold mb-4">
              Filter By Category
            </h4>
            <div className="space-y-2">
              {categories?.map(c => (
                <label key={c._id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500 rounded"
                    onChange={e => handleFilter(e.target.checked, c._id)}
                  />
                  <span className="ml-2 text-gray-800">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* price filter */}
          <div className="filter-containter-shadow mt-4 bg-white rounded-lg shadow p-4">
            <h4 className="text-center text-xl font-bold mb-4">
              Filter By Price
            </h4>
            <div className="space-y-2">
              {Prices?.map(p => (
                <label key={p._id} className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-500"
                    value={p.array}
                    onChange={e => setRadio(e.target.value)}
                  />
                  <span className="ml-2 text-gray-800">{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Reset filters ending */}
        <div className="col-md-9 bg-slate-100">
          <h1 className="text-center my-5">
            <span className="text-4xl text-red-500 font-sans font-bold">
              Today's Hot
            </span>
            <span className="font-bold font-sans text-lg"> - Deals</span>
            <span className="text-2xl">...</span>
          </h1>
          {/* <div className="d-flex flex-wrap"> */}
          <Slider
            dots={false}
            infinite={true}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={true}
            pauseOnHover={false}
            autoplaySpeed={2000}
            nextArrow={<NextArrow />}
            className="flex flex-wrap"
          >
            {products?.map(p => (
              <div className="hover:cursor-pointer card  my-2" key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-actions">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to Cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          {/* </div> */}

          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={e => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        {/* banner image */}
        <img
          src="http://localhost:3000/assets/banner1.jpg"
          className="banner-img"
          alt="bannerimage"
          width={"100%"}
        />
        {/* banner image */}
      </div>
    </Layout>
  );
};

export default HomePage;
