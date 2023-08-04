import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { salesSlider } from "../components/salesSlider/salesSlider";
import { categoriesData } from "../components/categoriesData/categoriesImgs";
const HomePage = () => {
  let categoriesIndex = 0;
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  //getTotal Count
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

  //get filtered product
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
  //setting girls category section visibility
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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
        <div className="deals-container col-md-9 bg-slate-100">
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
        <div className="my-7 flex align-center justify-center text-center">
          <h1
            style={{ fontFamily: "Verdana" }}
            className="text-4xl text-black relative inline-flex items-center"
          >
            <span className="translate-y-1 w-28 border-b-2 border-y-gray-400"></span>
            <span className="px-4">More To Love</span>
            <span className="translate-y-1 w-28 border-b-2 border-gray-400"></span>
          </h1>
        </div>

        {/* banner image */}
        <Slider
          dots={false}
          infinite={true}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          pauseOnHover={false}
          autoplaySpeed={2000}
          fade={true}
          nextArrow={<NextArrow />}
          className="sales-slider flex justify-center align-items-center hover:cursor-pointer"
        >
          {/* banner images */}
          {salesSlider.map(s => {
            return (
              <img
                key={s.id}
                src={s.image}
                className="banner-img shadow-lg"
                alt={`Slide ${s.id}`}
                style={{
                  width: "100vw !important",
                }}
              />
            );
          })}
          {/* banner images */}
        </Slider>
        {/* displaying categories start */}
        <h1 style={{ fontFamily: "serif" }} className=" mt-4 text-center">
          <span className="text-black text-5xl">Explore</span>
          <span className="text-red-500 text-2xl"> - all categories...!</span>
        </h1>
        <div className="flex flex-wrap justify-center">
          {categories.map((category, index) => (
            <>
              <div className="w-60 p-4">
                <div className="hover:cursor-pointer hover:scale-110 relative overflow-hidden">
                  {/* border-black-300 border-2 border-solid */}
                  <Link to={`/category/${category.slug}`}>
                    <img
                      className=" object-cover w-full h-48 rounded-md"
                      src={categoriesData[index].image}
                      alt={category.name}
                    />
                    <h1
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: ".8em",
                        marginTop: ".5em",
                      }}
                      className="text-black text-center"
                    >
                      {category.name}
                    </h1>
                  </Link>
                </div>
              </div>
            </>
          ))}
        </div>
        {/* displaying categories end */}
        {/* displaying kitchen category categories end */}
        <div className="girlsCategory-container flex justify-center align-content-center">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="left-container"
          >
            <h1 className={`${isHovered ? "visible" : "hidden"}`}>
              Girls Collections
            </h1>
            <img
              className="w-full"
              src="http://localhost:3000/assets/girlscategory.jpg"
              alt="Girls category"
            />
          </div>
          <div className="right-container">
            {products
              .filter(c => c.category === "64bababb2e22bedaaa5258b0")
              .map(c => (
                <>
                  <img
                    key={c._id}
                    className=""
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${c._id}`}
                    alt={c.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{c.name}</h5>
                      <h5 className="card-title card-price">
                        {c.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">
                      {c.description.substring(0, 60)}...
                    </p>
                    <div className="card-actions">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/product/${c.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark ms-1"
                        onClick={() => {
                          setCart([...cart, c]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, c])
                          );
                          toast.success("Item Added to Cart");
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
