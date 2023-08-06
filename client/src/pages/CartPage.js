import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map(item => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //delete item
  const removeCartItem = pid => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex(item => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto">
          <div className="flex md:flex-wrap sm:flex-wrap lg:flex-nowrap flex-col md:flex-row gap-8">
            <div className="w-full md:w-7/12">
              <div className="text-center mb-8 mt-16">
                {!auth?.user ? (
                  <h1 className="text-2xl font-bold">Hello Guest</h1>
                ) : (
                  <h1 className="text-2xl font-bold">
                    Hello {auth?.token && auth?.user?.name}
                  </h1>
                )}
                <p className="text-lg mt-2">
                  {cart?.length
                    ? `You have ${cart.length} items in your cart ${
                        auth?.token ? "" : "- Please login to checkout!"
                      }`
                    : "Your Cart Is Empty"}
                </p>
              </div>
              {cart?.map(p => (
                <div
                  key={p._id}
                  className="flex items-center justify-between border-b-2 py-4"
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="w-24 h-24 object-contain"
                    alt={p.name}
                  />
                  <div className="flex-1 ml-4">
                    <p className="text-lg font-bold">{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price: {p.price}</p>
                  </div>
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full md:w-5/12">
              <div className="bg-white rounded-lg shadow-md p-4 mt-8">
                <h2 className="text-2xl font-bold">Cart Summary</h2>
                <hr className="my-4" />
                <h4 className="text-lg font-semibold">Total: {totalPrice()}</h4>
                {auth?.user?.address ? (
                  <div className="my-4">
                    <h4 className="text-lg font-semibold">Current Address</h4>
                    <p>{auth?.user?.address}</p>
                    <button
                      className="text-blue-600 font-semibold"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                ) : (
                  <div className="my-4">
                    {auth?.token ? (
                      <button
                        className="text-blue-600 font-semibold"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Update Address
                      </button>
                    ) : (
                      <button
                        className="text-blue-600 font-semibold"
                        onClick={() =>
                          navigate("/login", {
                            state: "/cart",
                          })
                        }
                      >
                        Please Login to Checkout
                      </button>
                    )}
                  </div>
                )}
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <div className="my-4">
                    <DropIn
                      options={{
                        authorization: clientToken,
                      }}
                      onInstance={instance => setInstance(instance)}
                    />
                    <button
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
