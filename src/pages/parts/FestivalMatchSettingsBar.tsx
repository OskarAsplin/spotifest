import React from 'react';
import { AppState, DispatchProps, MatchingMethod, Playlist, Artist, Area } from "../../redux/types";
import { setMatchingMethod, setLoggedOff, testFestivalMatches, turnOnLoader, setChosenArea } from "../../redux/actions";
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
import ListSubheader from '@material-ui/core/ListSubheader';

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
		},
		alignItems: {
			display: 'flex',
			width: '100%',
			alignItems: 'center',
		},
		circleSize: {
			width: '60px'
		},
		text: {
			paddingRight: '40px'
		},
		box: {
			width: '100%',
			maxWidth: '1000px',
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
			alignItems: 'center',
			//paddingRight: '10px',
		},
		greenLabel: {
			color: '#0f0',
		},
	}),
);

interface StoreProps {
	model: Model;
	thememode: PaletteType,
	matchingMethod: MatchingMethod,
	playlists: Playlist[],
	topArtists: Artist[],
	countries: Area[],
	continents: Area[],
	chosenArea: Area
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

	const { thememode, matchingMethod, playlists, topArtists, countries, continents, dispatch, chosenArea } = props;

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

	const [useTopArtists, setUseTopArtists] = React.useState(true);
	const [playlistArtists, setPlaylistArtists] = React.useState<Artist[]>([]);
	const [chosenPlaylist, setChosenPlaylist] = React.useState('__your__top__artists__');

