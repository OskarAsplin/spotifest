import React from 'react';
import { AppState, DispatchProps, MatchingMethod, Playlist, Artist, Area } from "../../redux/types";
import { spotifyApi, setLoggedOff, testFestivalMatches, turnOnLoader, setChosenArea, getIconPicture, getBigPicture } from "../../redux/actions";
import { connect } from "react-redux";
import { createStyles, Theme, MuiThemeProvider } from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import indigo from "@material-ui/core/colors/indigo";
import { Model } from "../../redux/types";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { PaletteType } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { lightBlue, pink } from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

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
            '@media (max-width: 699px)': {
                width: '100%',
            },
			alignItems: 'center',
		},
        alignItems2: {
            display: 'flex',
            '@media (min-width: 700px)': {
                width: '300px'
            },
            '@media (max-width: 699px)': {
                width: '100%',
            },
            alignItems: 'center',
            justifyContent: 'center',
        },
		box: {
			width: '100%',
			maxWidth: '1000px',
			marginBottom: theme.spacing(2)
		},
		formControl: {
			margin: theme.spacing(1),
            '@media (min-width: 700px)': {
                minWidth: 120,
                maxWidth: 300,
            },
            '@media (max-width: 699px)': {
                width: '100%',
            },
		},
		toolTip: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		datePickerFieldFrom: {
			marginRight: theme.spacing(0.5),
		},
        datePickerFieldTo: {
            marginLeft: theme.spacing(0.5),
        },
        noPadding: {
            paddingRight: 0
        },
        spaceBetween: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
            '@media (min-width: 700px)': {
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
    const pcScreen = useMediaQuery('(min-width:1200px)');

	const { thememode, playlists, topArtists, countries, continents, dispatch, chosenArea } = props;

	const [useTopArtists, setUseTopArtists] = React.useState(true);
	const [playlistArtists, setPlaylistArtists] = React.useState<Artist[]>([]);
	const [chosenPlaylist, setChosenPlaylist] = React.useState('__your__top__artists__');
	const [selectedFromDate, setSelectedFromDate] = React.useState<Date>(new Date());
	const [selectedToDate, setSelectedToDate] = React.useState<Date>(new Date(new Date().getFullYear(), 11, 31));

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
			type: props.model.thememode
		}
	});

	const testMatchesWithGivenSettings = (
		area: Area,
		dateFrom: Date,
		dateTo: Date,
		isTopArtists: boolean,
		artistsFromPlaylist: Artist[]
	) => {
		if (area.isoCode === 'everywhere') {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				props.dispatch, dateFrom, dateTo);
		} else if (continents.find(continent => continent.isoCode === area.isoCode)) {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				props.dispatch, dateFrom, dateTo, [area.isoCode], []);
		} else {
			testFestivalMatches(isTopArtists ? topArtists : artistsFromPlaylist, isTopArtists,
				props.dispatch, dateFrom, dateTo, [], [area.isoCode]);
		}
	}

	const handlePlaylistChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
		const name = event.target.value as string;
		if (name === chosenPlaylist) {
			return;
		}
		setChosenPlaylist(name);
		if (name === '__your__top__artists__') {
			testMatchesWithGivenSettings(chosenArea, selectedFromDate, selectedToDate, true, playlistArtists);
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
                                iconPicture: getIconPicture(artistResponse.images),
                                bigPicture: getBigPicture(artistResponse.images),
								popularity: artistResponse.popularity,
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
				testMatchesWithGivenSettings(chosenArea, selectedFromDate, selectedToDate, false, newArtists);
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
			testMatchesWithGivenSettings(area, selectedFromDate, selectedToDate, useTopArtists, playlistArtists);
			dispatch(setChosenArea(area));
		}
	};

	const handleFromDateChange = (date: Date | null) => {
		if (date) {
			setSelectedFromDate(date);
			if (date > selectedToDate) {
				setSelectedToDate(date);
				testMatchesWithGivenSettings(chosenArea, date, date, useTopArtists, playlistArtists);
			} else {
				testMatchesWithGivenSettings(chosenArea, date, selectedToDate, useTopArtists, playlistArtists);
			}
		}
	};

	const handleToDateChange = (date: Date | null) => {
		if (date) {
			setSelectedToDate(date);
			if (date < selectedFromDate) {
				setSelectedFromDate(date);
				testMatchesWithGivenSettings(chosenArea, date, date, useTopArtists, playlistArtists);
			} else {
				testMatchesWithGivenSettings(chosenArea, selectedFromDate, date, useTopArtists, playlistArtists);
			}
		}
	};

	const classes = useStyles();

	return (
		<Box className={classes.box}>
			<MuiThemeProvider theme={lightBluePinkMuiTheme}>
				<Paper>
					<Box className={classes.spaceBetween}>
						<Box className={classes.alignItems}>
							<FormControl className={classes.formControl} variant="outlined" size="small">
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
										Your top artists
									</MenuItem>
									<ListSubheader>or choose a playlist below</ListSubheader>
									{playlists.map((playlist) => (
										<MenuItem key={playlist.name} value={playlist.name} style={{ maxWidth: 400 }}>
											{playlist.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
                        <Box className={classes.alignItems}>
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
										label="From"
										format="MM/yyyy"
										maxDate={new Date('2021-12-31')}
										minDate={new Date('2019-01-01')}
										views={['year', 'month']}
										value={selectedFromDate}
										autoOk
										onChange={handleFromDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
									/>
								</Grid>
                                <Grid container justify="space-around" className={classes.marginBottom}>
									<KeyboardDatePicker
                                        className={classes.datePickerFieldFrom}
										margin="dense"
										inputVariant="outlined"
										id="date-picker-dialog-to"
										label="To"
										format="MM/yyyy"
										maxDate={new Date('2021-12-31')}
										minDate={new Date('2019-01-01')}
										views={['year', 'month']}
										value={selectedToDate}
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
										{'The matching agorithm is based on the genres of the festivals, giving a higher score if the genres fit well to your top artists or selected playlist. Matching artists in the lineup of a festival will also increase the matching percent.'}
									</React.Fragment>
								}
							>
								<InfoIcon color="primary" style={{ fill: thememode === 'light' ? indigo[500] : '#fcfcfe' }} />
							</HtmlTooltip>
						</Box>
						}
					</Box>
				</Paper>
			</MuiThemeProvider>
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
