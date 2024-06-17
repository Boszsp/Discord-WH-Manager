import {PrismaClient} from "@prisma/client";
import SHA256 from "crypto-js/sha256";

function generateRandomString(length = 16) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charactersLength;
    result += characters.charAt(randomIndex);
  }
  return result;
}

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const {username, password} = getQuery(event);
  const body = await readBody(event).catch(() => ({data: []}));

  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });

  if (session.data.s_id && session.data.s_password) {
    return "already login";
  }
  if (!((username && password) || (body.username && body.password))) {
    setResponseStatus(event, 500, "Internal Server Error");
    return {staus: 500, mss: "server error"};
  }
  const user = await prisma.user
    .findUnique({
      where: {username: username ?? body.username},
    })
    .then(async (d) => {
      if (body?.username && body?.password) return;
      if (!d && runtimeConfig.username == body.username && runtimeConfig.password == body.password) {
        return await prisma.user.create({
          data: {username: runtimeConfig.username, password: SHA256(runtimeConfig.password).toString(), publicKey: generateRandomString(), privateKey: ""},
        });
      }
      return d;
    });
  if (user && user.password === SHA256(password ?? body.password).toString()) {
    let publicKey = user.publicKey;
    if (user && !user.publicKey) {
      publicKey = generateRandomString();
      await prisma.user.update({
        data: {
          publicKey,
        },
        where: {
          id: user.id,
        },
      });
    }
    await session.update({
      s_id: user.id,
      s_password: SHA256(password ?? body.password).toString(),
      s_date: new Date(),
      s_username: user.username,
      s_pubkey: publicKey,
    });
    return {status: 200, mss: "login success"};
  } else if (user) {
    setResponseStatus(event, 406);
    return {status: 406, mss: "password miss match"};
  }

  setResponseStatus(event, 404, "Not Found");
  return {status: 404, mss: "not found user"};
});
