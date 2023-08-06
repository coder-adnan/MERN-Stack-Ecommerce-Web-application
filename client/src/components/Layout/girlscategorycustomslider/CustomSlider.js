import React, { useState, useEffect } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { toast } from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./CustomSlider.css";

const CustomSlider = ({ products, cart, navigate, setCart }) => {
  const category = "64bababb2e22bedaaa5258b0";
  const visibleProducts = products.filter(c => c.category === category);
  const visibleProductsCount = 5;
  const slideLength = visibleProducts.length;
  const slideInterval = 3000; // Change this value to adjust autoplay speed (in milliseconds)

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, slideInterval);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % slideLength);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? slideLength - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      <AiOutlineArrowLeft className="arrow prev" onClick={handlePrev} />
      <AiOutlineArrowRight className="arrow next" onClick={handleNext} />
      <div className="carousel-track">
        {visibleProducts.map((c, index) => (
          <div
            className={`carousel-item ${
              index === currentIndex ? "active" : ""
            }`}
            key={c._id}
          >
            <div className="w-44 flex flex-col items-center justify-center hover:cursor-pointer girlsCategory-card pt-2 my-2">
              <img
                key={c._id}
                className="rounded-lg h-48 w-40"
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${c._id}`}
                alt={c.name}
              />
              <div className="card-body">
                <div className="ml-4 card-name-price">
                  <h5 className="card-title">{c.name}</h5>
                  <h5 className="mr-4 card-title card-price">
                    {c.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <div className="flex flex-col justify-center">
                  <button
                    className="hover:border-solid hover:border-1 hover:border-black btn-width bg-black text-white btn ms-1"
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
                    Add to Cart <AddShoppingCartIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSlider;
