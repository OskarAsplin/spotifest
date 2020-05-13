import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, MuiThemeProvider, Theme, Avatar, Paper, IconButton, Button, Collapse, Typography, Box, PaletteType } from "@material-ui/core";
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, pink, blueGrey } from "@material-ui/core/colors";
import { Model } from "../../redux/types";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MusicNote from '@material-ui/icons/MusicNote';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            padding: theme.spacing(2, 4, 2, 4),
            marginBottom: theme.spacing(2),
            width: '100%',
        },
        root2: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            width: '100%',
        },
        circleSize: {
            width: '80px'
        },
        festivalTitle: {
            flexGrow: 1,
        },
        box: {
            width: '80%',
            maxWidth: '764px'
        },
        artistAvatar: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100px',
            textAlign: 'center'
        },
        artistAvatarImg: {
            height: 80,
            width: 80,
        },
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        titleAndMatchBox: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            minHeight: '48px'
        },
        matchingPopularBox: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            minHeight: '48px'
        },
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        titleLine: {
            width: '100%',
        },
        circleIconLight: {
            background: blueGrey[300],
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        circleIconDark: {
            background: blueGrey[700],
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        button: {
            flexGrow: 1,
            textTransform: 'none',
            marginLeft: -theme.spacing(1.3),
            paddingBottom: theme.spacing(0),
            paddingTop: theme.spacing(0),
            textAlign: 'left',
            maxWidth: '85%'
        },
        grow: {
            flexGrow: 1,
        },
        lineupBox: {
            display: 'flex',
            alignItems: 'center',
            marginTop: theme.spacing(1)
        },
        lineup: {
            maxHeight: 230,
            maxWidth: 200,
        },
        flexRow: {
            display: 'flex',
            flexDirection: 'row',
        },
    }),
);

interface OwnProps {
    festival: FestivalMatch,
}

interface StoreProps {
    model: Model;
    thememode: PaletteType,
    matchingMethod: MatchingMethod
}

type Props = DispatchProps & StoreProps & OwnProps;

