import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const dynamoClient = new DynamoDBClient({ region: "us-west-2" });
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        console.log("Attempting to sign in with email:", email);

        try {
          const { Item: user } = await dynamoDB.send(
            new GetCommand({
              TableName: "Users",
              Key: { email },
            })
          );

          console.log("User retrieved from DynamoDB:", user);

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isValid = await bcrypt.compare(password, user.password);

          console.log("Password match:", isValid);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return { email: user.email, isAdmin: user.isAdmin };
        } catch (error) {
          console.error("Authentication error:", error.message || "Authentication failed");
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
