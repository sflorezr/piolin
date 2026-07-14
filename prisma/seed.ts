import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@piolin.local";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const hash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hash,
      rol: "ADMIN",
    },
  });

  console.log(`Usuario admin listo: ${usuario.email} (contraseña: ${password})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
