import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddBook.scss';

interface Book {
  title: string;
  author: string;
  category: string;
  isbn: string;
}

export const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();

  const [bookData, setBookData] = useState<Book>({
    title: '',
    author: '',
    category: '',
    isbn: '',
  });

  const [errors, setErrors] = useState<Partial<Book>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`);

        if (response.ok) {
          const {
            title, author, category, isbn,
          } = await response.json();

          setBookData({
            title, author, category, isbn,
          });
        } else {
          throw new Error('Failed to fetch book data.');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setBookData((prevData: Book) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const formErrors: Partial<Book> = {};

    if (!bookData.title) {
      formErrors.title = 'Title is required';
    }

    if (!bookData.author) {
      formErrors.author = 'Author is required';
    }

    if (!bookData.category) {
      formErrors.category = 'Category is required';
    }

    if (!bookData.isbn) {
      formErrors.isbn = 'ISBN is required';
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      })
        .then((response) => {
          if (response.ok) {
            setSuccessMessage('Book added successfully!');
            navigate('/');
          } else {
            setErrorMessage('Failed to add book.');
          }
        })
        .catch((error) => {
          setErrorMessage(error.message || 'An error occurred. Please try again.');
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bookForm">
        <div className="bookForm__group">
          <label htmlFor="title" className="bookForm__label">
            Book title:
            {' '}
            <input
              type="text"
              id="title"
              name="title"
              value={bookData.title}
              required
              onChange={handleInputChange}
              className="bookForm__input"
            />
            {errors.title && <span className="bookForm__error">{errors.title}</span>}
          </label>
        </div>
        <div className="bookForm__group">
          <label htmlFor="author" className="bookForm__label">
            Author name:
            {' '}
            <input
              type="text"
              id="author"
              name="author"
              value={bookData.author}
              required
              onChange={handleInputChange}
              className="bookForm__input"
            />
            {errors.author && <span className="bookForm__error">{errors.author}</span>}
          </label>
        </div>
        <div className="bookForm__group">
          <label htmlFor="category" className="bookForm__label">
            Category:
            {' '}
            <select
              id="category"
              name="category"
              value={bookData.category}
              required
              onChange={handleInputChange}
              className="bookForm__input"
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-fiction">Non-fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
            {errors.category && <span className="bookForm__error">{errors.category}</span>}
          </label>
        </div>
        <div className="bookForm__group">
          <label htmlFor="isbn" className="bookForm__label">
            ISBN:
            {' '}
            <input
              type="number"
              id="isbn"
              name="isbn"
              value={bookData.isbn}
              required
              onChange={handleInputChange}
              className="bookForm__input"
            />
            {errors.isbn && <span className="bookForm__error">{errors.isbn}</span>}
          </label>
        </div>
        <button type="submit" className="bookForm__button">Add a Book</button>
      </form>

      {successMessage && <p>Book added successfully!</p>}
      {errorMessage && <p>{errorMessage}</p>}

    </div>
  );
};
