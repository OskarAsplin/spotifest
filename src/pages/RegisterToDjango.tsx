import React, { useEffect, useState } from 'react';
import { AppState, DispatchProps, Artist, Lineup } from "../redux/types";
import { registerLineup } from "../redux/actions";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import deepOrange from "@material-ui/core/colors/deepOrange";
import indigo from "@material-ui/core/colors/indigo";
import { Model } from "../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { mapLimit } from 'async';
import { spotifyApi } from "../redux/actions";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			padding: theme.spacing(0, 4, 0, 4),
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%'
		},
		verticalSpace: {
			display: 'flex',
			padding: theme.spacing(4, 0, 4, 0),
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%'
		},
		progressBar: {
			position: 'fixed',
			top: '50%',
			left: '50%',
			marginTop: '-50px',
			marginLeft: '-50px'
		},
	}),
);

interface StoreProps {
	model: Model;
}

type Props = DispatchProps & StoreProps;

const initialLineup: Lineup = {
	festival: '',
	country: '',
	year: 0,
	artists: []
}

function editDistance(s1: string, s2: string) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	let costs = [];
	for (let i = 0; i <= s1.length; i++) {
		let lastValue = i;
		for (let j = 0; j <= s2.length; j++) {
			if (i === 0)
				costs[j] = j;
			else {
				if (j > 0) {
					let newValue = costs[j - 1];
					if (s1.charAt(i - 1) !== s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}


function similarity(s1: string, s2: string) {
	let longer = s1;
	let shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	let longerLength = longer.length;
	if (longerLength === 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / longerLength;
}

const handleSearchArray = async (item: string, removeFromSearch: string[], artists: Artist[], threshold: number): Promise<any> => {
	// To avoid 429 error code
	await new Promise(r => setTimeout(r, 200));

	let artistName: string = item.trim().toLowerCase();
	return await spotifyApi.searchArtists(artistName)
		.then((response) => {
			for (const result of response.artists.items) {
				if (!result.name) {
					console.log('search result for ' + artistName + ' is undefined');
				}
				const resultName = result.name.toLowerCase();
				const sim: number = similarity(resultName.replace(/’s|'s|`s|´s/i, 's'), artistName.replace(/’s|'s|`s|´s/i, 's'));
				if (resultName === artistName || resultName.replace(/’s|'s|`s|´s/i, 's') === artistName.replace(/’s|'s|`s|´s/i, 's')
					|| sim > threshold) {
					let picture = '';
					if (result.images.length > 0) {
						result.images.slice().reverse().forEach((image) => {
							if (picture === '' && image.height && image.height > 159 && image.width && image.width > 159) {
								picture = image.url;
							}
						});
						if (picture === '') {
							picture = result.images[0].url;
						}
					}
					//const picture = result.images.filter((image) => image.height && image.height > 159 && image.width && image.width > 159)
					const artistMatch: Artist = {
						name: result.name,
						spotifyId: result.id,
						picture: picture,
						popularity: result.popularity,
						genres: result.genres
					} as Artist;
					artists.push(artistMatch);
					removeFromSearch.push(item);
					return artistMatch;
				}
			}
		}).catch((error) => {
			console.log(artistName, ' caused an error:');
			console.log(error);
			return undefined;
		}).finally(() => { return undefined });
}

const allTrueChecker = (arr: boolean[]) => arr.every(Boolean);

const RegisterToDjango: React.FC<Props> = (props: Props) => {

	useEffect(() => {
		if (props.model.accessToken) {
			spotifyApi.setAccessToken(props.model.accessToken);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [lineup, setLineup] = useState<Lineup>(initialLineup);
	const [ready, setReady] = useState<boolean>(false);
	const [readyArr, setReadyArr] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);


	//const smallScreen = useMediaQuery('(max-width:610px)');

	const loaderOn = props.model.loaderOn;
	const muiTheme = createMuiTheme({
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
			type: props.model.thememode
		}
	});

	const classes = useStyles();

	const setInputFieldReady = (num: number, ready: boolean) => {
		readyArr[num] = ready;
		setReadyArr(readyArr);
		allTrueChecker(readyArr) ? setReady(true) : setReady(false);
	}

	const fetchArtistsFromSpotifyAndAddToLineup = async (evt: any) => {
		if (evt.target.value.length > 0) {
			let artists: Artist[] = [];
			let inputArtists: string[] = evt.target.value.split(/[,]+/i); //.split(/[,&]+|\band\b/i);
			let removeFromSearch: string[] = [];

			// First go through pairs of two if there is an artist with a comma in the name
			let firstInputArray: string[] = inputArtists.map((el, index) => {
				if (index + 1 !== inputArtists.length) {
					return el + ',' + inputArtists[index + 1];
				} else {
					return undefined;
				}
			}).filter(Boolean) as string[];

			mapLimit(firstInputArray, 3, async (item) => {
				return await handleSearchArray(item, removeFromSearch, artists, 0.9);
			}, (err, results: (Artist | undefined)[] | undefined) => {
				if (err) throw err
				removeFromSearch = removeFromSearch.join(',').split(/[,]+/i);
				inputArtists = inputArtists.filter((el) => !removeFromSearch.includes(el));
				removeFromSearch = [];

				// Then go through remaining seperated by: ,
				mapLimit(inputArtists, 3, async (item) => {
					return await handleSearchArray(item, removeFromSearch, artists, 0.9);
				}, (err, results: (Artist | undefined)[] | undefined) => {
					if (err) throw err
					inputArtists = inputArtists.filter((el) => !removeFromSearch.includes(el));
					removeFromSearch = [];

					// Replace any parentheses, then go through remaining seperated by: , & and ft ft. feat feat.
					let inputArtistsString = inputArtists.join(',');
					inputArtistsString = inputArtistsString.replace('(', ',');
					inputArtistsString = inputArtistsString.replace(')', '');
					inputArtists = inputArtistsString.split(/[,&+]|\band\b|\bft\b\.|\bft\b|\bfeat\b\.|\bfeat\b/i);

					mapLimit(inputArtists, 3, async (item) => {
						return await handleSearchArray(item, removeFromSearch, artists, 0.8);
					}, (err, results: (Artist | undefined)[] | undefined) => {
						if (err) throw err
						inputArtists = inputArtists.filter((el) => !removeFromSearch.includes(el));
						for (const noResultArtist of inputArtists) {
							artists.push({
								name: noResultArtist.trim(),
								spotifyId: '',
								picture: undefined,
								popularity: 0,
								genres: []
							} as Artist);
						}
						setLineup({ ...lineup, 'artists': artists })
						setInputFieldReady(3, true);
					});
				});
			});
		}
	}

	return (
		<MuiThemeProvider theme={muiTheme}>
			<CssBaseline />
			<AppBarView />
			<div className={classes.verticalSpace} />
			<form className={classes.root} noValidate autoComplete="off">
				<TextField id="festivalName-input" label="Festival" variant="outlined"
					required onBlur={(evt) => {
						setLineup({ ...lineup, 'festival': evt.target.value });
						setInputFieldReady(0, evt.target.value.length > 0);
					}} />
				<TextField id="festivalCountry-input" label="Country" variant="outlined"
					inputProps={{ maxLength: 2 }} required onBlur={(evt) => {
						setLineup({ ...lineup, 'country': evt.target.value });
						setInputFieldReady(1, evt.target.value.length === 2);
					}} />
				<TextField id="festivalYear-input" label="Year" variant="outlined" type={'number'}
					required onBlur={(evt) => {
						setLineup({ ...lineup, 'year': +evt.target.value });
						setInputFieldReady(2, +evt.target.value > 2016 && +evt.target.value < 2021);
					}} />
				<TextField id="festivalArtists-input" label="Artists" variant="outlined"
					required onChange={fetchArtistsFromSpotifyAndAddToLineup} />
				<Button color={'primary'} variant="contained" disabled={!ready} onClick={() => {
					setReady(false);
					registerLineup(lineup, props.dispatch);
				}}>
					Registrer lineup
				</Button>
			</form>

			<div hidden={!loaderOn} className={classes.progressBar}>
				<CircularProgress size={100} thickness={3} disableShrink color={'secondary'} />
			</div>

		</MuiThemeProvider>
	);
};

const mapStateToProps = (state: AppState) => ({
	model: state.model
});

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatch
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterToDjango);