	const testMatchesWithGivenSettings = (
		area: Area,
		isTopArtists: boolean,
		artistsFromPlaylist: Artist[]
	) => {
		if (area.isoCode === 'everywhere') {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists, props.dispatch);
		} else if (continents.find(continent => continent.isoCode === area.isoCode)) {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists, props.dispatch, [area.isoCode], []);
		} else {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists, props.dispatch, [], [area.isoCode]);
		}
	}

	const handlePlaylistChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
		const name = event.target.value as string;
		if (name === chosenPlaylist) {
			return;
		}
		setChosenPlaylist(name);
		if (name === '__your__top__artists__') {
			testMatchesWithGivenSettings(chosenArea, true, playlistArtists);
			setUseTopArtists(true);
			return;
		}

		const playlist = playlists.find(playlist => {
			return playlist.name === name;
		})

		if (playlist) {
			props.dispatch(turnOnLoader());

			let allArtistIdsRaw: string[] = [];

			for (let offset = 0; offset < playlist.numTracks; offset += 100) {
				const artistIdsRaw: string[] = await spotifyApi.getPlaylistTracks(playlist.ownerId, playlist.id, { offset: offset })
					.then(async (playlistResponse: SpotifyApi.PlaylistTrackResponse) => {

						const artistIdsRaw: string[] = playlistResponse.items.flatMap((trackItem) => {
							return trackItem.track.artists.map((trackArtist) => {
								return trackArtist.id;
							});
						});
						return artistIdsRaw;
					})
					.catch((error) => {
						console.log(error);
						props.dispatch(setLoggedOff());
						return [];
					});
				allArtistIdsRaw = allArtistIdsRaw.concat(artistIdsRaw);
			}

			const artistIds: string[] = [...new Set(allArtistIdsRaw)].filter(Boolean) as string[];
			let newArtists: Artist[] = [];

			for (let index = 0; index < artistIds.length; index += 50) {
				await spotifyApi.getArtists(artistIds.slice(index, index + 50))
					.then((artistsResponse: SpotifyApi.MultipleArtistsResponse) => {
						artistsResponse.artists.map((artistResponse: SpotifyApi.ArtistObjectFull) => {
							return newArtists.push({
								name: artistResponse.name,
								spotifyId: artistResponse.id,
								picture: artistResponse.images[0]?.url ? artistResponse.images[0].url : undefined,
								genres: artistResponse.genres
							} as Artist);
						})
					}).catch((error) => {
						console.log(error);
						props.dispatch(setLoggedOff());
						return [];
					});
			}

			if (newArtists.length > 0) {
				testMatchesWithGivenSettings(chosenArea, false, newArtists);
				setUseTopArtists(false);
				setPlaylistArtists(newArtists);
			} else {
				console.log('Something went wrong. No artists in list');
			}
		} else {
			console.log('Could not find playlist: ' + name);
		}
	};

	const handleAreaChange = async (event: React.ChangeEvent<{ value: unknown, name?: string | undefined }>) => {
		const area: Area = {
			name: event.target.name ? event.target.name : '',
			isoCode: event.target.value as string
		}
		if (area.isoCode !== chosenArea.isoCode) {
			testMatchesWithGivenSettings(area, useTopArtists, playlistArtists);
			dispatch(setChosenArea(area));
		}
	};

	const classes = useStyles();

	return (
		<Box className={classes.box}>
			<Paper>
				<Grid component="label" container alignItems="center" spacing={1}>
					<Grid item xs={4} className={classes.alignItems}>
						<FormControl className={classes.formControl} variant="outlined" size="small" color={useTopArtists ? 'secondary' : 'primary'}>
							<InputLabel id="choose-playlist-label">
								Match with
							</InputLabel>
							<Select
								labelId="choose-playlist-label"
								id="choose-playlist"
								value={chosenPlaylist}
								onChange={handlePlaylistChange}
								label="Match with"
							>
								<MenuItem key={'__your__top__artists__'} value={'__your__top__artists__'}>
									Your top 50 artists
								</MenuItem>
								<ListSubheader>or choose a playlist below</ListSubheader>
								{playlists.map((playlist) => (
									<MenuItem key={playlist.name} value={playlist.name}>
										{playlist.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={3}>
						<FormControl className={classes.formControl} variant="outlined" size="small">
							<InputLabel id="choose-countries-label">Area</InputLabel>
							<Select
								labelId="choose-countries-label"
								id="choose-countries"
								value={chosenArea.isoCode}
								onChange={handleAreaChange}
								label="Area"
							>
								<MenuItem key={'everywhere'} value={'everywhere'}>
									Everywhere
								</MenuItem>
								<ListSubheader>Continents</ListSubheader>
								{continents.map((continent) =>
									<MenuItem key={continent.isoCode} value={continent.isoCode}>
										{continent.name}
									</MenuItem>
								)}
								<ListSubheader>Countries</ListSubheader>
								{countries.map((country) =>
									<MenuItem key={country.isoCode} value={country.isoCode}>
										{country.name}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4} className={classes.alignItems}>
						<MuiThemeProvider theme={lightBluePinkMuiTheme}>
							{/* The invisible button is a quick fix for click event propagation from the grid item */}
							<Button hidden className={classes.invisibleButton}>.</Button>
							<Button disableRipple disableElevation className={classes.button}
								color={matchingMethod === MatchingMethod.Genre ? 'primary' : 'default'}
								onClick={() => dispatch(setMatchingMethod(MatchingMethod.Genre))}>
								Genre
							</Button>
							<Switch checked={matchingMethod === MatchingMethod.Artist} color="default" onChange={(evt) => {
								dispatch(setMatchingMethod(evt.target.checked ? MatchingMethod.Artist : MatchingMethod.Genre));
							}} name="checkedArtistGenre" />
							<Button disableRipple disableElevation className={classes.button}
								color={matchingMethod === MatchingMethod.Artist ? 'primary' : 'default'}
								onClick={() => dispatch(setMatchingMethod(MatchingMethod.Artist))}>
								Artist
							</Button>
						</MuiThemeProvider>
					</Grid>
					<Grid item xs={1} className={classes.toolTip}>
						<HtmlTooltip placement="right-start" interactive
							title={
								<React.Fragment>
									<Typography color="inherit" variant="h6">Matching algorithm</Typography>
									<Typography color="inherit" variant="subtitle1"><em>{"Genres"}</em></Typography>
									{'Genre matching takes the genres of your top 50 artists or the genres of a chosen playlist and compares it to the genres of our registered festivals.'}
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
	playlists: state.model.playlists,
	topArtists: state.model.topArtists,
	countries: state.model.countries,
	continents: state.model.continents,
	chosenArea: state.model.chosenArea
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
