"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (clinicName: string) => {
  // veririficar se o usuario esta logado
  const session = await auth.api.getSession({

    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  // criar clinica

  const [clinic]= await db.insert(clinicsTable).values({ name: clinicName }).returning();
  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

 redirect("/dashboard");
};