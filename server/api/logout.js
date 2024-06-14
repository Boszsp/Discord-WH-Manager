export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });
  await session.clear();
  return {status: 200, mss: "success"};
});
