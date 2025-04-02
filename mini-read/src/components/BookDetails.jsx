import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookListContext } from "../context/BookListContext";
import { ArrowLeft, Star, Plus, Loader } from 'lucide-react';
import AddToBookListModal from "./AddToBookListModal";
import "./BookDetails.css";

const BookDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { bookLists } = useContext(BookListContext);

  useEffect(() => {
    const fetchBookInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/get_book_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: decodeURIComponent(title),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch book information");
        }

        const data = await response.json();
        setBookInfo(data.book_info);
      } catch (err) {
        console.error("Error fetching book info:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchBookInfo();
    }
  }, [title]);

  const handleAddBook = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Parse genres from string to array if needed
  const parseGenres = (genresString) => {
    if (!genresString) return [];
    try {
      // Remove brackets and single quotes, then split by commas
      return genresString
        .replace(/[\[\]']/g, "")
        .split(", ")
        .map((genre) => genre.replace(/'/g, ""));
    } catch (e) {
      console.error("Error parsing genres:", e);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="book-details-loading">
        <Loader className="loading-icon" />
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-error">
        <h2>Error loading book details</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }

  if (!bookInfo) {
    return (
      <div className="book-details-error">
        <h2>Book not found</h2>
        <button className="btn-primary" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }

  const genres = parseGenres(bookInfo.genres);

  return (
    <div className="book-details-container">
      <button className="back-button" onClick={handleGoBack}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="book-details-content">
        <div className="book-cover-container">
          <img
            src={bookInfo.coverImg || "/placeholder.svg?height=400&width=300"}
            alt={`Cover of ${bookInfo.title}`}
            className="book-cover"
          />
          <div className="book-rating">
            <Star className="star-icon filled" />
            <span>{bookInfo.rating ? bookInfo.rating.toFixed(1) : "N/A"}</span>
          </div>
        </div>

        <div className="book-info">
          <h1 className="book-title">{bookInfo.title}</h1>
          <h2 className="book-author">by {bookInfo.author}</h2>

          <div className="book-genres">
            {genres.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <div className="book-description">
            <h3>Description</h3>
            <p>{bookInfo.description}</p>
          </div>

          <button className="add-to-list-btn" onClick={handleAddBook}>
            <Plus size={20} />
            Add to Reading List
          </button>
        </div>
      </div>

      {showModal && (
        <AddToBookListModal
          book={{
            title: bookInfo.title,
            author: bookInfo.author,
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default BookDetails;
