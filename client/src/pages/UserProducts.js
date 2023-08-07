import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./../styles/Homepage.css";
import UserMenu from "../components/Layout/UserMenu";

const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout>
      <div className="row dashboard ">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products?.map(p => (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                className="product-link"
              >
                <div
                  style={{
                    height: "50vh",
                  }}
                  className="card m-2"
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="w-64 card-img-top pl-9 hover:scale-110"
                    alt={p.name}
                  />
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                      bottom: "0%",
                      left: "50%",
                      height: "15%",
                      transform: "translateX(-50%)",
                      textAlign: "center",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      paddingTop: ".2em",
                    }}
                    className="products-card-body"
                  >
                    {p.name.substring(0, 25)}...
                    <br />
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  {/* <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                      }}
                      className="card-name-price "
                    >
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                    </div>
                  </div> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
