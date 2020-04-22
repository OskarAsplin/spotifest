import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, MuiThemeProvider, Theme } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";
import { Model } from "../../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import { PaletteType } from "@material-ui/core";

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
			marginBottom: theme.spacing(2)
		},
		circleSize: {
			width: '60px'
		},
		text: {
			paddingRight: '40px'
		},
		box: {
			width: '80%',
			maxWidth: '700px'
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
		}
	}),
);

interface StoreProps {
	model: Model;
	thememode: PaletteType,
	festivalMatches: FestivalMatch[],
	matchingMethod: MatchingMethod
}

type Props = DispatchProps & StoreProps;

const FestivalMatchView: React.FC<Props> = (props: Props) => {

	// const smallScreen = useMediaQuery('(max-width:610px)');

	const { festivalMatches, thememode, matchingMethod } = props;

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

	const classes = useStyles();

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	return (
		<Box className={classes.box}>
			{festivalMatches.sort((a, b) => (matchingMethod === MatchingMethod.Genre ?
				(a.matching_percent_genres < b.matching_percent_genres) :
				(a.matching_percent_artists < b.matching_percent_artists)) ? 1 : -1)
				.map((festival: FestivalMatch, idx) => {
					let matching_percent: number = 0;
					let matching_text: string = '';
					switch (matchingMethod) {
						case MatchingMethod.Genre:
							matching_percent = Math.ceil(festival.matching_percent_genres);
							matching_text = festival.matching_genres.length > 0 ?
								capitalizeFirstLetter(festival.matching_genres.slice(0, 5).join(", "))
								: 'No genres match with this festival';
							break;
						case MatchingMethod.Artist:
							matching_percent = Math.ceil(festival.matching_percent_artists);
							matching_text = festival.matching_artists.length > 0 ?
								capitalizeFirstLetter(festival.matching_artists.slice(0, 5).join(", "))
								+ (festival.matching_artists.length > 5 ? ', ...' : '')
								: 'No artists match with this festival';
							break;
						default:
							break;
					}
					const pathColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
					const textColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
					const trailColor = thememode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';
					return (
						<div className={classes.root} key={festival.name}>
							<MuiThemeProvider theme={lightBluePinkMuiTheme}>
								<div>
									<Typography variant="h6">
										{festival.name}
									</Typography>
									<Typography className={classes.text} variant="body1" color='primary' >
										{matching_text}
									</Typography>
								</div>
							</MuiThemeProvider>
							<MuiThemeProvider theme={lightBluePinkMuiTheme}>
								<div>
									<div className={classes.circleSize}>
										<CircularProgressbar value={matching_percent} text={`${matching_percent}%`}
											styles={buildStyles({
												textSize: '22px',
												pathTransitionDuration: 0.5,
												pathColor: pathColor,
												textColor: textColor,
												trailColor: trailColor,
												//backgroundColor: '#3e98c7',
											})}
										/>
									</div>

								</div>
							</MuiThemeProvider>
						</div>
					)
				})}
		</Box>
	);
};

const mapStateToProps = (state: AppState) => ({
	model: state.model,
	thememode: state.model.thememode,
	festivalMatches: state.model.festivalMatches,
	matchingMethod: state.model.matchingMethod
});

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatch
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FestivalMatchView);
