// Web Hooks
const searchButton = document.getElementById("search-button")
const artistList = document.getElementById("artist-list")
const artistSearch = document.getElementById("artist-search")

const albumList = document.getElementById("album-list")
const songList = document.getElementById("song-list")
const musicVideoList = document.getElementById("music-videos")

const clearButton = document.getElementById("remove-search")

const searchBox = document.getElementById("search-container")
const albumBox = document.getElementById("album-box")
const songBox = document.getElementById("song-box")

const loader1 = document.getElementById("loader1")
const loader2 = document.getElementById("loader2")
const loader3 = document.getElementById("loader3")

const recentBox = document.getElementById("recent-list")
const clearRecentSearches = document.getElementById("remove-recent-searches")
const recentPlaceholder = document.getElementById("recent-placeholder")

const modal = document.getElementById("dialog")
const modalContent = document.getElementById("modal-content")
const modalButton = document.getElementById("modal-button")

let localStorageIndex = window.localStorage.length


// Remove Search

function clearSearch(){
    albumBox.classList.add("hidden");
    albumBox.classList.remove("col-span-1", "col-span-2");

    songBox.classList.add("hidden");
    songBox.classList.remove("col-span-1");

    searchBox.classList.remove("col-span-1");
    searchBox.classList.add("col-span-3");

    artistSearch.value = "";
    artistList.innerHTML = "";
    albumList.innerHTML = "";
    musicVideoList.innerHTML = "";
    songList.innerHTML = "";
}

// Initial Artist Search
function musicSearch(artistValue){
    loader1.classList.replace("hidden", "flex")
    songBox.classList.replace("flex", "hidden")
    albumBox.classList.replace("flex", "hidden")
    searchBox.classList.replace("col-span-1", "col-span-3")
    const requestUrl = `https://corsproxy.io/?https://itunes.apple.com/search?term=${artistValue}&entity=musicArtist&limit=6`
    fetch(requestUrl)
        .then(function(response){
            if(response.status != 200){
                loader1.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold")
                errorMessage.textContent = `Server Error: ${response.status}. Please try again.`
                artistList.appendChild(errorMessage)
                return null;
            } else {
            return response.json()
            }
        })
        .then(function(data){
            if (!data){
                return;
            }

            loader1.classList.replace("flex", "hidden")
            artistList.innerHTML = ""
            albumList.innerHTML = ""
            musicVideoList.innerHTML = ""
            for(let x = 0; x < data.results.length; x++){
                let artist = document.createElement("p")
                let artistID = data.results[x].artistId
                artist.setAttribute("id", `artist${x}`)
                artist.textContent = `${data.results[x].artistName}`
                artist.setAttribute("class", "hover:text-sky-800 hover:scale-101 transition duration-300")
                artistList.appendChild(artist)
                artist.addEventListener("click", () => {albumSearch(artistID),
                    musicVideo(artistID), saveSearch(data.results[x].artistName)
                }
            )
                
            }
        })
        .catch(function(){
            loader1.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold")
                errorMessage.textContent = "Network Error: Error in the search. Please try again."
                artistList.appendChild(errorMessage)
        })
}

// Album Search
function albumSearch(artistID){
    albumList.innerHTML = ""
    loader2.classList.replace("hidden", "flex")
    songBox.classList.replace("flex", "hidden")
    searchBox.classList.replace("col-span-3", "col-span-1")
    albumBox.classList.remove("hidden")
    albumBox.classList.add("flex")
    albumBox.classList.add("col-span-2")
    musicVideoList.innerHTML = ""
    recentPlaceholder.classList.add("hidden")
    const requestUrl = `https://corsproxy.io/?https://itunes.apple.com/lookup?id=${artistID}&entity=album`
    fetch(requestUrl)
        .then(function(response){
            if(response.status != 200){
                loader2.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold col-span-4")
                errorMessage.textContent = `Server Error: ${response.status}. Please try again.`
                albumList.appendChild(errorMessage)
                return null;
            } else {
            return response.json()
            }
        })
        .then(function(data){
             if (!data){
                return;
            }

            loader2.classList.replace("flex", "hidden")
            songList.innerHTML = ""
            albumList.innerHTML = ""
            for (let x = 1 ; x < data.results.length; x++){
                let albumWrapper = document.createElement("div")
                let album = document.createElement("img")
                let albumLabel = document.createElement("p")
                let albumID = data.results[x].collectionId
                album.setAttribute("id", `album${x}`)
                album.setAttribute("src", `${data.results[x].artworkUrl100}`)
                albumLabel.textContent = `${data.results[x].collectionName}`
                albumLabel.setAttribute("class", "text-center text-xs")
                albumWrapper.setAttribute("class", "flex flex-col items-center bg-stone-900 shadow-xl/75 scale-100 hover:scale-120 transition duration-300 m-5 p-2 rounded-lg")
                albumWrapper.appendChild(album)
                albumWrapper.appendChild(albumLabel)
                albumList.appendChild(albumWrapper)
                album.addEventListener("click", () => songSearch(albumID))
            }
        })
        .catch(function(){
            loader2.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold col-span-4")
                errorMessage.textContent = "Network Error: Error in the search. Please try again."
                albumList.appendChild(errorMessage)
        })
}

