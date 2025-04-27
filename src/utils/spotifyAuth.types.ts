export type TokenResponse = {
  access_token: string; // An access token that can be provided in subsequent calls, for example to Spotify Web API services.
  token_type: string; // How the access token may be used: always "Bearer".
  scope: string; // A space-separated list of scopes which have been granted for this access_token
  expires_in: number; // The time period (in seconds) for which the access token is valid.
  refresh_token?: string;
};
