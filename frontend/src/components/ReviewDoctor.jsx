import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ReviewDoctor = () => {
  const { backendUrl, token } = useContext(AppContext);
  const { docId } = useParams();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-reviews/${docId}`
      );
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  const submitReview = async () => {
    if (!token) {
      return toast.warning("Bạn cần đăng nhập để đánh giá");
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-review`,
        {
          doctorId: docId,
          rating,
          comment,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message || "Đánh giá thành công!");
        setComment("");
        setRating(5);
        fetchReviews(); // Refresh lại danh sách review
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [docId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-10 border-2 border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Đánh giá bác sĩ</h2>

      {/* Form đánh giá */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Số sao</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg px-4 py-2 w-full"
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} sao
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nội dung đánh giá
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
            rows="3"
            placeholder="Viết nhận xét của bạn về bác sĩ..."
          ></textarea>
        </div>

        <button
          onClick={submitReview}
          className="px-6 py-3 bg-seconds text-white rounded-lg hover:bg-opacity-90 font-semibold"
        >
          Gửi đánh giá
        </button>
      </div>

      {/* Danh sách đánh giá */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Các đánh giá gần đây
      </h3>
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-t pt-4 flex flex-col md:flex-row gap-4 items-start"
            >
              <img
                src={review.user?.image}
                alt={review.user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800">
                    {review.user?.name}
                  </h4>
                  <div className="flex gap-1">
                    {Array(review.rating)
                      .fill()
                      .map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewDoctor;
