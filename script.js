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
let currentSongIndex = -1; // To track the current song being played
let songList = []; // Stores the list of songs from the search results

function displaySongs(songs) {
    const resultsContainer = document.getElementById('song-results');
    resultsContainer.innerHTML = '';
    songList = songs; // Save the songs to the global list

    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <img src="${song.album.images[0].url}" alt="${song.name}">
            <div>
                <h3>${song.name}</h3>
                <p>${song.artists[0].name}</p>
            </div>
        `;
        resultsContainer.appendChild(songElement);
    });

    // Start auto-playing the first song
    if (songList.length > 0) {
        currentSongIndex = 0;
        playSong(songList[currentSongIndex]);
    }
}

// Function to play a song
function playSong(song) {
    const audio = new Audio(song.preview_url);
    audio.play();

    // Handle when the song ends
    audio.addEventListener('ended', () => {
        playNextSong(); // Play the next random song when the current song ends
    });
}

// Function to play the next random song
function playNextSong() {
    if (songList.length > 0) {
        // Select a random index different from the current one
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songList.length);
        } while (randomIndex === currentSongIndex);

        currentSongIndex = randomIndex;
        playSong(songList[currentSongIndex]);
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
