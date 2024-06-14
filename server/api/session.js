//import { PrismaClient } from "@prisma/client";
export default defineEventHandler(async (event) => {
  //const prisma = new PrismaClient();
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });
  if (!session.data.s_id) {
    setResponseStatus(event, 401, "Unauthorized");
    return { status: 401, mss: "unauthorized" };
  }
  /*const user = await prisma.user.findUnique({
    select: { id: true, username: true },
    where: { id: session.data.s_id, password: session.data.s_password },
  });*/
  return {
    status: 200,
    user: { id: session.data.s_id, username: session.data.s_username },
  };
});
