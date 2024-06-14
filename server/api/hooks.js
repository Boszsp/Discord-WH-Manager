import {PrismaClient} from "@prisma/client";
import AES from "crypto-js/aes";
import UTF8 from "crypto-js/enc-utf8";

async function getHooks(prisma, session) {
  const hooks = await prisma.hookLink.findMany({
    select: {
      id: true,
      name: true,
      link: true,
    },
    where: {ownerId: session.data.s_id},
  });
  hooks.map((i) => {
    if (i.link) {
      i.link = AES.decrypt(i.link, session.data.s_pubkey).toString(UTF8);
    }
    return i;
  });
  return {status: 200, hooks};
}

async function createHooks(prisma, data, session) {
  await data?.map((i) => {
    if (i.link) {
      i.link = AES.encrypt(i.link, session.data.s_pubkey).toString();
    }
    return i;
  });
  const result = await prisma.hookLink.createMany({data});
  return {status: 200, result};
}

async function updateHook(prisma, id, data, session) {
  if (data.link) {
    data.link = AES.encrypt(data.link, session.data.s_pubkey).toString();
  }
  const result = await prisma.hookLink.update({where: {id}, data});
  return {status: 200, result};
}

async function deleteHook(prisma, id) {
  const result = await prisma.hookLink.delete({where: {id}});
  return {status: 200, result};
}

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });
  const body = await readBody(event).catch(() => ({data: []}));
  if (!session?.data?.s_id) {
    setResponseStatus(event, 401, "Unauthorized");
    return {status: 401, mss: "unauthorized"};
  }

  if (event.method == "GET") {
    return await getHooks(prisma, session);
  } else if (event.method == "POST") {
    return await createHooks(
      prisma,
      body.data
        .map((i) => {
          i.ownerId = session.data.s_id;
          return i;
        })
        .filter((i) => i.name.length > 0 && i.link.length > 0),
      session
    );
  } else if (event.method == "PATCH") {
    return await updateHook(prisma, body.id, body.data, session);
  } else if (event.method == "DELETE") {
    return await deleteHook(prisma, body.id);
  }
});
