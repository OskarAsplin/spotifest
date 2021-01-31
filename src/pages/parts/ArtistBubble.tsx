import { createStyles, Theme, Avatar, IconButton, Typography, PaletteType } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { makeStyles } from '@material-ui/core/styles';
import MusicNote from '@material-ui/icons/MusicNote';
import clsx from 'clsx';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Artist } from "../../redux/types";

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
        clickable: {
            boxShadow: theme.shadows[3],
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
        },
        circleIconDark: {
            background: blueGrey[700],
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        circleShadow: {
            width: '150px',
            height: '150px',
            border: 'solid 1px #555',
            backgroundColor: '#eed',
            boxShadow: '10px - 10px  rgba(0, 0, 0, 0.6)',
            borderRadius: '100px'
        }
    }),
);

interface OwnProps {
    artist: Artist,
    useSpotifyId?: boolean,
    key: string,
    thememode: PaletteType,
}

type Props = OwnProps;

const ArtistBubble: React.FC<Props> = (props: Props) => {

    const { artist, useSpotifyId, key, thememode } = props;
    const [redirectArtist, setRedirectArtist] = React.useState('');

    const classes = useStyles();

    if (redirectArtist) {
        return <Redirect push to={'/artist/' + (useSpotifyId ? 'spotifyId=':'') + redirectArtist} />
    }

    return (
        <div className={classes.artistAvatarBox} key={'div_' + key} >
            <IconButton
                color="inherit"
                onClick={() => { if (artist.hasSpotifyId) setRedirectArtist(encodeURIComponent(useSpotifyId ? artist.spotifyId! : artist.name)) }}
                className={classes.artistAvatar}
                disabled={!artist.hasSpotifyId}
            >
                {artist.iconPicture ?
                    <Avatar src={artist.iconPicture} alt={artist.name} className={clsx(classes.artistAvatarImg, artist.hasSpotifyId ? classes.clickable : undefined)}
                        key={key} />
                    : <div className={clsx(classes.artistAvatarImg,
                        thememode === 'light' ? classes.circleIconLight : classes.circleIconDark,
                        artist.hasSpotifyId ? classes.clickable : undefined)}>
                        <MusicNote fontSize={'large'} />
                    </div>}
            </IconButton>
            <Typography variant="caption" >
                {artist.name}
            </Typography>
        </div>
    );
};

export default ArtistBubble;