// Song Search
function songSearch(albumID){
    songList.innerHTML = ""
    loader3.classList.replace("hidden", "flex")
    albumBox.classList.replace("col-span-2", "col-span-1")
    songBox.classList.remove("hidden")
    songBox.classList.add("flex")
    songBox.classList.add("col-span-1")
    const requestUrl = `https://corsproxy.io/?https://itunes.apple.com/lookup?id=${albumID}&entity=song`
    fetch(requestUrl)
        .then(function(response){
            if(response.status != 200){
                loader3.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold")
                errorMessage.textContent = `Server Error: ${response.status}. Please try again.`
                songList.appendChild(errorMessage)
                return null;
            } else {
            return response.json()
            }
        })
        .then(function(data){
            if(!data){
                return;
            }
            songList.innerHTML = ""
            loader3.classList.replace("flex", "hidden")
            for (let x = 1 ; x < data.results.length; x++){
                let songTitle = document.createElement("button")
                songTitle.setAttribute("command", "show-modal")
                songTitle.setAttribute("commandfor", "dialog")
                songTitle.setAttribute("id", `song${x}`)
                songTitle.textContent = `${x}. ${data.results[x].trackCensoredName}`
                songTitle.setAttribute("class", "rounded-md bg-stone-900 shadow-xl/55 px-2.5 py-1.5 text-sm text-left font-semibold text-white inset-ring inset-ring-white/5 hover:bg-sky-900 m-1")
                songTitle.addEventListener("click", ()=> songModal(data.results[x].trackCensoredName, data.results[x].primaryGenreName, data.results[x].releaseDate, data.results[x].previewUrl))
                songList.appendChild(songTitle)
            }
        })
        .catch(function(){
            loader3.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold")
                errorMessage.textContent = "Network Error: Error in the search. Please try again."
                songBox.appendChild(errorMessage)
        })

}

// Music Video Search
function musicVideo(artistID){
    const requestUrl = `https://corsproxy.io/?https://itunes.apple.com/lookup?id=${artistID}&entity=musicVideo&limit=3`
    fetch(requestUrl)
        .then(function(response){
            if(response.status != 200){
                loader1.classList.replace("flex", "hidden")
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold col-span-3")
                errorMessage.textContent = `Server Error: ${response.status}. Please try again.`
                musicVideoList.appendChild(errorMessage)
                return null;
            } else {
            return response.json()
            }
        })
        .then(function(data){
            if(!data){
                return;
            }
            for (let x = 1 ; x < data.results.length; x++){
                let musicVideoWrapper = document.createElement("div")
                let musicVideo = document.createElement("img")
                let musicVideoLabel = document.createElement("p")
                musicVideoWrapper.setAttribute("command", "show-modal")
                musicVideoWrapper.setAttribute("commandfor", "dialog")
                musicVideo.setAttribute("id", `video${x}`)
                musicVideo.setAttribute("src", `${data.results[x].artworkUrl100}`)
                musicVideoLabel.textContent = `${data.results[x].trackCensoredName}`
                musicVideoLabel.setAttribute("class", "text-center text-xs")
                musicVideoWrapper.setAttribute("class", "flex flex-col items-center bg-stone-900 shadow-xl/75 scale-105 hover:scale-115 transition duration-300 m-5 p-2 rounded-lg")
                musicVideoWrapper.appendChild(musicVideo)
                musicVideoWrapper.appendChild(musicVideoLabel)
                musicVideoList.appendChild(musicVideoWrapper)
                musicVideoWrapper.addEventListener("click", () => musicvideoModal(data.results[x].previewUrl, data.results[x].trackCensoredName))
            }
        })
        .catch(function(){
                let errorMessage = document.createElement("p")
                errorMessage.setAttribute("class", "text-red-700 text-center font-semibold col-span-3")
                errorMessage.textContent = "Network Error: Error in the search. Please try again."
                musicVideoList.appendChild(errorMessage)
        })
}

