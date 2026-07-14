import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || usuario.estado !== "ACTIVO") return null;

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) return null;

        return {
          id: usuario.id,
          email: usuario.email,
          rol: usuario.rol,
        };
      },
    }),
  ],
});
