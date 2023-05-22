import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.scss';

interface Book {
  active: boolean;
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  createdAt: string;
  modifiedAt: string;
}

export const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('Show Active');
  const navigate = useNavigate();

  const handleEditClick = (bookId: number) => {
    navigate(`/add-book/${bookId}`);
  };

  useEffect(() => {
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      // eslint-disable-next-line no-console
      .catch(error => console.error(error));
  }, []);

  function formatDateTime(dateTime: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(new Date(dateTime));

    return formattedDate;
  }

  const updateBook = (book: Book) => {
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
      .then(response => {
        if (response.ok) {
          setBooks(prevBooks => prevBooks
            .map(prevBook => (prevBook.id === book.id ? book : prevBook)));
        } else {
          throw new Error('Помилка при оновленні книги');
        }
      })
      .catch(error => error);
  };

  const updateBookStatus = (bookId: number, isActive: boolean) => {
    const updatedBooks = books
      .map(book => (book.id === bookId ? { ...book, active: isActive } : book));

    setBooks(updatedBooks);
    updateBook(updatedBooks.find(book => book.id === bookId) as Book);
  };

  const deactivateBook = (bookId: number) => {
    updateBookStatus(bookId, false);
  };

  const activateBook = (bookId: number) => {
    updateBookStatus(bookId, true);
  };

  const removeBook = (bookId: number, updatedBooks: Book[]) => {
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setBooks(updatedBooks);
        } else {
          throw new Error('Помилка при видаленні книги');
        }
      })
      .catch(error => (error));
  };

  const deleteBook = (bookId: number) => {
    const updatedBooks = books.filter(book => book.id !== bookId);

    removeBook(bookId, updatedBooks);
  };

  const filteredBooks = (): Book[] => {
    switch (filter) {
      case 'Show All':
        return books;
      case 'Show Active':
        return books.filter(book => book.active);
      case 'Show Deactivated':
        return books.filter(book => !book.active);
      default:
        return books;
    }
  };

  const numberOfRecordsShowing = filteredBooks().length;
  const totalNumberOfRecords = books.length;

  return (
    <>
      <div className="header">
        <label htmlFor="filter" className="header__filter">
          Filter:
          {' '}
          <select id="filter" className="header__filterSelect" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Show All">Show All</option>
            <option value="Show Active">Show Active</option>
            <option value="Show Deactivated">Show Deactivated</option>
          </select>
        </label>
        <span className="record-info">
          Showing
          {' '}
          {numberOfRecordsShowing}
          {' '}
          of
          {' '}
          {totalNumberOfRecords}
        </span>
      </div>
      <div className="centeredContainer">
        <Link to="/add-book" className="addBookLink">Add a Book</Link>
      </div>
      <table className="bookTable">
        <thead>
          <tr>
            <th>Book title</th>
            <th>Author name</th>
            <th>Category</th>
            <th>ISBN</th>
            <th>Created At</th>
            <th>Modified/Edited At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks().map(book => (
            <tr key={book.id} className={book.active ? '' : 'deactivated'}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.isbn}</td>
              <td>{formatDateTime(book.createdAt)}</td>
              <td>{formatDateTime(book.modifiedAt)}</td>
              <td>
                <button type="button" onClick={handleEditClick.bind(null, book.id)}>Edit</button>

                {book.active && (
                  <>
                    <button type="button" onClick={() => deactivateBook(book.id)}>Deactivate</button>
                    <button type="button" disabled>Delete</button>
                  </>
                )}
                {!book.active && (
                  <>
                    <button type="button" onClick={() => activateBook(book.id)}>Activate</button>
                    <button type="button" onClick={() => deleteBook(book.id)}>Delete</button>
                  </>
                )}
                {book.active ? 'Deactivate' : 'Re-Activate'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="footer">
        <a href="https://github.com/11Olya112" target="_blank" className="footer__link" rel="noreferrer">
          Visit my GitHub
        </a>
      </footer>
    </>
  );
};
