import { ofetch } from "ofetch";
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });
  if (!session.data.s_id) {
    setResponseStatus(event, 401, "Unauthorized");
    return { status: 401, mss: "unauthorized" };
  }
  const body = await readBody(event).catch(() => ({ data: [] }));

  return await ofetch.raw(body.url, {
    method: "POST",
    body: Object.assign({}, body.json),
  })
});
