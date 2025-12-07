import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

import "./ServiceDetails.css";

import { CategoryData } from "../../utils/CatogoryData.jsx";
import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";

import RatingDetails from "../../components/customer/ServiceDetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/ServiceDetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/ServiceDetails/ServiceCard.jsx";
import ReviewList from "../../components/customer/ServiceDetails/ReviewList";
import ReviewForm from "../../components/customer/ServiceDetails/ReviewForm.jsx";

import PopUp from "../../components/customer/CustomerNegotiationModal"; 
// 💥 Yeh import zaroor correct path pe hona chahiye

const Service = () => {
  const { serviceId } = useParams();

  // Popup open/close state
  const [open, setOpen] = useState(false);

  // Get the service object from CategoryData
  const service = CategoryData.flatMap((cat) => cat.services).find(
    (srv) => srv.id === serviceId
  );

  if (!service) return <p>Service not found</p>;

  const mediaList = service.img.map((src) => ({ type: "image", src }));
  const [selectMedia, setSelectMedia] = useState(mediaList[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [latestReview, setLatestReview] = useState(null);

  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="dj">
      <div className="section_one">
        {/* Left Section */}
        <div className="left-fixed">
          <div className="dj-img">
            <div className="thumbnail-list">
              {mediaList.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectMedia(media)}
                  className="li1"
                >
                  <img src={media.src} alt={`media-${index}`} />
                </div>
              ))}
            </div>

            <div className="big-image">
              <img src={selectMedia.src} alt="Selected media" />
            </div>
          </div>

          <div className="buttons">
            <button
              className={`viewBtns ${isWishlisted ? "wishlisted" : ""}`}
              onClick={handleClick}
            >
              <div>
                {isWishlisted && <FaHeart className="wishIcon" color="red" />}
              </div>
              <div>
                {isWishlisted ? (
                  "Added to Cart"
                ) : (
                  <span className="wishlist-text">
                    <span className="plusSign">+</span> Add to cart
                  </span>
                )}
              </div>
            </button>

            {/* ⭐ BOOK NOW Button - Popup Open */}
            <button className="buynow" onClick={() => setOpen(true)}>
              Book Now
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-scrollable">
          <DJServiceCard service={service} />

          <div className="why-choose">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>5-Star Rated Wedding DJs</li>
              <li>Backup Equipment Always On-Hand</li>
              <li>Experience With All Cultures & Traditions</li>
              <li>Custom Packages & Friendly Support</li>
            </ul>
          </div>

          <div className="reviews">
            <h3>DJ Ratings & Reviews</h3>

            <RatingDetails />
            <hr />

            <h4 style={{ marginTop: "30px", fontWeight: "bold" }}>
              Write a Review
            </h4>
            <ReviewForm onNewReview={(review) => setLatestReview(review)} />

            <ReviewList newReview={latestReview} />
          </div>
        </div>
      </div>

      {/* Similar Services */}
      <div className="view-dj-section">
        <h2 className="people-also-book">People Also Booked</h2>
        <div className="view-dj">
          {similarServiceData.map((product) => (
            <SimilarProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ⭐ POPUP MODAL */}
      {open && <PopUp onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Service;
