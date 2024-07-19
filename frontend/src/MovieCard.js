import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="movie">
      <div>
        <p>{movie.publication_date}</p>
      </div>
      <div>
        <img 
          src={movie.image !== 'N/A' ? movie.image : 'https://via.placeholder.com/400'} 
          alt={movie.title} 
        />
      </div>
      <div>
        <span>{movie.author}</span>
        <h3>{movie.title}</h3>
      </div>
      <div>
        <h4>Editions:</h4>
        <ul>
          {movie.editions.map((edition, index) => (
            <li key={index}>{edition.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieCard;
