const cl = console.log;

//getting id
const movieModel = document.getElementById("movieModel");
const backdrop = document.getElementById("backdrop");
const closeBtn = document.getElementById("closeBtn");
const icon = document.getElementById("icon");
const AddMovie = document.getElementById("AddMovie");
const form = document.getElementById("form");
const spinner = document.getElementById("spinner");
const movieContainer = document.getElementById("movieContainer");
const nameControl = document.getElementById("name");
const imageControl = document.getElementById("image");
const discriptionControl = document.getElementById("discription");
const ratingControl = document.getElementById("rating");
const gnareControl = document.getElementById("gnare");
const addMovie = document.getElementById("addMovie");
const updateMovie = document.getElementById("updateMovie");
const createdAtControl = document.getElementById("createdAt")

//database
const BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app"
const MOVIE_URL = `${BASE_URL}/movies1.json`
cl(MOVIE_URL);
//functions
// togglle ACTIVE
function onToggle() {
    backdrop.classList.toggle("active");
    movieModel.classList.toggle("active");
    if (!movieModel.classList.contains("active")) {
        addMovie.classList.remove("d-none");
        updateMovie.classList.add("d-none");
        form.reset();
    }
}
//swal fire
function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 2500
    })
}
//spinner
function toggleSpinner() {
    spinner.classList.toggle("d-none");
}
//local state 

const state = {
    movieArr: [],
    editId: null
}
//rating
function setRating(rating) {
    if (rating > 4) {
        return "badge-success"
    } else if (rating > 2) {
        return "badge-warning"
    } else {
        return "badge-danger"
    }
}


//showUpdateSmallElement
function showUpdateSmallElement(UPDATE_ID) {
    let col = document.getElementById(UPDATE_ID);
    cl(col)
    let updateSmallElement = col.querySelector(".updatedAt");
    updateSmallElement.classList.remove("d-none")
}



function makeApi(url, methodType, msgbody = null) {
    let body = msgbody ? JSON.stringify(msgbody) : null;
    return fetch(url, {
        method: methodType,
        body: body,
        headers: {
            "content-type": "application/json",
            "Authorization": "JWT token"
        }
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error()
            }
            return res.json();
        })
        .catch((err) => {
            cl("something went wrong")
            snackBar(err, "error");
        })
        .finally(() => {
            toggleSpinner()
        })
}

//read 
function showUi() {
    toggleSpinner();
    makeApi(MOVIE_URL, "GET")
        .then((data) => {
            cl(data);
            for (const key in data) {
                data[key].id = key;
                state.movieArr.push(data[key]);
            }
            cl(state.movieArr);
            templeting(state.movieArr);
        })
        .catch((err) => {
            snackBar("something went wrong");
        })
}
//templeting 
function templeting(arr) {
    result = ``;
    arr.forEach(ele => {
        result += `<div class="col-md-3 mb-5" id="${ele.id}">
               
                    <div class="card h-100 movieCard">
                        <div class="card-header">
                        <div class="row">
                        <div class="col-10">
                        <h3 class="m-0">${ele.movieName}</h3>
                        <small class="createdAt">Created At : ${ele.createdAt}</small><br>
                        ${ele.updatedAt ? `<small class="updatedAt">Updated At : ${ele.updatedAt}</small>` : ""}
                        </div>
                        <div class="col-2">
                   <h4 class="m-0"> 
                     <span class="badge ${setRating(ele.movieRating)}">${ele.movieRating}</span>
                   </h4>

                        </div>
                        </div>
                        </div>
                        <div class="card-body">
                            <figure>
                            <img src="${ele.movieImg}" alt="${ele.movieName}">
                                <figcaption>
                                   <h3 class="m-0">${ele.movieName}</h3>
                                   <strong>Genre:-${ele.genre}</strong>
                                   <p>${ele.movieDescription}</p>
                                </figcaption>
                            </figure>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                          <button onclick="onEdit(this)" class="btn btn-sm netflix-sec-color ">Edit</button>
                          <button onclick="onDelete(this)" class="btn btn-sm netflix-pri-Color">Delete</button>
                        </div>
                    </div>
            </div>`
    });
    movieContainer.innerHTML = result;
}
showUi();

