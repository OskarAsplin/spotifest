import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton, Typography, Toolbar, AppBar, Avatar, Popover, Link } from '@material-ui/core';
import { Brightness2, Brightness4 } from "@material-ui/icons";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Model, AppState, DispatchProps } from "../../redux/types";
import { connect } from "react-redux";
import { switchToDarkMode, switchToLightMode, setLoggedOff } from "../../redux/actions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
        customizeToolbar: {
            minHeight: 36
        },
        profileImg: {
            height: 26,
            width: 26,
            //borderRadius: 13,
        },
        popover: {
            padding: theme.spacing(1.5),
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'center',
        },
        bottomMargin: {
            marginBottom: theme.spacing(1),
        },
    }),
);

interface OwnProps {

}

interface StoreProps {
    model: Model
}

type Props = OwnProps & StoreProps & DispatchProps;

const AppBarView: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const { dispatch } = props;
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.customizeToolbar}>
                    <Typography variant="h6" className={classes.title}>
                        Oskarito Festival Matcher
                    </Typography>
                    {props.model.userInfo?.displayName ?
                        <Typography variant="body1">
                            {props.model.userInfo.displayName}
                        </Typography>
                        : <div />
                    }
                    <IconButton
                        color="inherit"
                        aria-describedby={id}
                        onClick={handleClick}
                    >
                        {props.model.userInfo?.profilePictureUrl ?
                            <Avatar src={props.model.userInfo.profilePictureUrl} alt="" className={classes.profileImg} />
                            : <AccountCircleIcon />}
                    </IconButton>
                    <Popover
                        id={id}
                        hidden={!props.model.loggedIn}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div className={classes.popover}>
                            {props.model.userInfo?.spotifyUrl &&
                                <Link color={'secondary'}
                                    href={props.model.userInfo.spotifyUrl}
                                    target={"_blank"}
                                    rel="noopener noreferrer"
                                    className={classes.bottomMargin}>
                                    View profile in Spotify
                                </Link>}
                            <Link color={'secondary'}
                                href={`https://accounts.spotify.com/en/logout`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => dispatch(setLoggedOff())}>
                                Log out
                            </Link>
                        </div>
                    </Popover>
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            props.model.thememode === 'light'
                                ? dispatch(switchToDarkMode())
                                : dispatch(switchToLightMode());
                        }}
                    >
                        {props.model.thememode === 'light' ? <Brightness2 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    model: state.model,
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppBarView);
