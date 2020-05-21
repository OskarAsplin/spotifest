import React, { useEffect } from 'react';
import { Model, AppState, DispatchProps } from "../redux/types";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Paper, Typography, Button, IconButton, Collapse } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import deepOrange from "@material-ui/core/colors/deepOrange";
import indigo from "@material-ui/core/colors/indigo";
import { setLoggedIn, setLoggedOff } from "../redux/actions";
import 'react-circular-progressbar/dist/styles.css';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
            flexDirection: 'column',
			padding: theme.spacing(0, 4, 0, 4),
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},
        background: {
            height: '100vh',
            backgroundImage: "url(/background_image.jpg)",
            backgroundSize: 'cover',
        },
		progressBar: {
			position: 'fixed',
			top: '50%',
			left: '50%',
			marginTop: '-50px',
			marginLeft: '-50px'
		},
        verticalSpace: {
            display: 'flex',
            padding: theme.spacing(2, 0, 2, 0),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 500px)': {
                padding: theme.spacing(0, 4, 0, 4),
            },
            '@media (max-width: 499px)': {
                padding: theme.spacing(0, 2, 0, 2),
            },
            justifyContent: 'space-between',
        },
        paddingBottom: {
            paddingBottom: theme.spacing(2),
            width: '100%'
        },
        button: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 500px)': {
                padding: theme.spacing(2, 4, 2, 4),
            },
            '@media (max-width: 499px)': {
                padding: theme.spacing(2, 2, 2, 2),
            },
            marginBottom: theme.spacing(2),
            width: '100%',
            alignItems: 'center',
            //borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            boxShadow: '0 0 2rem rgba(0, 0, 1)',
            "&:hover": {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }
        },
        rowFlex: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        box: {
            maxWidth: '1112px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            width: '100%',
            maxWidth: '764px'
        },
        title: {
            textAlign: 'center',
            borderRadius: '15%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0 0 2rem rgba(0, 0, 0, 1)',
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            '@media (min-width: 500px)': {
            	maxWidth: '1112px',
            },
            '@media (max-width: 499px)': {
                maxWidth: '95%',
            },
            margin: theme.spacing(2),
        },
        expand: {
            transform: 'rotate(180deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(0deg)',
        },
	}),
);

interface StoreProps {
	model: Model;
}

type Props = DispatchProps & StoreProps;

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId = '***REMOVED***';
const redirectUri = 'http://localhost:3000';
const scopes = [
	'user-read-private',
	'user-top-read',
	'playlist-read-private',
	'playlist-read-collaborative',
];


const LoginScreen: React.FC<Props> = (props: Props) => {

    const bigScreen = useMediaQuery('(min-width:500px)');

	useEffect(() => {
		props.dispatch(setLoggedOff());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			type: 'dark'
		}
	});

	const classes = useStyles();

    const [expanded, setExpanded] = React.useState(false);

    const authorizeHref = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token`;

	return (
		//<SplashScreen>
		<div className={classes.background}>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
                {/*<AppBarView birghtnessSwitchEnabled={false} accountCircleEnabled={false} />*/}
	            <div className={classes.verticalSpace} />
                <div className={classes.verticalSpace} />

	            <div className={classes.root}>
	                <Box className={classes.box}>
                        <Typography variant={bigScreen ? "h2" : "h4"} className={classes.title}>
                            Oskarito Festival Matcher
                        </Typography>
					</Box>
	                <div className={classes.verticalSpace} />
	                <div className={classes.verticalSpace} />
                    <div className={classes.verticalSpace} />
	                <Box className={classes.box2}>
	                    <Button className={classes.button} key={'Login to spotify button'}
	                        variant="outlined"
	                        onClick={() => {
	                            props.dispatch(setLoggedIn());
                                window.open(authorizeHref, '_self');
	                        }}>
                            <Typography variant={bigScreen ? "h4" : "h6"}>
	                            Log in with Spotify to see your festival matches
	                        </Typography>
	                    </Button>
	                </Box>
	                <Box className={classes.footer}>
		                <Paper className={classes.paper} key={'disclaimer paper'}>
		                	<div className={classes.rowFlex}>
                                <Typography variant={"subtitle2"} onClick={() => setExpanded(!expanded)}>
	                                Disclaimer
		                        </Typography>
	                            <IconButton
	                                className={clsx(classes.expand, {
	                                    [classes.expandOpen]: expanded,
	                                })}
	                                onClick={() => setExpanded(!expanded)}
	                                aria-expanded={expanded}
	                                aria-label="show more"
	                            >
	                                <ExpandMoreIcon />
	                            </IconButton>
                            </div>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                            	<div className={classes.paddingBottom}>
				                	This website was made with the intention of inspiring people to attend festivals to their liking.
				                	It was made by a simple minded Norwegian guy wanting to do some good in the world.
				                	This Norwegian guy takes no responsibility for any inaccuracies in the information on the site, as this is purely a hobby project at this point.
			                        Special thanks to Spotify and MusicFestivalWizard for their available information about artists and festivals, making this site possible to make.
			                    </div>
	                        </Collapse>
		                </Paper>
	                </Box>
				</div>

				<div hidden={!loaderOn} className={classes.progressBar}>
					<CircularProgress size={100} thickness={3} disableShrink color={'secondary'} />
				</div>

			</MuiThemeProvider>
		</div>
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
)(LoginScreen);
