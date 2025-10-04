import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDownOutlined } from "@ant-design/icons";

const CustomDropdown = ({
  options = [],
  placeholder = "اختر...",
  value,
  onChange,
  width = "150px",
  className = "",
  disabled = false,
  emptyMessage = "لا توجد خيارات متاحة", // New prop for empty message
  showSearch = false, // Optional search functionality
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  // Check if options is empty
  const hasOptions = options && options.length > 0;
  const isDisabled = disabled || !hasOptions;

  const closeDropdown = useCallback(() => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeDropdown]);

  const toggleDropdown = () => {
    if (isDisabled) return;
    setIsOpen((s) => !s);
  };

  const getSelectedLabel = () => {
    if (!hasOptions) {
      return emptyMessage;
    }
    const opt = options.find((o) => String(o.value) === String(value));
    return opt ? opt.label : placeholder;
  };

  return (
    <div
      className={`custom-dropdown ${className}`}
      ref={dropdownRef}
      style={{ width }}
      aria-disabled={isDisabled}
    >
      <button
        type="button"
        className={`dropdown-header ${isDisabled ? "disabled" : ""}`}
        onClick={toggleDropdown}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen && hasOptions}
      >
        <span className={`selected-option ${!hasOptions ? "empty-state" : ""}`}>
          {getSelectedLabel()}
        </span>
        <ArrowDownOutlined
          style={{
            color: isDisabled ? "#ccc" : "#3b003b",
          }}
          className={`dropdown-icon ${isOpen && hasOptions ? "rotate" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          className={`dropdown-options ${isClosing ? "closing" : ""}`}
          role="listbox"
        >
          {hasOptions ? (
            options.map((option, idx) => (
              <li
                key={idx}
                role="option"
                aria-selected={String(option.value) === String(value)}
                className={`dropdown-option !text-[14px] ${
                  String(option.value) === String(value) ? "selected" : ""
                }`}
                onClick={() => {
                  onChange?.(option.value);
                  closeDropdown();
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="dropdown-option empty-option !text-[14px]">
              <div className="empty-state-content">
                <span className="empty-icon">📭</span>
                <span className="empty-text">{emptyMessage}</span>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
