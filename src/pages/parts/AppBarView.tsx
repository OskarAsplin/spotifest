import React from 'react';
import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import { IconButton, Typography, Toolbar, AppBar, Avatar, Popover, Link, MuiThemeProvider, Button } from '@material-ui/core';
import { Brightness2, Brightness4 } from "@material-ui/icons";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Model, AppState, DispatchProps } from "../../redux/types";
import { connect } from "react-redux";
import { switchToDarkMode, switchToLightMode, setLoggedOff } from "../../redux/actions";
import { lightBlue, indigo } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

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
        button: {
            //flexGrow: 1,
            textTransform: 'none',
            //marginLeft: -theme.spacing(1.3),
            //paddingBottom: theme.spacing(0),
            //paddingTop: theme.spacing(0),
            //textAlign: 'left',
            //maxWidth: '85%'
        },
    }),
);

interface OwnProps {
    birghtnessSwitchEnabled: boolean,
    accountCircleEnabled: boolean
}

interface StoreProps {
    model: Model
}

type Props = OwnProps & StoreProps & DispatchProps;

const AppBarView: React.FC<Props> = (props: Props) => {
    const bigScreen = useMediaQuery('(min-width:650px)');

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

    const lightBluePinkMuiTheme = createMuiTheme({
        typography: {
            fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
        },
        palette: {
            primary: {
                light: lightBlue[300],
                main: lightBlue[500],
                dark: lightBlue[700]
            },
            secondary: {
                light: indigo[700],
                main: indigo[800],
                dark: indigo[900]
            },
            type: props.model.thememode
        }
    });

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                <AppBar position="static" id="oskarito-appbar" color="secondary">
                    <Toolbar className={classes.customizeToolbar}>
                        <div className={classes.title}>
                            <Button
                                className={classes.button}
                                color="inherit"
                                onClick={() => { window.open('http://localhost:3000/ontour', '_self') }}
                            >
                                <Typography variant="h6">
                                    Oskarito Festival Matcher
                            </Typography>
                            </Button>
                        </div>
                        {props.model.userInfo?.displayName && bigScreen &&
                            <Typography variant="body1">
                                {props.model.userInfo.displayName}
                            </Typography>
                        }
                        {props.accountCircleEnabled &&
                            <IconButton
                                color="inherit"
                                aria-describedby={id}
                                onClick={handleClick}
                            >
                                {props.model.userInfo?.profilePictureUrl ?
                                    <Avatar src={props.model.userInfo.profilePictureUrl} alt="" className={classes.profileImg} />
                                    : <AccountCircleIcon />}
                            </IconButton>}
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
                                    <Link color={'primary'}
                                        href={props.model.userInfo.spotifyUrl}
                                        target={"_blank"}
                                        rel="noopener noreferrer"
                                        className={classes.bottomMargin}>
                                        View profile in Spotify
                                    </Link>}
                                <Link color={'primary'}
                                    href={`https://accounts.spotify.com/en/logout`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => dispatch(setLoggedOff())}>
                                    Log out
                                </Link>
                            </div>
                        </Popover>
                        {props.birghtnessSwitchEnabled &&
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    props.model.thememode === 'light'
                                        ? dispatch(switchToDarkMode())
                                        : dispatch(switchToLightMode());
                                }}
                            >
                                {props.model.thememode === 'light' ? <Brightness2 /> : <Brightness4 />}
                            </IconButton>}
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
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
