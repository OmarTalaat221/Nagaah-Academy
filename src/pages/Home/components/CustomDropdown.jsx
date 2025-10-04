import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  name,
  className,
  onFocus,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isFocused = useRef(false);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);

    // Call onBlur after selection if provided
    if (onBlur) {
      setTimeout(() => {
        onBlur({ target: { name, value: optionValue } });
      }, 100);
    }
  };

  const handleDropdownClick = () => {
    const wasOpen = isOpen;
    setIsOpen(!isOpen);

    // Call onFocus when opening dropdown
    if (!wasOpen && onFocus && !isFocused.current) {
      isFocused.current = true;
      onFocus({ target: { name, value } });
    }
  };

  const handleDropdownClose = () => {
    setIsOpen(false);

    // Call onBlur when closing dropdown
    if (onBlur && isFocused.current) {
      isFocused.current = false;
      setTimeout(() => {
        onBlur({ target: { name, value } });
      }, 100);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          handleDropdownClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleDropdownClick();
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          handleDropdownClose();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          if (onFocus && !isFocused.current) {
            isFocused.current = true;
            onFocus({ target: { name, value } });
          }
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          if (onFocus && !isFocused.current) {
            isFocused.current = true;
            onFocus({ target: { name, value } });
          }
        }
        break;
    }
  };

  // Handle native focus events
  const handleNativeFocus = () => {
    if (onFocus && !isFocused.current) {
      isFocused.current = true;
      onFocus({ target: { name, value } });
    }
  };

  const handleNativeBlur = (event) => {
    // Only blur if the focus is not moving to a child element
    if (!dropdownRef.current?.contains(event.relatedTarget)) {
      if (onBlur && isFocused.current) {
        isFocused.current = false;
        setTimeout(() => {
          onBlur({ target: { name, value } });
        }, 100);
      }
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onFocus={handleNativeFocus}
      onBlur={handleNativeBlur}
    >
      <motion.div
        tabIndex={0}
        className={`${className} w-full p-3 pl-[4rem] border-2 rounded-xl cursor-pointer transition-all duration-300 focus:outline-none ${
          error
            ? "border-red-300 bg-red-50"
            : `border-gray-300 bg-white hover:border-[#ffd700] focus:border-[#ffd700] ${
                isFocused.current
                  ? "border-[#ffd700] shadow-[0_0_0_3px_rgba(255,215,0,0.1)]"
                  : ""
              }`
        }`}
        onClick={handleDropdownClick}
        onKeyDown={handleKeyDown}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
      >
        <div className="flex justify-between items-center">
          <span
            className={`text-right ${
              selectedOption ? "text-black" : "text-gray-500"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          display: isOpen ? "block" : "none",
        }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        role="listbox"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            className={`p-3 pl-[4rem] hover:bg-[#ffd700] hover:bg-opacity-10 cursor-pointer text-right transition-colors duration-200 ${
              selectedOption?.value === option.value
                ? "bg-[#ffd700] bg-opacity-20"
                : ""
            }`}
            onClick={() => handleSelect(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(option.value);
              }
            }}
            whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
            role="option"
            aria-selected={selectedOption?.value === option.value}
            tabIndex={-1}
          >
            {option.label}
          </motion.div>
        ))}
      </motion.div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={handleDropdownClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleDropdownClose();
            }
          }}
        />
      )}
    </div>
  );
};

export default CustomDropdown;
