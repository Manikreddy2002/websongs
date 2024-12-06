// Replace with your Spotify API credentials
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
    displaySongs(data.tracks.items);
}

// Function to display songs in a list
function displaySongs(tracks) {
    const songList = document.getElementById('song-list');
    songList.innerHTML = ''; // Clear previous results

    tracks.forEach(track => {
        const listItem = document.createElement('li');
        listItem.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => {
            playTrack(track.preview_url);
        });

        listItem.appendChild(playButton);
        songList.appendChild(listItem);
    });
}

// Function to play a track using HTML5 audio
function playTrack(previewUrl) {
    if (!previewUrl) {
        alert('Preview not available for this track.');
        return;
    }

    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = previewUrl;
    audioPlayer.play();
}

// Add event listener to search form
document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    searchSongs(query);
});
