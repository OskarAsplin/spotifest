import React from 'react';
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

	return (
		<Box className={classes.box}>
			{props.model.festivalMatches
				.sort((a, b) => (a.matching_percent_genres < b.matching_percent_genres) ? 1 : -1)
				.map((festival: FestivalMatch, idx) => {
					const matching_percent_genres = Math.ceil(festival.matching_percent_genres);
					return (
						<div className={classes.root} key={festival.name}>
							<MuiThemeProvider theme={lightBluePinkMuiTheme}>
								<div>
									<Typography variant="h6">
				                        {festival.name}
				                    </Typography>
				                    {festival.matching_genres.length > 0 ? 
				                    	<Typography className={classes.text} variant="body1" color='primary' >
					                        Matching genres: {festival.matching_genres.slice(0, 5).join(", ")}
					                    </Typography>
					                    : <Typography className={classes.text} variant="body1" color='primary' >
					                        No genres match with this festival
					                    </Typography>
				                    }
								</div>
							</MuiThemeProvider>
							<MuiThemeProvider theme={lightBluePinkMuiTheme}>
								<div>
				                    <div className={classes.circleSize}>
				                    { props.model.thememode === 'light' ? 
				                    <CircularProgressbar value={matching_percent_genres} text={`${matching_percent_genres}%`}
					                    styles={buildStyles({								    
										    textSize: '22px',
										 
										    // How long animation takes to go from one percentage to another, in seconds
										    pathTransitionDuration: 0.5,
										 
										    // Colors
										    pathColor: '#3FBF3F',
										    textColor: '#3FBF3F',
										    trailColor: '#d6d6d6',
										    //backgroundColor: '#3e98c7',
										  })}
										/> : 
									<CircularProgressbar value={matching_percent_genres} text={`${matching_percent_genres}%`}
					                    styles={buildStyles({								    
										    textSize: '22px',
										 
										    // How long animation takes to go from one percentage to another, in seconds
										    pathTransitionDuration: 0.5,
										 
										    // Colors
										    pathColor: '#3de53d', //'#3FBF3F',
										    textColor: '#3de53d', //'#3FBF3F',
										    trailColor: 'rgba(104, 104, 104)', //'#a6a6a6',
										    //backgroundColor: '#3e98c7',
										  })}
										/>}
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
