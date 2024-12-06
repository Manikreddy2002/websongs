// Function to display song results
function displaySongs(songs) {
    const resultsContainer = document.getElementById('song-results');
    resultsContainer.innerHTML = ''; // Clear previous results
    
    songs.forEach(song => {
        // Only display songs with a preview_url
        if (song.preview_url) {
            const songElement = document.createElement('div');
            songElement.className = 'song';
            songElement.innerHTML = `
                <img src="${song.album.images[0].url}" alt="${song.name}">
                <div>
                    <h3>${song.name}</h3>
                    <p>${song.artists[0].name}</p>
                    <audio controls autoplay>
                        <source src="${song.preview_url}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `;
            resultsContainer.appendChild(songElement);
        } else {
            const songElement = document.createElement('div');
            songElement.className = 'song';
            songElement.innerHTML = `
                <img src="${song.album.images[0].url}" alt="${song.name}">
                <div>
                    <h3>${song.name}</h3>
                    <p>${song.artists[0].name}</p>
                    <p>No preview available</p>
                </div>
            `;
            resultsContainer.appendChild(songElement);
        }
    });
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

// Event listener for search button
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        const songs = await searchSongs(query);
        displaySongs(songs);
    }
});
