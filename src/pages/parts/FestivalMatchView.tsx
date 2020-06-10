import React, { useEffect } from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, Theme, Typography } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { Model } from "../../redux/types";
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import FestivalMatchItem from './FestivalMatchItem';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box: {
			'@media (min-width: 610px)': {
				width: '95%',
			},
			'@media (max-width: 609px)': {
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
		},
		alignItems: {
			display: 'flex',
			'@media (min-width: 610px)': {
				height: theme.spacing(7),
			},
			'@media (max-width: 609px)': {
				flexDirection: 'column',
				marginBottom: theme.spacing(1)
			},
			width: '100%',
			alignItems: 'center',
		},
		verticalSpace: {
			display: 'flex',
			padding: theme.spacing(2, 0, 2, 0),
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%'
		},
		verticalSpace2: {
			display: 'flex',
			padding: theme.spacing(2, 0, 0, 0),
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%'
		},
		noMatches: {
			width: '100%',
			textAlign: 'center'
		},
		matchLength: {
			'@media (min-width: 610px)': {
				position: 'absolute',
				textAlign: 'center',
			},
			'@media (max-width: 609px)': {
				marginBottom: theme.spacing(1)
			},
		}
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

	const mediumOrBigScreen = useMediaQuery('(min-width:400px)');

	const [page, setPage] = React.useState(1);
	const [siteInitialized, setSiteInitialized] = React.useState(false);
	const [isAnyMatch, setIsAnyMatch] = React.useState(true);

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		if (page !== value) {
			setPage(value);
			setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
		}
	};
	const itemsPerPage = 15
	const numPages = Math.ceil(festivalMatches.length / itemsPerPage)

	const showMatches = festivalMatches.sort((a, b) => (matchingMethod === MatchingMethod.Genre ?
		(a.matching_percent_combined < b.matching_percent_combined) :
		(a.matching_percent_artists < b.matching_percent_artists)) ? 1 : -1)
		.slice((page - 1) * itemsPerPage, Math.min(page * itemsPerPage, festivalMatches.length));

	useEffect(() => {
		if (showMatches.length === 0) {
			setIsAnyMatch(false);
		} else {
			setIsAnyMatch(true);
			setSiteInitialized(true);
		}
	}, [showMatches])

	useEffect(() => {
		setPage(1);
	}, [props.model.matchSettings])

	return (
		<Box className={classes.box}>
			{showMatches.length > 0 &&
				<Box className={classes.alignItems}>
					<Typography variant="subtitle2" className={classes.matchLength}>
						{festivalMatches.length + ' matches'}
					</Typography>
					<Box className={classes.align}>
						<Pagination count={numPages} page={page} size={mediumOrBigScreen ? 'medium' : 'small'} onChange={handleChange} />
					</Box>
				</Box>}
			{showMatches.map((festival: FestivalMatch, idx) =>
				<FestivalMatchItem festival={festival} key={'FestivalMatchItem: ' + festival.name + festival.year} showMatching={true} />
			)}
			{showMatches.length > 0 &&
				<div>
					<Box className={classes.align}>
						<Pagination count={numPages} page={page} size={mediumOrBigScreen ? 'medium' : 'small'} onChange={handleChange} />
					</Box>
					<div className={classes.verticalSpace2} />
				</div>}
			{siteInitialized && !isAnyMatch &&
				<div>
					<div className={classes.verticalSpace} />
					<Typography variant="subtitle1" className={classes.noMatches}>
						No matches with these settings.
		            </Typography>
				</div>
			}
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
