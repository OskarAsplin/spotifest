# Spotifest

Find music festivals that match your Spotify profile. Use your most played artists or one of your playlists to see matching festivals.

Check it out at [spotifest.app](https://spotifest.app)

## Screenshots

<table width="100%">
  <thead>
    <tr>
      <th width="33.3%">Festival matches</th>
      <th width="33.3%">Festival page</th>
      <th width="33.3%">Artist page</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="33.3%"><img src="https://github.com/OskarAsplin/spotifest/raw/master/public/screenshots/matches.png"/></td>
      <td width="33.3%"><img src="https://github.com/OskarAsplin/spotifest/raw/master/public/screenshots/festival_page.png"/></td>
      <td width="33.3%"><img src="https://github.com/OskarAsplin/spotifest/raw/master/public/screenshots/artist_page.png"/></td>
    </tr>
  </tbody>
</table>

## Features

- Festival matching with more than 1000 festivals worldwide
- Sharing results on social media
- Festival pages with current and previous lineups
- Artist pages to see which festivals each artist is attending
- Adjustable matching parameters: playlist selector, area, time frame
- Search field to search for artists and festivals

## How it works

Choose to match with your most played artists or one of your playlists and immediately get a list of the best matching festivals. You can also change area and time frame. Each festival match displays which artists in your playlist are in the festival's lineup, as well as showing you a score percentage. The score is a combination of how many matching artists you have with the festival and how well the genres of your playlist fit the genres of the festival. Each festival also have a dropdown menu to see the most popular artists attending the festival to give you a quick overview of the lineup.

By clicking on a festival title you are taken to the corresponding festival page. There you can see current and previous lineups, links to official festival website and ticket website (if available), and see a youtube video of the festival (if available).

By clicking on an artist icon you are taken to the corresponding artist page. There you can see which festivals the artist is attending in the future and which festivals the artist has attended the last few years. The artist page also shows you which genres Spotify has registered for the artist.

## Built with

- [React](https://reactjs.org/), [Typescript](https://www.typescriptlang.org/), [React Query](https://tanstack.com/query/latest/docs/react/overview) and [Zustand](https://github.com/pmndrs/zustand)
- [Storybook](https://developer.spotify.com/documentation/web-api). See deploy [here](https://master--638b82b31acca1e593c75c8d.chromatic.com)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

Full technology stack on [spotifest.app/about](https://spotifest.app/about)

## Lineup and festival information

- [Music Festival Wizard](https://www.musicfestivalwizard.com)
