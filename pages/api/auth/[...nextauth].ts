import nextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismadb'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: {label: 'Email', type:'email', placeholder:'john@email.com'},
        password: {label: 'Password', type:'password'}
      },
     
      async authorize(credentials, req) {

        const {email, password} = credentials as {
            email: string;
            password: string;
          };

        if (!email || !password) {
          throw new Error('Invalid form, missing email or password');
        }

        console.log(`user ${email} trying to auth`);

        const user = await prisma.user.findFirst({
          where: {
            email: email,
          }
        })    

        console.log(`found user from db: `, user);

        if (!user) {
          throw new Error('This user does not exist.');
        }
        
        return {email} as  {
            id: string;
            email: string;
            password: string;
        };
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin'
  },
};
export default nextAuth(authOptions);
