import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { categoriesData } from "../components/categoriesData/categoriesImgs";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container" style={{ marginTop: "100px" }}>
        {/* <div className="row container">
          {categories.map(c => (
            <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
              <div className="card">
                <Link to={`/category/${c.slug}`} className="btn cat-btn">
                  {c.name}
                </Link>
              </div>
            </div>
          ))}
        </div> */}
        {/* displaying categories start */}
        <h1 style={{ fontFamily: "serif" }} className=" mt-4 text-center">
          <span className="text-black text-5xl">Unblock the best</span>
          <span className="text-red-500 text-3xl"> - categories...!</span>
        </h1>
        <div className="flex flex-wrap justify-center">
          {categories.map((category, index) => (
            <>
              <div className="mt-8 w-60 p-4">
                <div className="hover:cursor-pointer hover:scale-110 relative overflow-hidden shadow-md rounded-md">
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
                        fontSize: "1.2em",
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
      </div>
    </Layout>
  );
};

export default Categories;
