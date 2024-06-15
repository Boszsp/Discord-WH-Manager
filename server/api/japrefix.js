import {PrismaClient} from "@prisma/client";

async function getJaPrefixs(prisma, session) {
  const JaPrefixs = await prisma.jaPrefix.findMany();
  return {status: 200, JaPrefixs};
}

async function createJaPrefixs(prisma, data) {
  const result = await prisma.jaPrefix.createMany({data: data});
  return {status: 200, result};
}

async function updateJaPrefix(prisma, id, data) {
  const result = await prisma.jaPrefix.update({where: {code}, data});
  return {status: 200, result};
}

async function deleteJaPrefix(prisma, code) {
  const result = await prisma.jaPrefix.delete({where: {code}});
  return {status: 200, result};
}

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });
  const body = await readBody(event).catch(() => ({data: []}));

  if (event.method == "GET") {
    return await getJaPrefixs(prisma, session);
  } else if (event.method == "POST") {
    return await createJaPrefixs(prisma, body.data);
  } else if (event.method == "PATCH") {
    return await updateJaPrefix(prisma, body.code, body.data);
  } else if (event.method == "DELETE") {
    return await deleteJaPrefix(prisma, body.code);
  }
});
