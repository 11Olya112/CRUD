import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import { Dashboard } from './components/Dashboard';
import { AddBook } from './components/AddBook';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" Component={Dashboard} />
      <Route path="/add-book" Component={AddBook} />
      <Route path="/add-book/:bookId" Component={AddBook} />
    </Routes>
  );
};
