import { createStyles, Theme, Typography, Box } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Pagination from '@material-ui/lab/Pagination';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPopularArtistsInLineups } from "../redux/asyncActions";
import { selectFestivalMatches, selectPopularArtists, selectMatchSettings, selectSelectedPlaylistArtists, selectCurrentPage, setCurrentPage } from '../redux/reducers/festivalMatchingSlice';
import { selectTopArtists } from '../redux/reducers/spotifyAccountSlice';
import { FestivalMatch, Artist, PopularArtistsDict, MatchSettings } from "../redux/types";
import FestivalMatchCard from './FestivalMatchCard';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box: {
			'@media (max-width: 609px)': {
				marginTop: theme.spacing(1)
			},
			'@media (min-width: 800px)': {
				marginTop: theme.spacing(1)
			},
			width: '100%',
			maxWidth: '764px',
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

const FestivalMatchesDisplay = () => {

	const festivalMatches: FestivalMatch[] = useSelector(selectFestivalMatches);
	const popularArtistsDict: PopularArtistsDict = useSelector(selectPopularArtists);
	const matchSettings: MatchSettings = useSelector(selectMatchSettings);
	const topArtists: Artist[] = useSelector(selectTopArtists);
	const selectedPlaylistArtists: Artist[] = useSelector(selectSelectedPlaylistArtists);
	const currentPage: number = useSelector(selectCurrentPage);
	const dispatch = useDispatch();

	const classes = useStyles();

	const mediumOrBigScreen = useMediaQuery('(min-width:400px)');

	const [siteInitialized, setSiteInitialized] = React.useState(false);
	const [isAnyMatch, setIsAnyMatch] = React.useState(true);

	const itemsPerPage = 15
	const numPages = Math.ceil(festivalMatches.length / itemsPerPage)

	const handleChange = (event: React.ChangeEvent<unknown>, value: number, isBottomPagination: boolean) => {
		if (currentPage !== value) {
            dispatch(setCurrentPage(value));
            const currentPageLineups = festivalMatches.slice((value - 1) * 15, value * 15).map(match => match.lineup_id);
            if (currentPageLineups.length > 0) {
                dispatch(getPopularArtistsInLineups(currentPageLineups));
            }
            if (isBottomPagination) {
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
            }
		}
	};

	const showMatches = festivalMatches.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, festivalMatches.length));

	useEffect(() => {
		if (showMatches.length === 0) {
			setIsAnyMatch(false);
		} else {
			setIsAnyMatch(true);
			setSiteInitialized(true);
		}
	}, [showMatches])

	return (
		<Box className={classes.box}>
			{showMatches.length > 0 &&
				<Box className={classes.alignItems}>
					<Typography variant="subtitle2" className={classes.matchLength}>
						{festivalMatches.length + ' matches'}
					</Typography>
					<Box className={classes.align}>
                    <Pagination count={numPages} page={currentPage} size={mediumOrBigScreen ? 'medium' : 'small'} onChange={(event: React.ChangeEvent<unknown>, value: number) => handleChange(event, value, false)} />
					</Box>
				</Box>}
			{showMatches.map((festival: FestivalMatch, idx) => {
				const popularArtists = festival.lineup_id in popularArtistsDict ? popularArtistsDict[festival.lineup_id] : [];
				const matchingArtists = matchSettings.matchBasis === "__your__top__artists__" ?
					topArtists.filter(artist => artist.spotifyId && festival.matching_artists.includes(artist.spotifyId)).sort((a, b) => a.userPopularity! < b.userPopularity! ? 1 : -1) :
					selectedPlaylistArtists.filter(artist => artist.spotifyId && festival.matching_artists.includes(artist.spotifyId)).sort((a, b) => a.userPopularity! < b.userPopularity! ? 1 : -1);
				return (<FestivalMatchCard festival={festival} popularArtists={popularArtists} matchingArtists={matchingArtists} key={'FestivalMatchCard: ' + festival.name + festival.year} showMatching={true} />)
			})}
			{showMatches.length > 0 &&
				<div>
					<Box className={classes.align}>
                    <Pagination count={numPages} page={currentPage} size={mediumOrBigScreen ? 'medium' : 'small'} onChange={(event: React.ChangeEvent<unknown>, value: number) => handleChange(event, value, true)} />
					</Box>
					<div className={classes.verticalSpace2} />
				</div>}
			{siteInitialized && !isAnyMatch &&
				<div>
					<div className={classes.verticalSpace} />
					<Typography variant="subtitle1" className={classes.noMatches}>
						No registered festivals in the selected area in this time frame.
		            </Typography>
				</div>
			}
		</Box>
	);
};

export default FestivalMatchesDisplay;
