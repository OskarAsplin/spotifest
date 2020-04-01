import React, {useState} from 'react';
import {AppState, DispatchProps, FestivalMatch} from "../../redux/types";
import {connect} from "react-redux";
import {createStyles, MuiThemeProvider, Theme} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";
import indigo from "@material-ui/core/colors/indigo";
import {Model} from "../../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';

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

const FestivalMatchView: React.FC<Props> = (props: Props) => {

	// const smallScreen = useMediaQuery('(max-width:610px)');

	const [genreArtistChecked, setGenreArtistChecked] = useState<boolean>(false);

	const thememode = props.model.thememode;

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

	const handleGenreArtistChange = (event: any) => {
		setGenreArtistChecked(event.target.checked);
	};

	const handleGenreArtistChangeOnText = (artistActive: boolean) => {
		setGenreArtistChecked(artistActive);
	};

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	return (
		<Box className={classes.box}>
			<Grid component="label" container alignItems="center" spacing={1}>
				<Grid item xs={1}/>
				<Grid item xs={10}>
					<div className={classes.alignCenter}>
						<MuiThemeProvider theme={lightBluePinkMuiTheme}>
							<Button hidden className={classes.invisibleButton} />
							<Button disableRipple disableElevation className={classes.button}
							color={genreArtistChecked ? 'default' : 'primary'}
							onClick={() => handleGenreArtistChangeOnText(false)}>
								Genre
							</Button>
							<Switch checked={genreArtistChecked} color="default" onChange={handleGenreArtistChange} name="checkedC" />
							<Button disableRipple disableElevation className={classes.button}
							color={genreArtistChecked ? 'primary' : 'default'}
							onClick={() => handleGenreArtistChangeOnText(true)}>
								Artist
							</Button>
						</MuiThemeProvider>
					</div>
				</Grid>
				<Grid item xs={1}>
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
						<InfoIcon color="primary" style={{ fill: thememode === 'light' ? indigo[500] : '#fcfcfe' }}/>
					</HtmlTooltip>
				</Grid>
			</Grid>
			{props.model.festivalMatches
				.sort((a, b) => (genreArtistChecked ? 
					(a.matching_percent_artists < b.matching_percent_artists) : 
					(a.matching_percent_genres < b.matching_percent_genres) ) ? 1 : -1)
				.map((festival: FestivalMatch, idx) => {
					let matching_percent:number = 0;
					let matching_text: string = '';
					if (genreArtistChecked) {
						matching_percent = Math.ceil(festival.matching_percent_artists);
						matching_text = festival.matching_artists.length > 0 ?
						capitalizeFirstLetter(festival.matching_artists.slice(0, 5).join(", "))
						: 'No artists match with this festival';
					} else {
						matching_percent = Math.ceil(festival.matching_percent_genres);
						matching_text = festival.matching_genres.length > 0 ?
						capitalizeFirstLetter(festival.matching_genres.slice(0, 5).join(", "))
						: 'No genres match with this festival';
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
)(FestivalMatchView);
