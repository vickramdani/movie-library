// Modal Selector
const modal = document.querySelector(".modal-btn");
const modalBg = document.querySelector(".modal-bg");
const modalClose = document.querySelector(".modal-close");

// Form Selector
const poster = document.getElementById('poster');
const title = document.getElementById('title');
const years = document.getElementById('years');
const ratings = document.getElementById('ratings');

// Movie Library Selector
const cardContainer = document.querySelector(".card-container");
const submitForm = document.getElementById("submit-form");
let myMovie = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

window.onload = () => {
    render();
    checkEmptyState();
}
// Listener
submitForm.addEventListener("click", submitMovie);
cardContainer.addEventListener("click", deleteMovie);

modal.addEventListener("click", () => {
    modalBg.classList.add("bg-active");
});

modalClose.addEventListener("click", closeModal);

// Movie list function
function Movie(poster, title, years, rating) {
    this.poster = poster;
    this.title = title;
    this.years = years;
    this.rating = rating;
}

function addMovieToMyMovie(poster, title, years, rating) {
    let newMovie = new Movie(poster, title, years, rating);
    myMovie.push(newMovie);
    localStorage.setItem('items', JSON.stringify(myMovie))
}

function renderEmptyState() {
    const movieLib = document.getElementById('movie-lib');

    const emptyContainer = document.createElement('div');
    emptyContainer.classList.add('empty-container');
    movieLib.appendChild(emptyContainer);

    emptyContainer.innerHTML += `
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMiAyNGgtMjB2LTI0aDE0bDYgNnYxOHptLTctMjNoLTEydjIyaDE4di0xNmgtNnYtNnptMyAxNXYxaC0xMnYtMWgxMnptMC0zdjFoLTEydi0xaDEyem0wLTN2MWgtMTJ2LTFoMTJ6bS0yLTRoNC41ODZsLTQuNTg2LTQuNTg2djQuNTg2eiIvPjwvc3ZnPg==">
        <p>Tap the + button to create your movie list</p>
    `;
}

function render() {
    cardContainer.innerHTML = "";
    for (i = 0; i < myMovie.length; i++) {
        let cards = document.createElement("div");
        let delBtn = document.createElement("button");
        cards.classList.add("cards");
        cards.setAttribute('data-array-ref', i);
        cards.innerHTML += `
            <img src="${myMovie[i].poster}" class="poster-link">
            <h2 class="titles">${myMovie[i].title}</h2>
            <h4 class="year">Year : ${myMovie[i].years}</h4>
            <i class="fa fa-star">${myMovie[i].rating}</i>
        `;
        delBtn.innerHTML = '<i class="fa fa-plus"></i>';
        delBtn.classList.add("card-close");
        delBtn.setAttribute("name", "delete");
        cards.appendChild(delBtn);
        cardContainer.appendChild(cards);
    }
}

function checkEmptyState() {
    if (myMovie.length === 0) {
        renderEmptyState();
    } else {
        removeEmptyState();
    }
}

function checkInput() {
    const posterValue = poster.value.trim();
    const titleValue = title.value.trim();
    const yearsValue = years.value.trim();
    const ratingsValue = ratings.value.trim();

    if (posterValue === '') {
        setErrorForm(poster, 'Poster link cannot be blank');
        preventDefault();
    } else if (!isPosterLink(posterValue)) {
        setErrorForm(poster, 'Invalid link');
        preventDefault();
    } else {
        setSuccessForm(poster);
    }

    if (titleValue === '') {
        setErrorForm(title, 'Title cannot be blank');
        preventDefault();
    } else {
        setSuccessForm(title);
    }

    if (yearsValue === '') {
        setErrorForm(years, 'Years cannot be blank');
        preventDefault();
    } else if (!isValidYears(yearsValue)) {
        setErrorForm(years, 'Invalid Years');
        preventDefault();
    } else {
        setSuccessForm(years);
    }

    if (ratingsValue === '') {
        setErrorForm(ratings, 'Ratings cannot be blank');
        preventDefault();
    } else if (ratingsValue < 1 || ratingsValue > 10) {
        setErrorForm(ratings, 'Invalid ratings');
        preventDefault();

    } else {
        setSuccessForm(ratings);
    }

}

function submitMovie() {
    let formTitle = title.value;
    let formYears = years.value;
    let formPoster = poster.value;
    let formRating = ratings.value;

    checkInput();
    removeEmptyState();
    addMovieToMyMovie(formPoster, formTitle, formYears, formRating);
    render();
    removeEmptyState();
    closeModal();
    clearForm();
}

function removeEmptyState() {
    const emptyContainer = document.querySelector('.empty-container');
    if (emptyContainer) {
        emptyContainer.remove();
    }
}

function deleteMovie(event) {
    const item = event.target;
    if (item.classList[0] === 'card-close') {
        const movieList = item.parentElement;
        movieList.classList.add('fall');
        removeMovie(movieList);
        movieList.addEventListener('transitionend', function () {
            movieList.remove();
        })
        checkEmptyState();
    }
}

function removeMovie(parent) {
    const movieIndex = parent.children[0].innerText;
    myMovie.splice(myMovie.indexOf(movieIndex), 1);
    localStorage.setItem("items", JSON.stringify(myMovie));
}

function clearForm() {
    title.value = "";
    years.value = "";
    poster.value = "";
    ratings.value = "";

    title.parentElement.className = 'form-control';
    poster.parentElement.className = 'form-control';
    years.parentElement.className = 'form-control';
    ratings.parentElement.className = 'form-control';
};

function setErrorForm(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');

    small.innerText = message;

    formControl.className = 'form-control error';
}

function setSuccessForm(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isPosterLink(poster) {
    const res = poster.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g);
    return (res !== null);
}

function isValidYears(years) {
    return /^[0-9]{4}$/.test(years);
}

function closeModal() {
    modalBg.classList.remove("bg-active");

    modalBg.classList.add("bg-deactive");
}