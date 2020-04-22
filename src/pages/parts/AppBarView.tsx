import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton, Typography, Toolbar, AppBar } from '@material-ui/core';
import { Brightness2, Brightness4 } from "@material-ui/icons";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Model, AppState, DispatchProps } from "../../redux/types";
import { connect } from "react-redux";
import { switchToDarkMode, switchToLightMode } from "../../redux/actions";

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
            borderRadius: 13,
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

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.customizeToolbar}>
                    <Typography variant="h6" className={classes.title}>
                        OnTour
                    </Typography>
                    {props.model.userInfo?.displayName ?
                        <Typography variant="body1">
                            {props.model.userInfo.displayName}
                        </Typography>
                        : <div />
                    }
                    <IconButton
                        color="inherit"
                        target={props.model.userInfo?.spotifyUrl ? "_blank" : undefined}
                        href={props.model.userInfo?.spotifyUrl ? props.model.userInfo.spotifyUrl : ""}
                    >
                        {props.model.userInfo?.profilePictureUrl ?
                            <img src={props.model.userInfo.profilePictureUrl} alt="" className={classes.profileImg} />
                            : <AccountCircleIcon />}
                    </IconButton>
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
