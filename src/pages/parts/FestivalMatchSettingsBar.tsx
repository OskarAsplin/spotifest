import DateFnsUtils from '@date-io/date-fns';
import { createStyles, Theme, Typography, Box, Paper, Grid, Tooltip, PaletteType, InputLabel, MenuItem, FormControl, Select, ListSubheader, Modal, Fade, Backdrop, Link, MuiThemeProvider, CircularProgress, Button } from "@material-ui/core";
import { deepOrange, indigo } from "@material-ui/core/colors";
import { withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import InfoIcon from '@material-ui/icons/Info';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import React, { useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import { connect } from "react-redux";
import { spotifyApi, setLoggedOff, testFestivalMatches, turnOnLoader, setMatchSettings, setSelectedPlaylistArtists, setShowPlaylistModal } from "../../redux/actions";
import { AppState, DispatchProps, MatchingMethod, Playlist, Artist, Area, MatchSettings, UserInfo } from "../../redux/types";
import { europeanRegions, usRegions, regionMap } from "../../utils/regionUtils";
import { getIconPicture, getBigPicture, displayedLocationName } from "../../utils/utils";


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		alignItems: {
			display: 'flex',
			'@media (max-width: 799px)': {
				width: '100%',
			},
			alignItems: 'center',
		},
		alignItems2: {
			display: 'flex',
			'@media (min-width: 800px)': {
				width: '316px'
			},
			'@media (max-width: 799px)': {
				width: '100%',
			},
			alignItems: 'center',
			justifyContent: 'center',
		},
		alignItems3: {
			display: 'flex',
			flexDirection: 'column',
			'@media (max-width: 799px)': {
				width: '100%',
			},
			alignItems: 'center',
		},
		box: {
			width: '100%',
			'@media (min-width: 800px)': {
				maxWidth: '1000px',
			},
			'@media (max-width: 799px)': {
				maxWidth: '460px',
			},
			marginBottom: theme.spacing(2)
		},
		formControlPlaylist: {
			margin: theme.spacing(1),
			'@media (min-width: 800px)': {
				minWidth: 150,
				maxWidth: 220,
			},
			'@media (max-width: 799px)': {
				width: '100%',
			},
		},
		formControlArea: {
			margin: theme.spacing(1),
			'@media (min-width: 800px)': {
				minWidth: 150,
				maxWidth: 180,
			},
			'@media (max-width: 799px)': {
				width: '100%',
			},
		},
		formControl2: {
			margin: theme.spacing(1),
			'@media (min-width: 800px)': {
				minWidth: 200,
				maxWidth: 300,
			},
			'@media (max-width: 799px)': {
				minWidth: 150,
				maxWidth: 220,
			},
		},
		toolTip: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			paddingBottom: theme.spacing(0.5)
		},
		datePickerFieldFrom: {
			'@media (min-width: 800px)': {
				marginRight: theme.spacing(0.5),
				marginLeft: theme.spacing(1),
			},
			'@media (max-width: 799px)': {
				marginLeft: theme.spacing(1),
				marginRight: theme.spacing(1),
			},
		},
		datePickerFieldTo: {
			'@media (min-width: 800px)': {
				marginLeft: theme.spacing(0.5),
				marginRight: theme.spacing(1),
			},
			'@media (max-width: 799px)': {
				marginRight: theme.spacing(1),
				marginLeft: theme.spacing(1),
			},
		},
		spaceBetween: {
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'row',
			alignItems: 'center',
			'@media (min-width: 800px)': {
				justifyContent: 'space-between',
			},
			'@media (min-width: 1000px)': {
				padding: theme.spacing(0.5, 2, 0, 2),
			},
			'@media (max-width: 999px)': {
				padding: theme.spacing(0.5, 0.5, 0, 0.5),
			},
		},
		marginBottom: {
			marginBottom: '4px',
		},
		modal: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			overflowY: 'auto',
		},
		paper: {
			padding: theme.spacing(2),
			outline: 'none'
		},
		initialPlaylistTitle: {
			textAlign: 'center',
			marginBottom: theme.spacing(1)
		},
		button: {
			marginTop: theme.spacing(3),
			marginBottom: theme.spacing(1),
		},
		loadChoicesSpinner: {
			margin: theme.spacing(3)
		}
	}),
);

