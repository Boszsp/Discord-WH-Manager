import {ofetch} from "ofetch";
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, {
    password: runtimeConfig.backendPassword,
  });
  /*if (!session.data.s_id) {
    setResponseStatus(event, 401, "Unauthorized");
    return {status: 401, mss: "unauthorized"};
  }*/
  const body = await readBody(event).catch(() => ({data: []}));
  const formData = await readFormData(event).catch(() => null);
  let response = null;
  if (body?.json) {
    response = await ofetch.raw(body.url + "?wait=true", {
      method: "POST",
      body: Object.assign({}, body.json),
      query: {
        wait: true,
      },
      responseType: "json",
    });
  } else if (body?.files || formData.get("files")) {
    const filesForm = new FormData();
    formData.getAll("files").forEach((i, c) => {
      filesForm.append("files[" + c + "]", i, i?.name);
    });
    response = await ofetch.raw(body.url ?? formData.get("url"), {
      method: "POST",
      body: filesForm,
      query: {
        wait: true,
      },
      responseType: "json",
    });
  }
  return {
    data: response?._data ?? "x",
    status: response?.status,
    statusText: response?.statusText,
  };
});
