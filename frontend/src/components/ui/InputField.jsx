import PropTypes from "prop-types";

const InputField = ({
  value,
  label,
  placeholder,
  type,
  name,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="mb-1 font-semibold">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        className={`border rounded-md p-2 bg-slate-900 ${error ? "!border-red-500" : "border-gray-300!"}`}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
};

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  validators: PropTypes.arrayOf(PropTypes.func),
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

InputField.defaultProps = {
  label: "",
  placeholder: "",
  error: null,
};

export default InputField;
