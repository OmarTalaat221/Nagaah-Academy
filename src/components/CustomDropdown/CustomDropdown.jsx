import React, { useState, useRef, useEffect } from "react";
import { ArrowDownOutlined } from "@ant-design/icons";
import "./style.css";

const CustomDropdown = ({
  options,
  placeholder = "اختر...",
  value = "",
  onChange,
  width = "150px",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isOpen
        // !event.target.closest(".dropdown-header")
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      setSelectedOption(value);
    } else {
      setSelectedOption(options?.[0]?.value);
    }
  }, [value, options]);

  const closeDropdown = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.value);
    closeDropdown();

    if (onChange) {
      onChange(option.value);
    }
  };

  const getSelectedLabel = () => {
    const option = options?.find((opt) => opt.value == selectedOption);
    return option ? option.label : placeholder;
  };

  return (
    <div
      className={`custom-dropdown ${className}`}
      ref={dropdownRef}
      style={{ width }}
    >
      <div
        className={`dropdown-header ${disabled ? "disabled" : ""}`}
        onClick={toggleDropdown}
      >
        <span className="selected-option">{getSelectedLabel()}</span>
        <ArrowDownOutlined
          style={{ color: "#3b003b" }}
          className={`dropdown-icon  ${isOpen ? "rotate" : ""}`}
        />
      </div>

      {isOpen && (
        <ul className={`dropdown-options ${isClosing ? "closing" : ""}`}>
          {options?.map((option, index) => (
            <li
              key={index}
              className={`dropdown-option !text-[14px] ${
                option.value === selectedOption ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
