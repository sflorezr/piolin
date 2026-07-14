import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rol: "ADMIN" | "PROFESORA";
  }

  interface Session {
    user: {
      id: string;
      rol: "ADMIN" | "PROFESORA";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rol: "ADMIN" | "PROFESORA";
  }
}
