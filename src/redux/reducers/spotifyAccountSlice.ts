import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserInfo, Artist, Playlist } from "../types";

interface SpotifyAccountState {
    userInfo?: UserInfo;
    topArtists: Artist[];
    playlists: Playlist[];
    topArtistsLoaded: boolean;
    playlistsLoaded: boolean;
    countTopArtists: number;
}

const initialState: SpotifyAccountState = {
    userInfo: undefined,
    topArtists: [],
    playlists: [],
    topArtistsLoaded: false,
    playlistsLoaded: false,
    countTopArtists: 0,
};

export const spotifyAccountSlice = createSlice({
    name: 'spotifyAccount',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },
        setTopArtists: (state, action: PayloadAction<{ artists: Artist[], countTopArtists: number }>) => {
            state.topArtists = action.payload.artists;
            state.topArtistsLoaded = true;
            state.countTopArtists = action.payload.countTopArtists;
        },
        setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
            const sortedPlaylists = action.payload.sort((a: Playlist, b: Playlist) => {
                let aName = a.name.toUpperCase();
                let bName = b.name.toUpperCase();
                return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            });
            state.playlists = sortedPlaylists;
            state.playlistsLoaded = true;
        },
    },
});

export const { setUserInfo, setTopArtists, setPlaylists } = spotifyAccountSlice.actions;

export const selectUserInfo = (state: RootState) => state.spotifyAccount.userInfo;
export const selectTopArtists = (state: RootState) => state.spotifyAccount.topArtists;
export const selectPlaylists = (state: RootState) => state.spotifyAccount.playlists;
export const selectTopArtistsLoaded = (state: RootState) => state.spotifyAccount.topArtistsLoaded;
export const selectPlaylistsLoaded = (state: RootState) => state.spotifyAccount.playlistsLoaded;
export const selectCountTopArtists = (state: RootState) => state.spotifyAccount.countTopArtists;

export default spotifyAccountSlice.reducer;