const FestivalMatchItem: React.FC<Props> = (props: Props) => {

    const { festival, thememode, matchingMethod } = props;
    const [expanded, setExpanded] = React.useState(false);
    const [redirectArtist, setRedirectArtist] = React.useState('');
    const [redirectFestival, setRedirectFestival] = React.useState('');

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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

    let matching_percent: number = 0;
    switch (matchingMethod) {
        case MatchingMethod.Genre:
            matching_percent = Math.ceil(festival.matching_percent_combined);
            break;
        case MatchingMethod.Artist:
            matching_percent = Math.ceil(festival.matching_percent_artists);
            break;
        default:
            break;
    }
    const pathColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
    const textColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
    const trailColor = thememode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

    if (redirectArtist) {
        return <Redirect to={'/artist?' + redirectArtist} />
    }

    if (redirectFestival) {
        return <Redirect to={'/festival?' + redirectFestival} />
    }

    return (
        <Paper elevation={3} className={classes.root} key={festival.name}>
            <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                <div className={classes.titleLine}>
                    <div className={classes.titleAndMatchBox}>
                        <div className={classes.grow}>
                            <Button
                                className={classes.button}
                                color="inherit"
                                onClick={() => { setRedirectFestival(festival.name) }}
                            >
                                <Typography variant="h2">
                                    {festival.name}
                                </Typography>
                            </Button>
                        </div>
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
                                {/*<CircularProgressbarWithChildren value={matchingMethod === MatchingMethod.Genre ? matching_percent : Math.min(festival.matching_artists.length*10, 100)}
                                    styles={buildStyles({
                                        //textSize: '22px',
                                        pathTransitionDuration: 0.5,
                                        pathColor: pathColor,
                                        textColor: textColor,
                                        trailColor: trailColor,
                                    })}
                                >
                                    <div className={classes.artistAvatarBox}>
                                        <div style={{ fontSize: '18px', marginTop: -2, marginLeft: 3, color: textColor }}>
                                            {matchingMethod === MatchingMethod.Genre ? matching_percent + '%' : festival.matching_artists.length}
                                        </div>
                                        {matchingMethod === MatchingMethod.Artist && <MusicNote style={{ marginTop: 0, color: textColor }} fontSize={'small'} />}
                                    </div>
                                </CircularProgressbarWithChildren>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.root2}>
                    <div id={'details_and_matching_artists_and_lineup'} className={classes.flexRow}>
                        <div id={'details_and_matching_artists'} className={classes.grow}>
                            {festival.cancelled ?
                                <Typography variant="subtitle1" color='secondary'>
                                    {'CANCELLED' + (festival.date ? ' (' + festival.date + ', ' + festival.year + ')' : '')}
                                </Typography> :
                                <Typography variant="subtitle1">
                                    {festival.date + ', ' + festival.year}
                                </Typography>}
                            <Typography variant="subtitle1">
                                {festival.locationText}
                            </Typography>
                            <Typography variant="subtitle1">
                                {'Genres: ' + festival.matching_genres.slice(0, 3).join(", ")}
                            </Typography>
                            <div className={classes.matchingPopularBox}>
                                <Typography variant="body1" color='primary' component="div" >
                                    <Box fontWeight="fontWeightBold">
                                        {festival.matching_artists.length > 0 ? 'Matching artists' : 'No matching artists'}
                                    </Box>
                                </Typography>
                            </div>
                            <div className={classes.artistAvatarBox}>
                                {festival.matching_artists.length > 0 &&
                                    festival.matching_artists.map((artist) => (
                                        <div className={classes.artistAvatar} key={'div_avatar_artist_match_' + festival.name + artist.name} >
                                            <IconButton
                                                color="inherit"
                                                onClick={() => { if (artist.spotifyId) setRedirectArtist(artist.spotifyId) }}
                                            >
                                                {artist.picture ?
                                                    <Avatar src={artist.picture} alt={artist.name} className={classes.artistAvatarImg}
                                                        key={'avatar_pop_artist_' + festival.name + artist.name} />
                                                    : <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                                                        <MusicNote fontSize={'large'} />
                                                    </div>}
                                            </IconButton>
                                            <Typography variant="caption" >
                                                {artist.name}
                                            </Typography>
                                        </div>)
                                    )}
                            </div>
                        </div>
                        {festival.lineupImg && <div className={classes.lineupBox}>
                            <Button onClick={() => window.open(festival.lineupImg, '_blank')}>
                                <img className={classes.lineup} src={festival.lineupImg} alt="" />
                            </Button>
                        </div>}
                        {!festival.lineupImg && festival.festivalImg && <div className={classes.lineupBox}>
                            <Button onClick={() => window.open(festival.festivalImg, '_blank')}>
                                <img className={classes.lineup} src={festival.festivalImg} alt="" />
                            </Button>
                        </div>}
                    </div>
                    <div className={classes.matchingPopularBox}>
                        <Typography variant="body1" color='primary' component="div" >
                            <Box fontWeight="fontWeightBold">
                                Popular artists at this festival
                            </Box>
                        </Typography>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <div className={classes.artistAvatarBox}>
                            {festival.popular_artists.length > 0 &&
                                festival.popular_artists.map((artist) => (
                                    <div className={classes.artistAvatar} key={'div_avatar_pop_artist_' + festival.name + artist.name} >
                                        <IconButton
                                            color="inherit"
                                            onClick={() => { if (artist.spotifyId) setRedirectArtist(artist.spotifyId) }}
                                        >
                                            {artist.picture ?
                                                <Avatar src={artist.picture} alt={artist.name} className={classes.artistAvatarImg}
                                                    key={'avatar_pop_artist_' + festival.name + artist.name} />
                                                : <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                                                    <MusicNote fontSize={'large'} />
                                                </div>}
                                        </IconButton>
                                        <Typography variant="caption" >
                                            {artist.name}
                                        </Typography>
                                    </div>)
                                )}
                        </div>
                    </Collapse>
                </div>
            </MuiThemeProvider>
        </Paper>
    );
};

const mapStateToProps = (state: AppState) => ({
    model: state.model,
    thememode: state.model.thememode,
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
)(FestivalMatchItem);
