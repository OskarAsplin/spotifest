import React, { useEffect } from 'react';
import { AppState, DispatchProps, MatchingMethod, Playlist, Artist, Area, MatchSettings, Model } from "../../redux/types";
import { spotifyApi, setLoggedOff, testFestivalMatches, turnOnLoader, setMatchSettings, setSelectedPlaylistArtists, getIconPicture, getBigPicture, setShowPlaylistModal } from "../../redux/actions";
import { connect } from "react-redux";
import { createStyles, Theme, Typography, Box, Paper, Grid, Tooltip, PaletteType, InputLabel, MenuItem, FormControl, Select, ListSubheader, Modal, Fade, Backdrop, Link } from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import indigo from "@material-ui/core/colors/indigo";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import InfoIcon from '@material-ui/icons/Info';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';

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
			maxWidth: '1000px',
			marginBottom: theme.spacing(2)
		},
		formControlPlaylist: {
			margin: theme.spacing(1),
			'@media (min-width: 800px)': {
				minWidth: 150,
				maxWidth: 215,
			},
			'@media (max-width: 799px)': {
				width: '100%',
			},
		},
		formControlArea: {
			margin: theme.spacing(1),
			'@media (min-width: 800px)': {
				minWidth: 150,
				maxWidth: 185,
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
				width: '100%',
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
		noPadding: {
			paddingRight: 0
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
			padding: theme.spacing(2)
		},
		initialPlaylistTitle: {
			marginBottom: theme.spacing(2)
		}
	}),
);

interface StoreProps {
	model: Model;
	thememode: PaletteType,
	matchingMethod: MatchingMethod,
	playlists: Playlist[],
	topArtists: Artist[],
	selectedPlaylistArtists: Artist[],
	countries: Area[],
	continents: Area[],
	matchSettings: MatchSettings,
	showPlaylistModal: boolean,
	noRegisteredPlaylists: boolean
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

