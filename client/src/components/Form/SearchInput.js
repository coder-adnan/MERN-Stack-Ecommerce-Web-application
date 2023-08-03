import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center">
      <form className="flex" role="search" onSubmit={handleSubmit}>
        <input
          style={{
            width: "30vw",
          }}
          className="
          px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-blue-500"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={e => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-500"
          type="submit"
        >
          <BsSearch className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
