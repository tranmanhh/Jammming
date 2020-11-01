let accessToken;
const clientID = 'a46b190953a447fe82b1a31ff0449767';
const redirectUri = 'http://localhost:3000/';

let Spotify = {
    getAccessToken() {
        if (accessToken)
        {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expirationTimeMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expirationTimeMatch)
        {
            accessToken = accessTokenMatch[1];
            const expiredTime = Number(expirationTimeMatch[1]);
            window.setTimeout(() => accessToken = '', expiredTime * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        else
        {
            const tokenUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = tokenUrl;
        }
    },

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {
            Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
            return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    link: track.link_from,
                    preview: track.preview_url
                }));
            });
    },

    savePlaylist(playlistName, uriArr) {
        if(!playlistName || !uriArr.length) {
        return;
        }

        const token = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        let userID;
        
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: playlistName})
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: uriArr})
        });
    });
});
}
};

export default Spotify;