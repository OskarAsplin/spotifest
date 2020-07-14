import React from 'react';
import { DispatchProps, Artist } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, Theme, Avatar, IconButton, Typography, PaletteType } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from "@material-ui/core/colors";
import MusicNote from '@material-ui/icons/MusicNote';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            '@media (min-width: 690px)': {
                width: '100px',
            },
            '@media (max-width: 689px)': {
                width: '75px',
                marginBottom: '6px'
            },
        },
        artistAvatarImg: {
            '@media (min-width: 690px)': {
                height: 80,
                width: 80,
            },
            '@media (max-width: 689px)': {
                height: 60,
                width: 60,
            },
        },
        artistAvatar: {
            '@media (max-width: 689px)': {
                padding: '6px',
            },
        },
        circleIconLight: {
            background: blueGrey[300],
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '@media (min-width: 690px)': {
                height: 80,
                width: 80,
            },
            '@media (max-width: 689px)': {
                height: 60,
                width: 60,
            },
        },
        circleIconDark: {
            background: blueGrey[700],
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '@media (min-width: 690px)': {
                height: 80,
                width: 80,
            },
            '@media (max-width: 689px)': {
                height: 60,
                width: 60,
            },
        },
    }),
);

interface OwnProps {
    artist: Artist,
    useSpotifyId?: boolean,
    key: string,
    thememode: PaletteType,
}

type Props = DispatchProps & OwnProps;

const ArtistBubble: React.FC<Props> = (props: Props) => {

    const { artist, useSpotifyId, key, thememode } = props;
    const [redirectArtist, setRedirectArtist] = React.useState('');

    const classes = useStyles();

    if (redirectArtist) {
        return <Redirect push to={'/artist?' + (useSpotifyId ? 'spotifyId=':'') + redirectArtist} />
    }

    return (
        <div className={classes.artistAvatarBox} key={'div_' + key} >
            <IconButton
                color="inherit"
                onClick={() => { if (artist.hasSpotifyId) setRedirectArtist(encodeURIComponent(useSpotifyId ? artist.spotifyId! : artist.name)) }}
                className={classes.artistAvatar}
            >
                {artist.iconPicture ?
                    <Avatar src={artist.iconPicture} alt={artist.name} className={classes.artistAvatarImg}
                        key={key} />
                    : <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                        <MusicNote fontSize={'large'} />
                    </div>}
            </IconButton>
            <Typography variant="caption" >
                {artist.name}
            </Typography>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapDispatchToProps
)(ArtistBubble);
