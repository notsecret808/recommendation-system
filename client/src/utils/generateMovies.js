import Movie from "../Movie";
import generateRandomDate from "./generateRandomDate";
import generateRandomString from "./generateRandomString";


const generateMovies = (n) => {
    let movies = [];
    for (let i = 0; i < n; i++) {
        movies.push(<Movie title={generateRandomString(10)} date={generateRandomDate()} id = {i} />)
    }
    return movies;
};

export default generateMovies;