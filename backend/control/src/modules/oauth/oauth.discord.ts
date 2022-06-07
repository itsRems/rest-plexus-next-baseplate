import { extractEnv } from '@rocketplay/extractenv';
import DiscordOauth2 from 'discord-oauth2';

export const oauthClient = new DiscordOauth2({
  clientId: extractEnv('DISCORD_CLIENT_ID'),
  clientSecret: extractEnv('DISCORD_CLIENT_SECRET'),
  redirectUri: `${extractEnv('FRONTEND_BASE_URL', 'http://localhost:3000')}/oauth/discord/auth`,
});

export function getLink () {
  return oauthClient.generateAuthUrl({
    scope: ['identify']
  });
}