import React, { useState, useEffect, useRef } from "react";
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import TestimonialsSlider from "../components/testimonials/TestimonialsSlider";
const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [entireProducts, setEntireProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const targetDivRef = useRef(null);
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
    getEntireProducts();
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

  const getEntireProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
      );
      setEntireProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
    if (checked.length || radio.length) {
      filterProduct();
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
  // slider settings
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: false,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024, // Medium-sized devices and above
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // Small devices (tablets)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 680, // Smaller devices (phones)
        settings: {
          slidesToShow: 1,
        },
      },
    ],
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
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => window.location.reload(true)}
            >
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
          <Slider {...settings} className="flex flex-wrap products-slider">
            {entireProducts?.map(p => (
              <div className="hover:cursor-pointer card  my-2" key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name.substring(0, 20)}...</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
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
                <div className="shadow-md rounded-md hover:cursor-pointer  hover:scale-110 relative overflow-hidden">
                  {/* border-black-300 border-2 border-solid */}
                  <Link to={`/category/${category.slug}`}>
                    <img
                      className="object-cover w-full h-48 rounded-md"
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
        {/* displaying girls category categories Starting*/}
        <h1
          style={{
            fontFamily: "serif",
            fontSize: "3em",
          }}
          className="bg-slate-100 py-10 text-center"
        >
          <span className="text-black">Unleashing the best</span>
          <span className="text-red-600 text-6xl"> offers...</span>
        </h1>
        <div className="bg-slate-100 pt-2 girlsCategory-container flex justify-center align-content-center">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="left-container"
          >
            <h1 className={`${isHovered ? "visible" : "hidden"}`}>
              Girls Collections
            </h1>
            <Link to={"/category/girls-collection"}>
              <img
                className="mt-2 w-full"
                src="http://localhost:3000/assets/girlscategory.jpg"
                alt="Girls category"
              />
            </Link>
          </div>
          {console.log(entireProducts)}
          <div className="right-container">
            {entireProducts
              .filter(c => c.category._id === "64bababb2e22bedaaa5258b0")
              .slice(0, 8)
              .map(c => (
                <div
                  className="bg-slate-400 mr-2 w-44 flex flex-col items-center justify-center hover:cursor-pointer girlsCategory-card pt-2 my-2"
                  key={c._id}
                >
                  <img
                    key={c._id}
                    className="rounded-lg h-48 w-40"
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${c._id}`}
                    alt={c.name}
                  />
                  <div className="card-body">
                    <div className="ml-4 card-name-price">
                      <h5 className="text-sm card-title">
                        {c.name.substring(0, 6)}...
                      </h5>
                      <h5 className="mr-4 card-title card-price">
                        {c.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <div className="card-btn flex flex-col justify-center">
                      <button
                        className="read-more-btn hover:border-solid hover:border-1 hover:border-black btn-width bg-black text-white btn ms-1"
                        onClick={() => navigate(`/product/${c.slug}`)}
                      >
                        Read More
                      </button>
                      <button
                        className="hover:border-solid hover:border-1 hover:border-black bg-sky-500 mt-1 btn-width btn ms-1"
                        onClick={() => {
                          setCart([...cart, c]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, c])
                          );
                          toast.success("Item Added to Cart");
                        }}
                      >
                        All to cart <AddShoppingCartIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* displaying girls category categories end*/}
        {/* displaying some products*/}
        <div ref={targetDivRef} className="col-span-9 entireProducts">
          <h1
            style={{ fontFamily: "Verdana" }}
            className="my-16 ml-36 text-4xl text-black relative inline-flex items-center"
          >
            <span className="translate-y-1 w-28 border-b-2 border-y-gray-400"></span>
            <span className="px-4">New Arrivals</span>
            <span className="translate-y-1 w-28 border-b-2 border-gray-400"></span>
          </h1>
          <div className="flex gap-2 mb-16 flex-wrap justify-center">
            {products?.map(p => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="group h-52 ml-2 mt-24 w-60 my-16 mb-28 ">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="h-36 shadow-md p-4 card-img-top transition-transform transform group-hover:scale-110"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <div className="flex flex-col gap-2 align-items-center">
                      <h5 className="mt-4 w-40 rounded-md text-lg text-center bg-orange-200 card-title">
                        {p.name.substring(0, 15)}
                      </h5>
                      <p className="text-center card-text mb-3">
                        {p.description.substring(0, 25)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Loadmore products */}

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
                  <div className="flex justify-center">
                    <p className="bg-blue-500 w-32 text-white rounded-md">
                      Loadmore
                    </p>
                    <p className="bg-blue-500 w-12 -ml-2 flex align-items-center text-white rounded-md">
                      <AiOutlineReload />
                    </p>
                  </div>
                </>
              )}
            </button>
          )}
        </div>
        {/* displaying the testimonials */}
        <div className="bg-gray-100 py-10 ml-6 mt-16">
          <TestimonialsSlider />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
