import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTrack: []
    };
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTrack;
    if (tracks.find(savedTrack => savedTrack.id === track.id))
    return;

    tracks.push(track);
    this.setState({
      playlistTrack: tracks
    });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTrack;
    tracks = tracks.filter(trackCompare => trackCompare.id !== track.id);
    this.setState({
      playlistTrack: tracks
    });
  }

  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTrack.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
    this.setState({
      playlistName: "New Playlist",
      playlistTrack: []
    });
  });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }
  
  render() {
  return (
    <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch = {this.search}/>
    <div className="App-playlist">
      <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
      <Playlist playlistName={this.state.playlistName} 
      playlistTrack={this.state.playlistTrack} 
      onRemove={this.removeTrack} 
      onNameChange={this.updatePlaylistName}
      onSave={this.savePlaylist}/>
    </div>
  </div>
</div>
  );
  }
}

export default App;
