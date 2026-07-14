import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const usuario = auth?.user;
      const { pathname } = request.nextUrl;

      const esRutaAdmin = pathname.startsWith("/admin");
      const esRutaProfesora = pathname.startsWith("/mis-grupos");

      if (esRutaAdmin) return usuario?.rol === "ADMIN";
      if (esRutaProfesora) return usuario?.rol === "PROFESORA";
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.rol = token.rol as "ADMIN" | "PROFESORA";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
