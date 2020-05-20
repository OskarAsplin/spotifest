import React, { useEffect } from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, Theme } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { Model } from "../../redux/types";
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import FestivalMatchItem from './FestivalMatchItem';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box: {
            '@media (min-width: 500px)': {
                width: '95%',
            },
            '@media (max-width: 499px)': {
                width: '100%',
            },
			maxWidth: '764px',
			marginTop: theme.spacing(1)
		},
		align: {
			display: 'flex',
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: theme.spacing(1)
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

	const [page, setPage] = React.useState(1);
	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};
	const itemsPerPage = 15
	const numPages = Math.ceil(festivalMatches.length / itemsPerPage)

	const showMatches = festivalMatches.sort((a, b) => (matchingMethod === MatchingMethod.Genre ?
		(a.matching_percent_combined < b.matching_percent_combined) :
		(a.matching_percent_artists < b.matching_percent_artists)) ? 1 : -1)
		.slice((page - 1) * itemsPerPage, Math.min(page * itemsPerPage, festivalMatches.length));

	useEffect(() => {
		setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
	}, [showMatches])

	return (
		<Box className={classes.box}>
			{showMatches.length > 0 &&
				<Box className={classes.align}>
					<Pagination count={numPages} page={page} onChange={handleChange} />
				</Box>}
			{showMatches.map((festival: FestivalMatch, idx) =>
					<FestivalMatchItem festival={festival} key={'FestivalMatchItem: ' + festival.name + festival.year} showMatching={true}/>
				)}
			{showMatches.length > 0 &&
				<Box className={classes.align}>
					<Pagination count={numPages} page={page} onChange={handleChange} />
				</Box>}
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
