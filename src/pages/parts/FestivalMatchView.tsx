import React, {useState} from 'react';
import {AppState, DispatchProps, FestivalMatch} from "../../redux/types";
import {connect} from "react-redux";
import {createStyles, MuiThemeProvider, Theme} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";
import {Model} from "../../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

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
		}
	}),
);

interface StoreProps {
	model: Model;
}

type Props = DispatchProps & StoreProps;

const FestivalMatchView: React.FC<Props> = (props: Props) => {

	// const smallScreen = useMediaQuery('(max-width:610px)');

	const [genreArtistChecked, setGenreArtistChecked] = useState<boolean>(false);

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

	const classes = useStyles();

	const handleGenreArtistChange = (event: any) => {
		setGenreArtistChecked(event.target.checked);
	};

	return (
		<Box className={classes.box}>
			<Box className={classes.alignCenter}>
				Genre
				<Switch checked={genreArtistChecked} color="default" onChange={handleGenreArtistChange} name="checkedC" />
				Artist
			</Box>
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
						'Matching artists: ' + festival.matching_artists.slice(0, 5).join(", ")
						: 'No artists match with this festival';
					} else {
						matching_percent = Math.ceil(festival.matching_percent_genres);
						matching_text = festival.matching_genres.length > 0 ?
						'Matching genres: ' + festival.matching_genres.slice(0, 5).join(", ")
						: 'No genres match with this festival';
					}
					const pathColor = props.model.thememode === 'light' ? '#3FBF3F' : '#3de53d';
					const textColor = props.model.thememode === 'light' ? '#3FBF3F' : '#3de53d';
					const trailColor = props.model.thememode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';
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
