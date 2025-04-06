import { registerAs } from "@nestjs/config";

const client = `303771527448-5kuvjfi325nus0tssimjvng2bdpic90p.apps.googleusercontent.com`;
const secret = `303771527448-5kuvjfi325nus0tssimjvng2bdpic90p.apps.googleusercontent.com`;
const cbu = `https://first-project-with-nest-production.up.railway.app/api/auth/google/callback`;
console.log('[google-oauth.config.ts] Loaded ENV:', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
})
export default registerAs("googleOAuth", () => ({
    clientID: client,
    clientSecret: secret,
    callbackURL: cbu,
}))