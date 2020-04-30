import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, Theme } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Model } from "../../redux/types";
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import FestivalMatchItem from './FestivalMatchItem';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box: {
			width: '80%',
			maxWidth: '764px'
		},
	}),
);

interface StoreProps {
	model: Model;
	festivalMatches: FestivalMatch[],
	matchingMethod: MatchingMethod
}

type Props = DispatchProps & StoreProps;

const FestivalMatchView: React.FC<Props> = (props: Props) => {

	const { festivalMatches, matchingMethod } = props;
	const classes = useStyles();

	return (
		<Box className={classes.box}>
			{festivalMatches.sort((a, b) => (matchingMethod === MatchingMethod.Genre ?
				(a.matching_percent_genres < b.matching_percent_genres) :
				(a.matching_percent_artists < b.matching_percent_artists)) ? 1 : -1)
				.map((festival: FestivalMatch, idx) => {
					return (
						<FestivalMatchItem festival={festival} />
					)
				})}
		</Box>
	);
};

const mapStateToProps = (state: AppState) => ({
	model: state.model,
	festivalMatches: state.model.festivalMatches,
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
)(FestivalMatchView);