//create
function onAddMovie(eve) {
    eve.preventDefault();
    let newMovie = {
        movieName: nameControl.value,
        movieRating: ratingControl.value,
        movieImg: imageControl.value,
        movieDescription: discriptionControl.value,
        genre: gnareControl.value,
        createdAt: createdAtControl.value,
        updatedAt: null,
    }
    toggleSpinner();
    makeApi(MOVIE_URL, "POST", newMovie)
        .then((data) => {
            cl(data);
            newMovie.id = data.name;
            state.movieArr.push(newMovie);
            let div = document.createElement("div");
            div.id = data.name;
            div.className = `col-md-3 mb-5`
            div.innerHTML = `
                    <div class="card h-100 movieCard ">
                        <div class="card-header">
                        <div class="row">
                        <div class="col-10">
                        <h3 class="m-0">${newMovie.movieName}</h3>
                        <small class="createdAt">Created At : ${newMovie.createdAt}</small><br>
                        <small class="updatedAt d-none">Updated At :</small>
                        </div>
                        <div class="col-2">
                   <h4 class="m-0"> <span class="badge ${setRating(newMovie.movieRating)}">${newMovie.movieRating}</span></h4>

                        </div>
                        </div>
                        </div>
                        <div class="card-body">
                            <figure>
                            <img src="${newMovie.movieImg}" alt="${newMovie.movieName}">
                                <figcaption>
                                   <h3 class="m-0">${newMovie.movieName}</h3>
                                   <strong>Genre:-${newMovie.genre}</strong>
                                   <p>${newMovie.movieDescription}</p>
                                </figcaption>
                            </figure>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                          <button onclick="onEdit(this)" class="btn btn-sm netflix-sec-color">Edit</button>
                          <button onclick="onDelete(this)" class="btn btn-sm netflix-pri-Color">Delete</button>
                        </div>
                    </div>`
            movieContainer.append(div);
            onToggle();
            form.reset();
        })
        .catch((err) => {
            snackBar("something went wrong")
        })
}

function onEdit(ele) {
    let EDIT_ID = ele.closest(".col-md-3").id;

    state.editId = EDIT_ID;

    let EditObj = state.movieArr.find(obj => obj.id === EDIT_ID);

    nameControl.value = EditObj.movieName;
    ratingControl.value = EditObj.movieRating;
    imageControl.value = EditObj.movieImg;
    discriptionControl.value = EditObj.movieDescription;
    gnareControl.value = EditObj.genre;
    createdAtControl.value = EditObj.createdAt;

    addMovie.classList.add("d-none");
    updateMovie.classList.remove("d-none");
    onToggle();
}

//update
function onUpdateMovie(eve) {
    let UPDATE_ID = state.editId;
    cl(UPDATE_ID);
    let updateurl = `${BASE_URL}/movies1/${UPDATE_ID}.json`;
    //showUpdateSmallElement(UPDATE_ID)
    let updatedMovie = {
        movieName: nameControl.value,
        movieRating: ratingControl.value,
        movieImg: imageControl.value,
        movieDescription: discriptionControl.value,
        genre: gnareControl.value,
        createdAt: createdAtControl.value,
        updatedAt: new Date().toLocaleString(),
        id: UPDATE_ID
    };
    cl(updateMovie)
    toggleSpinner();
    makeApi(updateurl, "PATCH", updatedMovie)
        .then((data) => {
            cl(data);
            let index = state.movieArr.findIndex((obj) => obj.id === UPDATE_ID);
            state.movieArr[index] = updatedMovie;
            let div = document.getElementById(UPDATE_ID);
            div.innerHTML = `<div class="card h-100 movieCard">
                        <div class="card-header ">
                        <div class="row">
                        <div class="col-10">
                        <h3 class="m-0">${updatedMovie.movieName}</h3>
                        <small class="createdAt">Created At : ${updatedMovie.createdAt}</small><br>
                        <small class="updatedAt d-none">Updated At : ${updatedMovie.updatedAt}</small>
                        </div>
                        <div class="col-2">
                   <h4 class="m-0"> <span class="badge ${setRating(updatedMovie.movieRating)}">${updatedMovie.movieRating}</span></h4>
                        </div>
                        </div>
                        </div>
                        <div class="card-body">
                            <figure>
                            <img src="${updatedMovie.movieImg}" alt="${updatedMovie.movieName}">
                                <figcaption>
                                   <h3 class="m-0">${updatedMovie.movieName}</h3>
                                   <strong>Genre:-${updatedMovie.genre}</strong>
                                   <p>${updatedMovie.movieDescription}</p>
                                </figcaption>
                            </figure>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                          <button onclick="onEdit(this)" class="btn btn-sm  netflix-sec-color">Edit</button>
                          <button onclick="onDelete(this)" class="btn btn-sm netflix-pri-Color">Delete</button>
                        </div>
                    </div>`;
            snackBar("Movie updated successfully");
            state.editId = null;
            showUpdateSmallElement(UPDATE_ID)
            onToggle();
            form.reset();
        })
        .catch((err) => {
            snackBar("Something went wrong");
        });
}
//delete 
function onDelete(ele){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't to remove this movie!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let REMOVE_ID = ele.closest(".col-md-3").id;
            let remove_url = `${BASE_URL}/movies1/${REMOVE_ID}.json`
            toggleSpinner();
            makeApi(remove_url, "DELETE")
                .then((data) => {
                    cl(data);
                    let getIndex = state.movieArr.findIndex((obj => obj.id === REMOVE_ID));
                    state.movieArr.splice(getIndex, 1);
                    ele.closest(".col-md-3").remove();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                })
                .catch((err) => {
                    snackBar("something went wrong");
                })
        }
    });
}
updateMovie.addEventListener("click", onUpdateMovie);
form.addEventListener("submit", onAddMovie);
AddMovie.addEventListener("click", onToggle);
icon.addEventListener("click", onToggle);
closeBtn.addEventListener("click", onToggle);
backdrop.addEventListener("click", onToggle);

