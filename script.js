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
function displaySongs(songs) {
    const resultsContainer = document.getElementById('song-results');
    resultsContainer.innerHTML = '';
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <img src="${song.album.images[0].url}" alt="${song.name}">
            <div>
                <h3>${song.name}</h3>
                <p>${song.artists[0].name}</p>
                <audio controls>
                    <source src="${song.preview_url}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <button class="add-to-playlist" data-preview-url="${song.preview_url}" data-song-name="${song.name}" data-artist-name="${song.artists[0].name}">
                    Add to Playlist
                </button>
            </div>
        `;
        resultsContainer.appendChild(songElement);
    });

    // Attach event listeners to "Add to Playlist" buttons
    document.querySelectorAll('.add-to-playlist').forEach(button => {
        button.addEventListener('click', () => {
            const song = {
                previewUrl: button.dataset.previewUrl,
                name: button.dataset.songName,
                artist: button.dataset.artistName,
            };
            addToPlaylist(song);
        });
    });
}

// Playlist array to hold selected songs
const playlist = [];

// Function to add songs to the playlist
function addToPlaylist(song) {
    playlist.push(song);
    displayPlaylist();
}

// Function to display playlist
function displayPlaylist() {
    const playlistContainer = document.getElementById('playlist');
    playlistContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'playlist-song';
        songElement.innerHTML = `
            <p>${index + 1}. ${song.name} - ${song.artist}</p>
            <audio controls>
                <source src="${song.previewUrl}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        playlistContainer.appendChild(songElement);
    });
}

// Function to play playlist automatically
async function playPlaylist() {
    for (let i = 0; i < playlist.length; i++) {
        const audio = new Audio(playlist[i].previewUrl);
        await new Promise(resolve => {
            audio.addEventListener('ended', resolve);
            audio.play();
        });
    }
}

// Event listener for search button
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        const songs = await searchSongs(query);
        displaySongs(songs);
    }
});

// Event listener for "Play Playlist" button
document.getElementById('play-playlist-button').addEventListener('click', playPlaylist);
