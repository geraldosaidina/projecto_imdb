let movies = [];

const movieForm = document.getElementById("movieForm");
const movieCards = document.getElementById("movieCards");
const searchInput = document.getElementById("searchInput");

function renderMovies(filteredMovies = movies) {
  movieCards.innerHTML = "";
  filteredMovies.forEach((movie, index) => {
    movieCards.innerHTML += `
      <div class="col">
        <div class="card h-100">
          <img src="${movie.image || 'https://via.placeholder.com/300x150?text=No+Image'}" class="card-img-top" alt="${movie.name}">
          <div class="card-body">
            <h5 class="card-title">${movie.name}</h5>
            <p class="card-text">
              <strong>Category:</strong> ${movie.category || 'Unknown'} <br>
              <strong>Year:</strong> ${movie.year || 'N/A'}
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-warning" onclick="editMovie(${index})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteMovie(${index})">Apagar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

async function fetchMovieFromIMDb(name) {
  const apiKey = "3PHr5qGq337arQu1TXdLmT:68kY6OGU3D1xD9i7Oxzepp";
  const url = `https://api.collectapi.com/imdb/imdbSearchByName?query=${encodeURIComponent(name)}`;
  try {
    const response = await fetch(url, {
      headers: {
        "content-type": "application/json",
        "authorization": `apikey ${apiKey}`,
      },
    });
    const data = await response.json();

    if (data.success && data.result.length > 0) {
      return data.result[0]; 
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar na IMDb", error);
    return null;
  }
}

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("movieName").value;
  const category = document.getElementById("movieCategory").value;
  const year = document.getElementById("movieYear").value;
  const image = document.getElementById("movieImage").value;

  const imdbData = await fetchMovieFromIMDb(name);

  const movie = {
    name: imdbData?.Title || name,
    category: imdbData?.Type || category || 'Unknown',
    year: imdbData?.Year || year || 'N/A',
    image: imdbData?.Poster || image || '',
  };

  movies.push(movie);
  renderMovies();
  movieForm.reset();
});

function editMovie(index) {
  const movie = movies[index];
  document.getElementById("movieName").value = movie.name;
  document.getElementById("movieCategory").value = movie.category;
  document.getElementById("movieYear").value = movie.year;
  document.getElementById("movieImage").value = movie.image;

  movies.splice(index, 1);
  renderMovies();
}

function deleteMovie(index) {
  movies.splice(index, 1);
  renderMovies();
}

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(searchTerm)
  );
  renderMovies(filteredMovies);
});

renderMovies();
