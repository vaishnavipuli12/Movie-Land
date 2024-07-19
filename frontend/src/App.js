import React, { useState, } from "react";
import './App.css';
import SearchIcon from './search.svg';
import MovieCard from './MovieCard';
import Loader from "./Loader";
import axios from 'axios'

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMovies = async (title) => {
    setLoading(true);
    setError('');
    try {
      //express
      // const respons = await fetch(`https://backend-mu-lovat.vercel.app/api/search?q=${title}`);
      // const data = await respons.json();


      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&fields=key,title,author_name,editions`);
        const books = response.data.docs.map(book => ({
          title: book.title,
          author: book.author_name ? book.author_name[0] : 'Unknown Author',
          publication_date: book.editions?.docs[0]?.title || 'Unknown',
          editions: book.editions?.docs || [],
        }));
        const dogImageRequests = books.map(() => axios.get('https://dog.ceo/api/breeds/image/random'));
        const dogImages = await Promise.all(dogImageRequests);
        const booksWithImages = books.map((book, index) => ({
          ...book,
          image: dogImages[index].data.message,
        }));
      setMovies(booksWithImages);
    } catch (error) {
      setError('Failed to fetch movies. Please try again later.');
    }
    setLoading(false);
  }


  return (
    <div className="app">
      <h1>Movie Land</h1>
      <div className="search">
        <input 
          placeholder="Search for movies" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img 
          src={SearchIcon} 
          alt="search"  
          onClick={() => searchMovies(searchTerm)}
        />
      </div>
      {error && <div className="error">{error}</div>}
      {loading ? <Loader/> :
       movies?.length > 0
       ? (
         <div className="container">
           {
             movies.map((movie, index) => (
               <MovieCard key={index} movie={movie} />
             ))
           }
         </div>
       ) : (
         <div className="empty">
           <h2>No Movies Found</h2>
         </div>
       )
      }
    </div>
  );
}

export default App;