// Save Local Storage
function saveSearch(searchString){

    const localStorage = window.localStorage

    if(!searchString){
    } else {
    localStorage.setItem(`${localStorageIndex}`, `${searchString}`);
    addRecentSearch(localStorageIndex)
    localStorageIndex ++;
    }
    
}

// Display Recent Searches
function displayRecentSearches(){
    if (window.localStorage.length === 0){
    } else {
        recentPlaceholder.classList.add("hidden")
        for(let x = 0; x < window.localStorage.length; x++){
            let recentButton = document.createElement("button")
            let buttonLabel = localStorage.getItem(`${x}`)
            recentButton.setAttribute("class", " bg-stone-900 shadow-xl/75 hover:bg-gray-600 hover:scale-101 transition duration-300 text-white py-2 px-4 rounded-full flex items-center justify-center")
            recentButton.textContent = buttonLabel
            recentButton.addEventListener("click", () => musicSearch(buttonLabel))
            recentBox.appendChild(recentButton)
        }
    }
}

//Create a button for each search
function addRecentSearch(index){
    let recentButton = document.createElement("button")
    let buttonLabel = localStorage.getItem(`${index}`)
    recentButton.setAttribute("class", " bg-stone-900 shadow-xl/75 hover:bg-gray-600 hover:scale-101 transition duration-300 text-white py-2 px-4 rounded-full flex items-center justify-center")
    recentButton.textContent = buttonLabel
    recentButton.addEventListener("click", () => musicSearch(buttonLabel))
    recentBox.appendChild(recentButton) 
}

// Clear Local Storage
function clearStorage(){
    recentPlaceholder.classList.remove("hidden")
    recentBox.innerHTML = '';
    localStorage.clear();
    localStorageIndex = 0;
}

// Song Modal
function songModal(title, genre, releaseDate, url){
    modalContent.innerHTML = "";
    releaseDate = releaseDate.slice(0, -10)
    let modalTitle = document.createElement("h3")
    let modalText = document.createElement("p")
    let audioPreview = document.createElement ("audio")
    audioPreview.setAttribute("src", `${url}`)
    audioPreview.setAttribute("controls", "true")
    modalTitle.setAttribute("class", "text-base font-semibold text-white m-1")
    modalText.setAttribute("class", "text-sm text-stone-400 whitespace-pre m-3")
    audioPreview.volume = 0.5
    modalTitle.textContent = `${title}`
    modalText.textContent = `Genre - ${genre}            Release Date: ${releaseDate}`

    modalContent.appendChild(modalTitle)
    modalContent.appendChild(modalText)
    modalContent.appendChild(audioPreview)

}

// Music Video Modal Preview
function musicvideoModal(url, name){
    modalContent.innerHTML = "";
    let trackName = document.createElement("h3")
    trackName.setAttribute("class", "text-base font-semibold text-white text-center m-1")
    trackName.textContent = `${name}`
    let musicVideoPreview = document.createElement("video")
    musicVideoPreview.setAttribute("src", `${url}`)
    musicVideoPreview.setAttribute("controls", "true")
    modalContent.appendChild(trackName)
    modalContent.appendChild(musicVideoPreview)
    modal.showModal();

}

// Stop media playing when modal closes
function stopMedia(){
    const media = modalContent.querySelectorAll("video, audio")
    for(let i = 0; i < media.length; i++){
    media[i].pause()
    }
}

// Display Recent Searches call

window.onload = () => displayRecentSearches()

// Buttons
searchButton.addEventListener("click", () => musicSearch(artistSearch.value))
clearButton.addEventListener("click", ()=> clearSearch())
clearRecentSearches.addEventListener("click", ()=> clearStorage())
modalButton.addEventListener("click", ()=> stopMedia())
