import React from 'react';
import { AppState, DispatchProps, MatchingMethod, Playlist, Artist } from "../../redux/types";
import { setMatchingMethod, setLoggedOff, testFestivalMatches, turnOnLoader } from "../../redux/actions";
import { connect } from "react-redux";
import { createStyles, MuiThemeProvider, Theme } from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";
import indigo from "@material-ui/core/colors/indigo";
import { Model } from "../../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import { PaletteType } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			justifyContent: 'space-between',
			flexGrow: 1,
			flexDirection: 'row',
			padding: theme.spacing(2, 4, 1, 4),
			width: '100%',
			alignItems: 'center',
		},
		alignCenter: {
			display: 'flex',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			//marginBottom: theme.spacing(2)
		},
		circleSize: {
			width: '60px'
		},
		text: {
			paddingRight: '40px'
		},
		box: {
			width: '80%',
			maxWidth: '700px',
			marginBottom: theme.spacing(2)
		},
		button: {
			textTransform: 'none',
			padding: theme.spacing(0),
			fontSize: '18px',
			"&:hover": {
				backgroundColor: "transparent",
			}
		},
		invisibleButton: {
			display: 'none'
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
			maxWidth: 300,
		},
		toolTip: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-end',
			margin: '10px',
		},
	}),
);

interface StoreProps {
	model: Model;
	thememode: PaletteType,
	matchingMethod: MatchingMethod,
	playlists: Playlist[]
}

type Props = DispatchProps & StoreProps;

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: '#f5f5f9',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 320,
		fontSize: theme.typography.pxToRem(12),
		border: '1px solid #dadde9',
	},
}))(Tooltip);

const FestivalMatchSettingsBar: React.FC<Props> = (props: Props) => {

	// const smallScreen = useMediaQuery('(max-width:610px)');

	const { thememode, matchingMethod, playlists, dispatch } = props;

	const lightBluePinkMuiTheme = createMuiTheme({
		palette: {
			primary: {
				light: lightBlue[300],
				main: lightBlue[500],
				dark: lightBlue[700]
			},
			secondary: {
				light: pink[300],
				main: pink[500],
				dark: pink[700]
			},
			type: thememode
		}
	});

	const [playlistName, setPlaylistName] = React.useState('');

	const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {

		const name = event.target.value as string;
		setPlaylistName(name);

		const chosenPlaylist = playlists.find(playlist => {
			return playlist.name === name;
		})

		if (chosenPlaylist) {
			props.dispatch(turnOnLoader());

			let playlistArtists: Artist[] = [];
			let allArtistIdsRaw: string[] = [];

			for (let offset = 0; offset < chosenPlaylist.numTracks; offset += 100) {
				const artistIdsRaw: string[] = await spotifyApi.getPlaylistTracks(chosenPlaylist.ownerId, chosenPlaylist.id, { offset: offset })
					.then((playlistResponse: SpotifyApi.PlaylistTrackResponse) => {
						console.log('getPlaylistTracks response: ');
						console.log(playlistResponse);

						const artistIdsRaw: string[] = playlistResponse.items.flatMap((trackItem) => {
							return trackItem.track.artists.map((trackArtist) => {
								return trackArtist.id;
							});
						});
						console.log(artistIdsRaw);
						return artistIdsRaw;
					})
					.catch((error) => {
						console.log(error);
						props.dispatch(setLoggedOff());
						return [];
					});
				allArtistIdsRaw = allArtistIdsRaw.concat(artistIdsRaw);
			}

			const artistIds: string[] = [...new Set(allArtistIdsRaw)];

			for (let index = 0; index < artistIds.length; index += 50) {
				await spotifyApi.getArtists(artistIds.slice(index, index + 50))
					.then((artistsResponse: SpotifyApi.MultipleArtistsResponse) => {
						artistsResponse.artists.map((artistResponse: SpotifyApi.ArtistObjectFull) => {
							return playlistArtists.push({
								name: artistResponse.name,
								spotifyId: artistResponse.id,
								picture: artistResponse.images[0]?.url ? artistResponse.images[0].url : undefined,
								genres: artistResponse.genres
							} as Artist);
						})
					});
			}

			console.log(playlistArtists);
			testFestivalMatches(playlistArtists, false, props.dispatch);
		} else {
			console.log('Could not find playlist: ' + name);
		}

	};

	const classes = useStyles();

	const handleGenreArtistChange = (event: any) => {
		if (event.target.checked) {
			dispatch(setMatchingMethod(MatchingMethod.Artist));
		} else {
			dispatch(setMatchingMethod(MatchingMethod.Genre));
		}
	};

	return (
		<Box className={classes.box}>
			<Paper>
				<Grid component="label" container alignItems="center" spacing={1}>
					<Grid item xs={3}>
						<FormControl className={classes.formControl} variant="outlined" size="small">
							<InputLabel id="choose-playlist-label">Playlist</InputLabel>
							<Select
								labelId="choose-playlist-label"
								id="choose-playlist"
								value={playlistName}
								onChange={handleChange}
								label="Playlist"
							>
								{playlists.map((playlist) => (
									<MenuItem key={playlist.name} value={playlist.name}>
										{playlist.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.alignCenter}>
							<MuiThemeProvider theme={lightBluePinkMuiTheme}>
								{/* The invisible button is a quick fix for click event propagation from the grid item */}
								<Button hidden className={classes.invisibleButton} />
								<Button disableRipple disableElevation className={classes.button}
									color={matchingMethod === MatchingMethod.Genre ? 'primary' : 'default'}
									onClick={() => dispatch(setMatchingMethod(MatchingMethod.Genre))}>
									Genre
								</Button>
								<Switch checked={matchingMethod === MatchingMethod.Artist} color="default" onChange={handleGenreArtistChange} name="checkedC" />
								<Button disableRipple disableElevation className={classes.button}
									color={matchingMethod === MatchingMethod.Artist ? 'primary' : 'default'}
									onClick={() => dispatch(setMatchingMethod(MatchingMethod.Artist))}>
									Artist
								</Button>
							</MuiThemeProvider>
						</div>
					</Grid>
					<Grid item xs={2} className={classes.toolTip}>
						<HtmlTooltip placement="right-start" interactive
							title={
								<React.Fragment>
									<Typography color="inherit" variant="h6">Matching algorithm</Typography>
									<Typography color="inherit" variant="subtitle1"><em>{"Genres"}</em></Typography>
									{'Genre matching takes the genres of your top 50 artists and compares it to the genres of our registered festivals.'}
									<Typography color="inherit" variant="subtitle1"><em>{"Artists"}</em></Typography>
									{'Artist matching checks if any of your top 50 artists have been to our registered festivals the last 1-3 years.'}
								</React.Fragment>
							}
						>
							<InfoIcon color="primary" style={{ fill: thememode === 'light' ? indigo[500] : '#fcfcfe' }} />
						</HtmlTooltip>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

const mapStateToProps = (state: AppState) => ({
	model: state.model,
	thememode: state.model.thememode,
	matchingMethod: state.model.matchingMethod,
	playlists: state.model.playlists
});

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatch
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FestivalMatchSettingsBar);
