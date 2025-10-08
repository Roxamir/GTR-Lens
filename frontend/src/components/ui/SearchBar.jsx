const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="w-full max-w-md mb-8">
      {" "}
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search equipment..."
        className="w-full px-4 py-2 border-2 border-red-500 rounded-lg 
                   focus:outline-none focus:border-red-700 text-white bg-slate-900"
      />
    </div>
  );
};

export default SearchBar;
