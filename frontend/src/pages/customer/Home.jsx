import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";

// Images
import shaadiDesktop from "../../assets/home/sliderImages/shaadiDesktop.jpeg"; 

import CategoryCard from "../../components/customer/Home/CategoryCard";
import ReviewSlider from "../../components/customer/Home/ReviewSlider";
import FaqSection from "../../components/customer/Home/FaqSection";

import Milestones from "../../components/common/aboutus/Milestones";
import categories from "../../utils/CatogoryData.jsx";

const Home = () => {
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  // State for Vendor Popup
  const [showVendorModal, setShowVendorModal] = useState(false);

  // References
  const categoriesRef = useRef(null);

  // Scroll Handler
  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Toggle Vendor Modal
  const toggleVendorModal = () => {
    setShowVendorModal(!showVendorModal);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/`,
          { withCredentials: true }
        );
        const { user, accessToken } = response.data.data;
        if (user && accessToken) {
          localStorage.setItem("currentlyLoggedIn", "true");
          localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
        }
      } catch (error) {
        console.log("error in noLogin :", error.data?.data?.message || error.message);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="home">
      
      {/* Hero Section */}
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${shaadiDesktop})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect, Book, & Celebrate <br /> 
              <span className="hero-highlight">All In One Place</span>
            </h1>
            
            <p className="hero-subtitle">
              The ultimate platform connecting users with trusted local vendors. 
              Whether you need <strong>Room Booking in Kota</strong>, <strong>Catering</strong>, 
              <strong>Musical Bands</strong>, or <strong>Photographers</strong>, we have it all.
            </p>

            <div className="hero-description-small">
              <p>Looking to grow? Register as a <strong>Vendor</strong> to list your services.</p>
              <p>Looking for the best? Join as a <strong>User</strong> and book instantly.</p>
            </div>

            <div className="hero-buttons">
              <button className="primary-btn" onClick={scrollToCategories}>
                Find a Service
              </button>
              
              {/* Updated Button to trigger modal */}
              <button className="secondary-btn" onClick={toggleVendorModal}>
                Join as Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div 
        ref={categoriesRef} 
        className="categories-head1 mb-[-15px] mt-10"
      >
        <h1 className="align_center categories-head">Categories</h1>
      </div>
      
      <p className="category-subheads text-center">
        Explore trusted professionals across categories and simplify your event
        planning.
      </p>

      {/* View All Button */}
      <div className="flex justify-end w-full items-center mb-4">
        {!showAll && categories.length > 6 && (
          <button
            className="browse-all-btn "
            onClick={() => setShowAll(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            View All <span className="arrow">{hovered ? "⇒" : "→"}</span>
          </button>
        )}
      </div>

      {/* Category Grid */}
      <div className="align_center category_section">
        {visibleCategories.map((category, index) => (
          <div key={index}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      <Milestones />
      <ReviewSlider />
      <FaqSection />

      {/* --- VENDOR ONBOARDING MODAL --- */}
      {showVendorModal && (
        <div className="modal-overlay" onClick={toggleVendorModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={toggleVendorModal}>&times;</button>
            
            <div className="modal-header">
              <h2>Become a Partner</h2>
              <p>Follow these 4 simple steps to start selling your services</p>
            </div>

            <div className="stepper-container">
              {/* Step 1 */}
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-details">
                  <h3>Create User Account</h3>
                  <p>Sign up as a normal user first to get access to the platform.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-details">
                  <h3>Find 'Be a Vendor'</h3>
                  <p>Once logged in, look for the <b>"Be a Vendor"</b> button in the top navigation bar.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-details">
                  <h3>Register Business</h3>
                  <p>Complete the vendor registration form with your basic details.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-details">
                  <h3>List Services</h3>
                  <p>Add your events, products, pricing, and photos to showcase your work.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="primary-btn full-width-btn" onClick={toggleVendorModal}>
                Got it, Let's Start!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;