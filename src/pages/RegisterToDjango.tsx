import React, {useEffect, useState} from 'react';
import {AppState, DispatchProps, Artist, Lineup} from "../redux/types";
import {registerLineup} from "../redux/actions";
import {connect} from "react-redux";
import {createStyles, CssBaseline, MuiThemeProvider, Theme} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import deepOrange from "@material-ui/core/colors/deepOrange";
import indigo from "@material-ui/core/colors/indigo";
import {Model} from "../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

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

const RegisterToDjango: React.FC<Props> = (props: Props) => {

	useEffect(() => {
		const token = getAccessTokenFromHashParams();
		if (token) {
			spotifyApi.setAccessToken(token);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [lineup, setLineup] = useState<Lineup>(initialLineup);
	const [ready, setReady] = useState<boolean>(false);
	

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

	const getAccessTokenFromHashParams = () => {
		var e, r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
		e = r.exec(q);
		while (e) {
			if (e[1] === 'access_token') {
				return decodeURIComponent(e[2]);
			}
		}
		return '';
	};

	return (
		<MuiThemeProvider theme={muiTheme}>
			<CssBaseline />
			<AppBarView />
			<div className={classes.verticalSpace} />
			<form className={classes.root} noValidate autoComplete="off">
				<TextField id="festivalName-input" label="Festival" variant="outlined" onBlur={(evt) => {
					setLineup({...lineup, 'festival': evt.target.value})
				}} />
				<TextField id="festivalCountry-input" label="Country" variant="outlined" onBlur={(evt) => {
					setLineup({...lineup, 'country': evt.target.value})
				}} />
				<TextField id="festivalYear-input" label="Year" variant="outlined" type={'number'} 
				onBlur={(evt) => {
					setLineup({...lineup, 'year': +evt.target.value})
				}} />
				<TextField id="festivalArtists-input" label="Artists" variant="outlined" onChange={(evt) => {
					if (evt.target.value.length > 0){
						var artists: Artist[] = [];
						Promise.all(evt.target.value.split(/[,&]+|\band\b/i).map((item) => {
							var artistName = item.trim();
							return spotifyApi.searchArtists(artistName, {limit: 50})
							.then((response) => {
								var searchResults: Artist[] = [];

								if (Array.isArray(response.artists.items)) {
									response.artists.items.forEach(artist => {
										// TODO: check that the artist name matches. Example: Lil Way, first result is Lil Wayne
										searchResults.push({name: artist.name, spotifyId: artist.id, picture: artist.images.length > 0 ? artist.images[0].url : '', genres: artist.genres});
									});
								}
								if (searchResults.length > 0) {
									return artists.push(searchResults[0]);
								} else {
									// TODO: Log these to file
									console.log('No search results for : ' + artistName);
									return artists.push({name: artistName, spotifyId: '', picture: '', genres: []});
								}
							});
						})).then(() => {
							setLineup({...lineup, 'artists': artists})
							setReady(true);
						});
					}
				}} />
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
