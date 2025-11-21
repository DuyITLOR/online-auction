import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK!,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      return done(null, profile);
    }
  )
);