	useEffect(() => {
		if (!props.model.isDbOnline && selectedPlaylistArtists.length !== 0) {
			testMatchesWithGivenSettings(
				matchSettings.area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				matchSettings.matchBasis,
				selectedPlaylistArtists);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const smallScreen = useMediaQuery('(max-width:610px)');
	const pcScreen = useMediaQuery('(min-width:1200px)');

	const { thememode, playlists, topArtists, selectedPlaylistArtists, countries, continents, dispatch, matchSettings, showPlaylistModal, noRegisteredPlaylists } = props;

	const testMatchesWithGivenSettings = (
		area: Area,
		dateFrom: Date,
		dateTo: Date,
		chosenPlaylistName: string,
		artistsFromPlaylist: Artist[]
	) => {
		const isTopArtists: boolean = chosenPlaylistName === '__your__top__artists__'
		if (continents.find(continent => continent.isoCode === area.isoCode)) {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				dispatch, dateFrom, dateTo, [area.isoCode], []);
		} else {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				dispatch, dateFrom, dateTo, [], [area.isoCode]);
		}
	}

	const handlePlaylistChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
		if (!event.target.value) {
			return;
		}
		const playlistName = event.target.value as string;
		if (playlistName === matchSettings.matchBasis) {
			return;
		}
		dispatch(setMatchSettings({ ...matchSettings, matchBasis: playlistName }));
		if (playlistName === '__your__top__artists__') {
			testMatchesWithGivenSettings(
				matchSettings.area,
				new Date(Date.parse(matchSettings.fromDate)),
				new Date(Date.parse(matchSettings.toDate)),
				playlistName,
				selectedPlaylistArtists);
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
				testMatchesWithGivenSettings(
					matchSettings.area,
					new Date(Date.parse(matchSettings.fromDate)),
					new Date(Date.parse(matchSettings.toDate)),
					playlistName,
					newArtists);
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
				selectedPlaylistArtists);
			dispatch(setMatchSettings({ ...matchSettings, area: area }));
		}
	};

	const handleFromDateChange = (date: Date | null) => {
		const toDate = new Date(Date.parse(matchSettings.toDate));
		if (date) {
			if (date > toDate) {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString(), toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, date, matchSettings.matchBasis, selectedPlaylistArtists);
			} else {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, toDate, matchSettings.matchBasis, selectedPlaylistArtists);
			}
		}
	};

	const handleToDateChange = (date: Date | null) => {
		const fromDate = new Date(Date.parse(matchSettings.fromDate));
		if (date) {
			if (date < fromDate) {
				dispatch(setMatchSettings({ ...matchSettings, fromDate: date.toISOString(), toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, date, date, matchSettings.matchBasis, selectedPlaylistArtists);
			} else {
				dispatch(setMatchSettings({ ...matchSettings, toDate: date.toISOString() }));
				testMatchesWithGivenSettings(matchSettings.area, fromDate, date, matchSettings.matchBasis, selectedPlaylistArtists);
			}
		}
	};

	const classes = useStyles();

	if (!props.model.isDbOnline) {
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
								{topArtists.length !== 0 && <MenuItem key={'__your__top__artists__'} value={'__your__top__artists__'}>
									Your most played artists
								</MenuItem>}
								<ListSubheader disableSticky disableGutters>{topArtists.length !== 0 ? 'or choose a playlist below' : 'choose a playlist below'}</ListSubheader>
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
								{continents.sort((a, b) => a.name > b.name ? 1 : -1).map((continent) =>
									<MenuItem key={continent.isoCode} value={continent.isoCode} style={{ minWidth: 200 }}>
										{continent.name}
									</MenuItem>
								)}
								<ListSubheader disableSticky disableGutters>Countries</ListSubheader>
								{countries.sort((a, b) => a.name > b.name ? 1 : -1).map((country) =>
									<MenuItem key={country.isoCode} value={country.isoCode}>
										{country.name}
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
									//inputProps={{ classes: { adornedEnd: classes.noPadding } }}
									margin="dense"
									inputVariant="outlined"
									id="date-picker-dialog-from"
									label="From (m/y)"
									format="MM/yyyy"
									maxDate={new Date('2021-12-31')}
									minDate={new Date('2019-01-01')}
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
									maxDate={new Date('2021-12-31')}
									minDate={new Date('2019-01-01')}
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
									{'The matching agorithm is based on the genres of the festivals, giving a higher score if the genres fit well to your most played artists or selected playlist. Matching artists in the lineup of a festival will also increase the matching percent.'}
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
						{playlists.length !== 0 &&
							<Box className={classes.alignItems3}>
								<Typography variant={smallScreen ? "h6" : "h4"} className={classes.initialPlaylistTitle}>
									Choose a playlist to start your matching
		                        </Typography>
								<FormControl className={classes.formControl2} variant="outlined" size="small">
									<InputLabel id="choose-playlist-label">
										Playlist
		                        </InputLabel>
									<Select
										labelId="choose-initial-playlist-label"
										id="choose-initial-playlist"
										value={''}
									onChange={async (event: React.ChangeEvent<{ value: unknown }>) => {
										dispatch(setShowPlaylistModal(false));
										handlePlaylistChange(event);
									}}
										label="Playlist"
									>
										{playlists.map((playlist) => (
											<MenuItem key={playlist.name} value={playlist.name} style={{ minWidth: 200, maxWidth: 400 }}>
												{playlist.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>}
						{noRegisteredPlaylists &&
							<Typography>We can't find any listening habits or playlists to use for our festival matching. Go to your {(props.model.userInfo && props.model.userInfo.spotifyUrl) ? <Link color={'primary'}
                                    href={props.model.userInfo.spotifyUrl}
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
	model: state.model,
	thememode: state.model.thememode,
	matchingMethod: state.model.matchingMethod,
	playlists: state.model.playlists,
	topArtists: state.model.topArtists,
	selectedPlaylistArtists: state.model.selectedPlaylistArtists,
	countries: state.model.countries,
	continents: state.model.continents,
	matchSettings: state.model.matchSettings,
	showPlaylistModal: state.model.showPlaylistModal,
	noRegisteredPlaylists: state.model.noRegisteredPlaylists
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
