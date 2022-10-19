const form = document.getElementById('form-search');
const input = document.getElementById('movie');
const cardsContainerDiv =  document.getElementById('cards-container')

const api_key = "942ad2a0cd0e42b4e326e96febbc6d53";
let movies = [];

function search(e) {
    e.preventDefault();
    
    getMoviesByQuery();
}

function getMoviesByQuery() {
    const query = input.value.trim();
    console.log(query);
    if(query !== "") {
        axios
        .get(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}`)
        .then((res) => {
            movies = res.data.results;
            movies = getMoviesDetails(movies);
        })
        .catch((err) => console.error(err));
    } else {
        while(cardsContainerDiv.firstElementChild) {
            cardsContainerDiv.removeChild(cardsContainerDiv.firstElementChild);
        }
    }
}

function getMoviesDetails(movies) {
    const moviesDetails = [];

    for (const movie of movies) {
        axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}`)
        .then((res) => {
            moviesDetails.push(res.data);
            if(moviesDetails.length === movies.length)
                createMovieCards(moviesDetails);
        })
        .catch((err) => console.error(err));
    }

    return moviesDetails;
}

function createMovieCards(movies) {

    console.log(movies);

    while(cardsContainerDiv.firstElementChild) {
        cardsContainerDiv.removeChild(cardsContainerDiv.firstElementChild);
    }
    
    for (const movie of movies) {
        const card = document.createElement('div');
        card.className = "card";
        card.innerHTML = 
        `
            <div>
                <img src="${movie.poster_path !== null ? ('https://image.tmdb.org/t/p/original/' + movie.poster_path) : 'movie_default.webp'}">
            </div>
            <div class='card-detail'>
                <span class="detail">Title:</span>
                <span class="detail-value">${movie.title}</span>
            </div>
            <div class='card-detail'>
                <span class="detail">Description:</span>
                <span class="detail-value">${movie.overview === "" ? "No description." : movie.overview }</span>
            </div>
            <div class='card-detail'>
                <span class="detail">Genres:</span>
                <span class="detail-value">${ getGenres(movie.genres) }</span>
            </div>
        `
        cardsContainerDiv.appendChild(card)
    }
}

function getGenres(genres) {
    let result = "";

    if (genres.length) {
        for (const genre of genres) {
            result += genre.name + ", "
        }
        result = result.replace(/..$/, '');
    }
    else {
        result = "Unknown"
    }
    
    return result;
}

function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

input.addEventListener('keyup', debounce(getMoviesByQuery, 500) )

form.addEventListener('submit', search);