interface StoreProps {
	thememode: PaletteType,
	matchingMethod: MatchingMethod,
	playlists: Playlist[],
	topArtists: Artist[],
	selectedPlaylistArtists: Artist[],
	countries: Area[],
	continents: Area[],
	matchSettings: MatchSettings,
	showPlaylistModal: boolean,
	topArtistsLoaded: boolean,
	playlistsLoaded: boolean,
	isDbOnline: boolean,
	userInfo?: UserInfo,
	countTopArtists: number
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

const topArtistsChoice = '__your__top__artists__';

const FestivalMatchSettingsBar: React.FC<Props> = (props: Props) => {

	const { thememode, playlists, topArtists, selectedPlaylistArtists, countries, continents, dispatch, matchSettings, showPlaylistModal } = props;
	const { topArtistsLoaded, playlistsLoaded, isDbOnline, userInfo, countTopArtists } = props;

	useEffect(() => {
		const matchRequestIsValid = matchSettings.matchBasis === topArtistsChoice ? topArtists.length !== 0 : selectedPlaylistArtists.length !== 0;
		if (!isDbOnline && matchRequestIsValid) {
			testMatchesWithGivenSettings(
				matchSettings.area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				matchSettings.matchBasis,
				selectedPlaylistArtists,
				matchSettings.numTracks);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const smallScreen = useMediaQuery('(max-width:610px)');
	const pcScreen = useMediaQuery('(min-width:1200px)');

	const indigoOrangeMuiTheme = createMuiTheme({
		palette: {
			primary: {
				light: indigo[300],
				main: indigo[500],
				dark: indigo[700]
			},
			secondary: {
				light: deepOrange[300],
				main: deepOrange[500],
				dark: deepOrange[700]
			},
			type: thememode
		}
	});

	const testMatchesWithGivenSettings = (
		area: Area,
		dateFrom: Date,
		dateTo: Date,
		chosenPlaylistName: string,
		artistsFromPlaylist: Artist[],
		numTracks: number
	) => {
		const isTopArtists: boolean = chosenPlaylistName === topArtistsChoice;
		let continentFilter: string[] = [];
		let countryFilter: string[] = [];
		let stateFilter: string[] = [];

		if (area.isoCode !== 'XXX') {
			if (continents.find(continent => continent.isoCode === area.isoCode)) {
				continentFilter = [area.isoCode];
			} else if (europeanRegions.find(region => region === area.isoCode)) {
				countryFilter = regionMap[area.isoCode];
			} else if (usRegions.find(region => region === area.isoCode)) {
				countryFilter = ['US']
				stateFilter = regionMap[area.isoCode];
			} else {
				countryFilter = [area.isoCode];
			}
		}

		testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, numTracks, isTopArtists,
			dispatch, dateFrom, dateTo, continentFilter, countryFilter, stateFilter);
	}

	const handlePlaylistChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
		if (!event.target.value) {
			return;
		}
		const playlistName = event.target.value as string;
		if (playlistName === matchSettings.matchBasis) {
			return;
		}
		if (playlistName === topArtistsChoice) {
            dispatch(setMatchSettings({ ...matchSettings, matchBasis: playlistName, numTracks: countTopArtists }));
			testMatchesWithGivenSettings(
				matchSettings.area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				playlistName,
				selectedPlaylistArtists,
				countTopArtists);
			return;
		}

		const playlist = playlists.find(playlist => {
			return playlist.name === playlistName;
		})

		if (playlist) {
			dispatch(turnOnLoader());

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
						dispatch(setLoggedOff());
						return [];
					});
				allArtistIdsRaw = allArtistIdsRaw.concat(artistIdsRaw);
			}

            let count: { [id: string]: number; } = {};
            allArtistIdsRaw.forEach((val: string) => count[val] = (count[val] || 0) + 1);
			const artistIds: string[] = [...new Set(allArtistIdsRaw)].filter(Boolean) as string[];
			let newArtists: Artist[] = [];

			for (let index = 0; index < artistIds.length; index += 50) {
				await spotifyApi.getArtists(artistIds.slice(index, index + 50))
					.then((artistsResponse: SpotifyApi.MultipleArtistsResponse) => {
						artistsResponse.artists.map((artistResponse: SpotifyApi.ArtistObjectFull) => {
							return newArtists.push({
								name: artistResponse.name,
								spotifyId: artistResponse.id,
								hasSpotifyId: true,
								iconPicture: getIconPicture(artistResponse.images),
								bigPicture: getBigPicture(artistResponse.images),
                                popularity: artistResponse.popularity,
                                userPopularity: count[artistResponse.id],
								genres: artistResponse.genres
							} as Artist);
						})
					}).catch((error) => {
						console.log(error);
						dispatch(setLoggedOff());
						return [];
					});
			}

			if (newArtists.length > 0) {
                dispatch(setMatchSettings({ ...matchSettings, matchBasis: playlistName, numTracks: allArtistIdsRaw.length }));
				testMatchesWithGivenSettings(
					matchSettings.area,
					new Date(Date.parse(matchSettings.fromDate)),
					new Date(Date.parse(matchSettings.toDate)),
					playlistName,
					newArtists,
                    allArtistIdsRaw.length);
				dispatch(setSelectedPlaylistArtists(newArtists));
			} else {
				console.log('Something went wrong. No artists in list');
			}
		} else {
			console.log('Could not find playlist: ' + playlistName);
		}
	};

	const handleAreaChange = async (event: React.ChangeEvent<{ value: unknown, name?: string | undefined }>) => {
		if (!event.target.value) {
			return;
		}
		const area: Area = {
			name: event.target.name ? event.target.name : '',
			isoCode: event.target.value as string
		}
		if (area.isoCode !== matchSettings.area.isoCode) {
			testMatchesWithGivenSettings(
				area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				matchSettings.matchBasis,
				selectedPlaylistArtists,
				matchSettings.numTracks);
			dispatch(setMatchSettings({ ...matchSettings, area: area }));
		}
	};

	const handleFromDateChange = (date: Date | null) => {
		if (date) {
			const toDate = new Date(matchSettings.toDate);
			if (date > toDate) {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString(), toDate: date.toISOString() }));
                testMatchesWithGivenSettings(matchSettings.area, date, date, matchSettings.matchBasis, selectedPlaylistArtists, matchSettings.numTracks);
			} else {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, toDate, matchSettings.matchBasis, selectedPlaylistArtists, matchSettings.numTracks);
			}
		}
	};

	const handleToDateChange = (date: Date | null) => {
		if (date) {
			const fromDate = new Date(matchSettings.fromDate);
			if (date < fromDate) {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString(), toDate: date.toISOString() }));
                testMatchesWithGivenSettings(matchSettings.area, date, date, matchSettings.matchBasis, selectedPlaylistArtists, matchSettings.numTracks);
			} else {
				dispatch(setMatchSettings({ ...matchSettings, toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, fromDate, date, matchSettings.matchBasis, selectedPlaylistArtists, matchSettings.numTracks);
			}
		}
	};

	const classes = useStyles();

	if (!isDbOnline) {
		return (<div />);
	}

	return (
		<Box className={classes.box}>
			<Paper>
				<Box className={classes.spaceBetween}>
					<Box className={classes.alignItems}>
						<FormControl className={classes.formControlPlaylist} variant="outlined" size="small">
							<InputLabel id="choose-playlist-label">
								Match with
							</InputLabel>
							<Select
								labelId="choose-playlist-label"
								id="choose-playlist"
								value={matchSettings.matchBasis}
								onChange={handlePlaylistChange}
								label="Match with"
							>
								{topArtists.length !== 0 && <MenuItem key={topArtistsChoice} value={topArtistsChoice}>
									Your most played artists
								</MenuItem>}
								{topArtists.length !== 0 && playlists.length !== 0 && <ListSubheader disableSticky disableGutters>or choose a playlist below</ListSubheader>}
								{playlists.map((playlist) => (
									<MenuItem key={playlist.name} value={playlist.name} style={{ minWidth: 200, maxWidth: 400 }}>
										{playlist.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
					<Box className={classes.alignItems}>
						<FormControl className={classes.formControlArea} variant="outlined" size="small">
							<InputLabel id="choose-countries-label">Area</InputLabel>
							<Select
								labelId="choose-countries-label"
								id="choose-countries"
								value={matchSettings.area.isoCode}
								onChange={handleAreaChange}
								label="Area"
							>
								<MenuItem key={'XXX'} value={'XXX'} style={{ minWidth: 200 }}>
									Worldwide
								</MenuItem>
								<ListSubheader disableSticky disableGutters>Continents</ListSubheader>
								{continents.sort((a, b) => a.name > b.name ? 1 : -1).map((continent) =>
									<MenuItem key={continent.isoCode} value={continent.isoCode} style={{ minWidth: 200 }}>
										{continent.name}
									</MenuItem>
								)}
								<ListSubheader disableSticky disableGutters>European regions</ListSubheader>
								{europeanRegions.map((region) =>
									<MenuItem key={region} value={region}>
										{region}
									</MenuItem>
								)}
								<ListSubheader disableSticky disableGutters>US regions</ListSubheader>
								{usRegions.map((region) =>
									<MenuItem key={region} value={region}>
										{region}
									</MenuItem>
								)}
								<ListSubheader disableSticky disableGutters>Countries</ListSubheader>
								{countries.sort((a, b) => a.name > b.name ? 1 : -1).map((country) =>
									<MenuItem key={country.isoCode} value={country.isoCode}>
                                        <ReactCountryFlag countryCode={country.isoCode} svg style={{ marginRight: '8px' }} /> {displayedLocationName(country.name)}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Box>
					<Box className={classes.alignItems2}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid container justify="space-around" className={classes.marginBottom}>
								<KeyboardDatePicker
									className={classes.datePickerFieldFrom}
									margin="dense"
									inputVariant="outlined"
									id="date-picker-dialog-from"
									label="From (m/y)"
									format="MM/yyyy"
									maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
									minDate={new Date(new Date().getFullYear(), 0, 1)}
									views={['month', 'year']}
									value={matchSettings.fromDate}
									autoOk
									onChange={handleFromDateChange}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
								/>
							</Grid>
							<Grid container justify="space-around" className={classes.marginBottom}>
								<KeyboardDatePicker
									className={classes.datePickerFieldTo}
									margin="dense"
									inputVariant="outlined"
									id="date-picker-dialog-to"
									label="To (m/y)"
									format="MM/yyyy"
									maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
									minDate={new Date(new Date().getFullYear(), 0, 1)}
									views={['month', 'year']}
									value={matchSettings.toDate}
									autoOk
									onChange={handleToDateChange}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
								/>
							</Grid>
						</MuiPickersUtilsProvider>
					</Box>
					{pcScreen && <Box className={classes.toolTip}>
						<HtmlTooltip placement="right-start" interactive
							title={
								<React.Fragment>
									<Typography color="inherit" variant="h6">Matching algorithm</Typography>
									{'The matching algorithm is a combination of artist and genre matching. The number of artists in your selected playlist attending a festival combined with how well the genres of the playlist fit the festival, determines the match score shown on each festival.'}
								</React.Fragment>
							}
						>
							<InfoIcon color="primary" style={{ fill: thememode === 'light' ? indigo[500] : '#fcfcfe' }} />
						</HtmlTooltip>
					</Box>
					}
				</Box>
			</Paper>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
				open={showPlaylistModal}
				onClose={() => {
					dispatch(setShowPlaylistModal(false));
				}}
				disableBackdropClick
				disableEscapeKeyDown
			>
				<Fade in={showPlaylistModal}>
					<Paper className={classes.paper}>
						{!(topArtistsLoaded && playlistsLoaded) && <MuiThemeProvider theme={indigoOrangeMuiTheme}>
							<CircularProgress size={100} thickness={3} color={'secondary'} className={classes.loadChoicesSpinner} />
						</MuiThemeProvider>}
						{topArtistsLoaded && playlistsLoaded &&
							<Box className={classes.alignItems3}>
							<Typography variant={smallScreen ? topArtists.length === 0 ? "h6" : "h5" : "h4"} className={classes.initialPlaylistTitle}>
								{topArtists.length === 0 ? 'Choose a playlist to start your matching' : 'Match festivals with'}
		                        </Typography>
								<FormControl className={classes.formControl2} variant="outlined" size="small">
									{topArtists.length === 0 && <InputLabel id="choose-initial-playlist-inputlabel">
										Playlist
									</InputLabel>}
									<Select
										labelId="choose-initial-playlist-label"
										id="choose-initial-playlist"
										value={topArtists.length !== 0 ? topArtistsChoice : '' }
										label={topArtists.length === 0 ? "Playlist" : undefined}
										onChange={async (event: React.ChangeEvent<{ value: unknown }>) => {
											dispatch(setShowPlaylistModal(false));
											handlePlaylistChange(event);
										}}
									>
										{topArtists.length !== 0 && <MenuItem key={topArtistsChoice} value={topArtistsChoice}>
											Your most played artists
										</MenuItem>}
										{topArtists.length !== 0 && playlists.length !== 0 && <ListSubheader disableSticky disableGutters>or choose a playlist below</ListSubheader>}
										{playlists.map((playlist) => (
											<MenuItem key={playlist.name} value={playlist.name} style={{ minWidth: 200, maxWidth: 400 }}>
												{playlist.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>}
						{topArtistsLoaded && playlistsLoaded && topArtists.length !== 0 &&
							<Box className={classes.alignItems3}>
								<Button
									color="primary"
									size="large"
									variant="outlined"
									className={classes.button}
									onClick={() => {
										dispatch(setShowPlaylistModal(false));
                                    	dispatch(setMatchSettings({ ...matchSettings, matchBasis: topArtistsChoice, numTracks: countTopArtists }));
										testMatchesWithGivenSettings(
											matchSettings.area,
											new Date(Date.parse(matchSettings.fromDate)),
											new Date(Date.parse(matchSettings.toDate)),
											topArtistsChoice,
											selectedPlaylistArtists,
											countTopArtists);
									}}>
									<Typography variant={smallScreen ? "h6" : "h4"}>
										<Box fontWeight="fontWeightBold">
											Go
										</Box>
		                        	</Typography>
								</Button>
							</Box>}
						{topArtistsLoaded && playlistsLoaded && topArtists.length === 0 && playlists.length === 0 &&
							<Typography>We can't find any listening habits or playlists to use for our festival matching. Go to your {(userInfo && userInfo.spotifyUrl) ? <Link color={'primary'}
                                    href={userInfo.spotifyUrl}
                                    target={"_blank"}
                                    rel="noopener noreferrer">
								Spotify profile
                                </Link>: 'Spotify profile'} and create or subscribe to a playlist to start your festival matching</Typography>}
					</Paper>
				</Fade>
			</Modal>
		</Box>
	);
};

const mapStateToProps = (state: AppState) => ({
	thememode: state.model.thememode,
	matchingMethod: state.model.matchingMethod,
	playlists: state.model.playlists,
	topArtists: state.model.topArtists,
	selectedPlaylistArtists: state.model.selectedPlaylistArtists,
	countries: state.model.countries,
	continents: state.model.continents,
	matchSettings: state.model.matchSettings,
	showPlaylistModal: state.model.showPlaylistModal,
	topArtistsLoaded: state.model.topArtistsLoaded,
	playlistsLoaded: state.model.playlistsLoaded,
	isDbOnline: state.model.isDbOnline,
	userInfo: state.model.userInfo,
	countTopArtists: state.model.countTopArtists
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
