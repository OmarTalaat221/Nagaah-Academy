import React, { useState } from "react";
import "./contact.css";
import { FaLocationDot, FaLocationPin, FaWhatsapp } from "react-icons/fa6";
import { CiPhone } from "react-icons/ci";
import Footer from "../../components/Footer/Footer";
import { Axios } from "../../components/axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
const Contact = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const handleContact = () => {
    setContactLoading(true);
    Axios({
      method: "POST",
      // url: BASE_URL + BASES_ROUTES?.admin + API_ROUTES?.pdf?.BASE_ROUTE + API_ROUTES?.pdf?.ROUTES?.select,
    })
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .finally(() => {
        setContactLoading(false);
      });
  };
  return (
    <div className="contact_page">
      <div className="banner_contact"></div>
      <div className="contact_content">
        <div className="left">
          <div className="contact_form">
            <h4>Get In Touch</h4>
            <p>We are here for you! how can we help</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleContact();
              }}
              action=""
            >
              <input
                onChange={(e) => {
                  setContactData({ ...contactData, name: e.target.value });
                }}
                type="text"
                placeholder="Enter Your Name"
              />
              <input
                onChange={(e) => {
                  setContactData({ ...contactData, email: e.target.value });
                }}
                type="text"
                placeholder="Enter Your Email Address"
              />
              <textarea
                onChange={(e) => {
                  setContactData({ ...contactData, message: e.target.value });
                }}
                name=""
                placeholder="Go ahead We Are Listening"
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <button
                disabled={contactLoading}
                style={{ cursor: contactLoading ? "no-drop" : "pointer" }}
              >
                {contactLoading ? (
                  <div className="flex items-center justify-center animate-spin">
                    <FaSpinner />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="right">
          <img src={require("../../assets/cont2.png")} alt="" />
          {/* <div>
          <div>
            <CiPhone/>
          </div>
          <p>012544584457</p>
        </div>
        <div>
          <div>
          <FaWhatsapp/>
          </div>
          <p>012544584457</p>
        </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
