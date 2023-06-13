const root = document.querySelector(':root');
const moviesContainer = document.querySelector('.movies-container');
const moviesDiv = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('.input');
const highlight = document.querySelector('.highlight');
const size = document.querySelector('.size');
const highlightVideo = document.querySelector('.highlight__video');
const imgPlay = document.querySelector('.highlight__video img');
const highlightVideoLink  = document.querySelector('.highlight__video-link');
const highlightInfo = document.querySelector('.highlight__info');
const highlightTitleRating = document.querySelector('.highlight__title-rating');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenreLaunch = document.querySelector('.highlight__genre-launch');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal__body');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenreAverage = document.querySelector('.modal__genre-average');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');
const btnTheme = document.querySelector('.btn-theme');

let movies = [];
let genres = [];
let dailyMovie;
let page = 0;

async function getMovies() {
    try {
        const response = await api.get('/3/discover/movie?language=pt-BR&include_adult=false');
        movies = await response.data.results;
    } catch (error) {
        console.log(error.response);
    }
}

function loadMovies() {
    moviesDiv.innerHTML = '';
    movies.slice(page, page+6).forEach(element => {
        const movie = document.createElement('div');
        
        function makeModal() {
            modal.classList.toggle('hidden');
            imgPlay.style.zIndex = '-1';
            
            async function getGenres() {
                const response = await api.get(`3/movie/${element.id}?language=pt-BR`);
    
                for (const genre of response.data.genres) {
                    genres.push(genre.name);   
                }
    
                for (const genre of genres) {
                    let modalGenre = document.createElement('span');
                    modalGenre.classList.add('modal__genre');
                    modalGenre.textContent = genre;
                    modalGenres.appendChild(modalGenre);
                }
            }
            
            modalTitle.textContent = element.title;
            modalImg.src = element.backdrop_path;
            modalDescription.textContent = element.overview;
            modalAverage.textContent = element.vote_average;
            
            modalBody.appendChild(modalTitle);
            modalBody.appendChild(modalImg);
            modalBody.appendChild(modalDescription);
            modalGenreAverage.appendChild(modalAverage);
            
            getGenres();
        }
        
        movie.addEventListener('click', () => {
            makeModal();
        });
        
        const movieInfo = document.createElement('div');
        const backgroundImage = document.createElement('img');
        const movieTitle = document.createElement('span');
        const movieRating = document.createElement('span');

        movie.classList.add('movie');
        movieInfo.classList.add('movie__info');
        movieTitle.classList.add('movie__title');
        movieRating.classList.add('movie__rating');

        movie.style.marginBottom = '20px';

        backgroundImage.src = element.poster_path;
        backgroundImage.style.height = '250px';
        movieTitle.textContent = element.original_title;
        movieRating.textContent = element.vote_average;

        moviesDiv.appendChild(movie);
        movie.appendChild(backgroundImage);
        movie.appendChild(movieInfo);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(movieRating);
    });
}

btnNext.addEventListener('click', () => {
    page += 6;
    if (page <=12) {
        loadMovies();
    }

    if (page > 12) {
        page = 0;
        loadMovies();
    }
})

btnPrev.addEventListener('click', () => {
    page -= 6;
    if (page < 0) {
        page = 12;
        loadMovies();
    }
    loadMovies();
});


modalClose.addEventListener('click', (event) => {
    event.stopPropagation();
    modal.classList.toggle('hidden');
});

async function searchMovie(value) {
    const response = await api.get(`3/search/movie?language=pt-BR&include_adult=false&query=${value}`);
    movies = await response.data.results;
}

input.addEventListener('keypress', async(event) => {
    if (event.code == 'Enter') {
        await searchMovie(input.value);
        loadMovies();
        input.value = '';
    }
})

async function loadDailyMovie() {
    const response = await api.get('3/movie/436969?language=pt-BR');
    dailyMovie = await response.data;

    const videoBackgroundImg = document.createElement('img');

    videoBackgroundImg.classList.add('highlight__video');
    videoBackgroundImg.style.position = 'absolute';
    imgPlay.style.position = 'relative';
    imgPlay.style.zIndex = '1';
    
    videoBackgroundImg.src = dailyMovie.backdrop_path;
    highlightTitle.textContent = dailyMovie.title;
    highlightRating.textContent = dailyMovie.vote_average;
    highlightGenres.textContent = `${dailyMovie.genres[0].name}, ${dailyMovie.genres[1].name}, ${dailyMovie.genres[2].name}`;

    highlightLaunch.textContent = `${dailyMovie.release_date}`;
    highlightDescription.textContent = dailyMovie.overview;

    highlightVideo.appendChild(videoBackgroundImg);
}

async function loadVideo() {
    const response = await api.get ('3/movie/436969/videos?language=pt-BR');
    let videoKey = response.data.results[0].key;

    highlightVideoLink.href = `https://www.youtube.com/watch?v=${videoKey}`
}


btnTheme.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme');

    if (!currentTheme || currentTheme === 'light') {
        localStorage.setItem('theme', 'dark');
        btnTheme.src = '../assets/dark-mode.svg';
        root.style.setProperty('--background', '#1B2028');
        root.style.setProperty('--bg-secondary', '#2D3440');
        root.style.setProperty('--text-color', 'white');
        return;
    }
    
    localStorage.setItem('theme', 'light');
    btnTheme.src = '../assets/light-mode.svg';
    root.style.setProperty('--background', 'white');
    root.style.setProperty('--bg-secondary', '#ededed');
    root.style.setProperty('--text-color', 'black');
});

async function showMovies() {
    await getMovies();
    loadMovies();
    loadDailyMovie();
    loadVideo();
}

showMovies();