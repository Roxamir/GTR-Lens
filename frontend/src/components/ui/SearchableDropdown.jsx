import { useState, useRef, useEffect } from "react";

const SearchableDropdown = ({
  options,
  selected,
  onSelect,
  placeholder = "Search or select an option",
  displayKey,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter the options based on the search term
  const filteredOptions = options.filter(
    (option) =>
      option &&
      option[displayKey] &&
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle what happens when an option is clicked
  const handleOptionClick = (option) => {
    onSelect(option);
    setSearchTerm(""); // Clear search term after selection
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block mb-1 font-semibold text-white">Equipment</label>
      <div
        className={`border rounded-md p-2 bg-slate-900 cursor-pointer flex justify-between items-center ${
          error ? "border-red-500" : "border-gray-500"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? selected[displayKey] : placeholder}
        <span
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          &#x25BC;
        </span>
      </div>
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 border rounded-md bg-slate-900 mt-1 shadow-lg">
          <input
            type="text"
            className="w-full p-2 border-b focus:outline-none"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="p-2 hover:bg-red-900 cursor-pointer"
                  onClick={() => handleOptionClick(option)}
                >
                  {option[displayKey]}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
