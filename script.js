// Spotify API credentials
const clientId = '463c92a5ff7c4e81ba6f177ac80c118d';
const clientSecret = '53734d48028b45989dcd0deefbe960a9';

// Base64 encode the client ID and secret
const authString = btoa(`${clientId}:${clientSecret}`);

// Function to get Spotify access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authString}`
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

// Function to search for songs
async function searchSongs(query) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.tracks.items;
}

// Function to display song results
let currentAudio = null; // Keep track of the currently playing audio
let songList = []; // Store the list of songs

function displaySongs(songs) {
    const resultsContainer = document.getElementById('song-results');
    resultsContainer.innerHTML = '';
    songList = songs; // Save the songs globally

    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <img src="${song.album.images[0].url}" alt="${song.name}">
            <div>
                <h3>${song.name}</h3>
                <p>${song.artists[0].name}</p>
                <audio id="audio-${index}" controls>
                    <source src="${song.preview_url}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;
        resultsContainer.appendChild(songElement);
    });

    // Automatically start playing the first song if preview URLs are available
    if (songs.length > 0 && songs[0].preview_url) {
        playSong(0);
    }
}

// Function to play a specific song by index
function playSong(index) {
    if (currentAudio) {
        currentAudio.pause(); // Stop any currently playing audio
    }
    currentAudio = document.getElementById(`audio-${index}`);
    if (currentAudio) {
        currentAudio.play();
        currentAudio.addEventListener('ended', playNextSong); // Automatically play the next song
    }
}

// Function to play the next song randomly
function playNextSong() {
    if (songList.length > 1) {
        const randomIndex = Math.floor(Math.random() * songList.length);
        playSong(randomIndex);
    }
}

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        const songs = await searchSongs(query);
        displaySongs(songs);
    }
});
