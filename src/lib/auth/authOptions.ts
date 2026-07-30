import { AuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../db/db";
import { users } from "../db/schema";
import type { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            async profile(profile, token) {
                console.log("Profile:", profile);
                console.log("Token:", token);

                const data = {
                    fname: profile.given_name,
                    lname: profile.family_name,
                    email: profile.email,
                    provider: 'GOOGLE',
                    externalId: profile.sub,
                    image: profile.picture,
                };

                try {
                    const user = await db
                        .insert(users)
                        .values(data)
                        .onConflictDoUpdate({ target: users.email, set: data })
                        .returning();

                    return {
                        ...data,
                        name: data.fname,
                        id: String(user[0].id),
                        role: user[0].role,
                    };
                } catch (err) {
                    console.log(err);

                    return {
                        id: '',
                    };
                }
            }
        })
    ],

    callbacks: {
        async session({ session }: { session: Session; token: JWT }) {
            return session;
        },

        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                const authUser = user as User & { role?: string; id?: string };
                token.role = authUser.role;
                token.id = authUser.id;
            }
            return token;
        },
    },
};