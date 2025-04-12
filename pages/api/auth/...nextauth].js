import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const dynamoClient = new DynamoDBClient({ region: "af-south-1" });
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fetch user from DynamoDB
        const { Item } = await dynamoDB.send(
          new GetCommand({
            TableName: "Users",
            Key: { email: credentials.email },
          })
        );

        if (!Item) {
          throw new Error("No user found with this email");
        }

        // Compare passwords
        const isValid = await bcrypt.compare(credentials.password, Item.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object
        return { email: Item.email, isAdmin: Item.isAdmin };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});