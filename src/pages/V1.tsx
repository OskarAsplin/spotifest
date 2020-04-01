import React, {useEffect} from 'react';
import {AppState, DispatchProps, Artist} from "../redux/types";
import {testFestivalMatches, setLoggedOff} from "../redux/actions";
import {connect} from "react-redux";
import {createStyles, CssBaseline, MuiThemeProvider, Theme} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import FestivalMatchView from "./parts/FestivalMatchView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import deepOrange from "@material-ui/core/colors/deepOrange";
import indigo from "@material-ui/core/colors/indigo";
import {Model} from "../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
//import Button from '@material-ui/core/Button';
import  { Redirect } from 'react-router-dom';
//import SplashScreen from "../components/splashScreen";

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
			padding: theme.spacing(2, 0, 2, 0),
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

const V1: React.FC<Props> = (props: Props) => {

	useEffect(() => {
		const token = getAccessTokenFromHashParams();
		if (token) {
			spotifyApi.setAccessToken(token);
		    getTopArtistsAndTestMatches();
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
	

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

	const token = getAccessTokenFromHashParams();
	
	const getTopArtistsAndTestMatches = () => {
		if (token) {
			spotifyApi.setAccessToken(token);
		}
		spotifyApi.getMyTopArtists({limit: 50})
		.then((response) => {
			console.log('getTopArtists response: ');
			console.log(response);
			var newTopArtists: Artist[] = [];

			if (Array.isArray(response.items)) {
				response.items.forEach(artist => newTopArtists.push({name: artist.name, spotifyId: artist.id, picture: artist.images[0].url, genres: artist.genres}));
			}
			testFestivalMatches(newTopArtists, props.dispatch);
		})
		.catch((error) => {
			console.log(error);
			props.dispatch(setLoggedOff());
		})
	}

	if (!props.model.loggedIn || !token) {
		return <Redirect to='/login' />
	}
	return (
		//<SplashScreen>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
				<AppBarView />
				<div className={classes.verticalSpace} />
				<div className={classes.root}>
					<FestivalMatchView />
				</div>

				<div hidden={!loaderOn} className={classes.progressBar}>
					<CircularProgress size={100} thickness={3} disableShrink color={'secondary'} />
				</div>

			</MuiThemeProvider>
		//</SplashScreen>
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
)(V1);
