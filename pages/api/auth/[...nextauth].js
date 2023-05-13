import spotifyApi, { LOGIN_URL } from "@/lib/spotify"
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

async function refreshAccessToken (token){
    try{
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }


    }catch(err){
        console.log(err)
        return{
            ...token,
            error: 'RefreshTokenError'
        }
    }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }){

        //initial sign in
        if(account && user){
            return{
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAcountId,
                accessTokenExpires: account.expires_at * 1000
            }
        }

        // if return and token is valid
        if(Date.now() < token.accessTokenExpires ){
            return token
        }

        // access toke nexpired refrsh / update it 
        return await refreshAccessToken(token)
    },

    async session ({ session, token }){
        session.user.accessToken = token.accessToken,
        session.user.refreshToken = token.refreshToken,
        session.user.username = token.username

        return session
    }
  }
}

export default NextAuth(authOptions)