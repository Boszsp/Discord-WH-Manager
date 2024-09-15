import {toast} from "vue-sonner";
import TurndownService from "turndown";
import {filesSchema, hookJsonSchema, urlSchema} from "~/zschemas";

export const turndownService = new TurndownService({headingStyle: "atx"});

export function getDBInfo() {
  return null;
}

export function getHooks() {
  const configg = useRuntimeConfig();
  return useFetch("/api/hooks", {
    baseURL: configg.public.apiBase,
  });
}
export function getPrefixs() {
  const configg = useRuntimeConfig();
  return useFetch("/api/japrefix", {
    baseURL: configg.public.apiBase,
  });
}

export async function createHooks(hooks) {
  const configg = useRuntimeConfig();
  if (!(hooks && hooks[0].link && hooks[0].name)) {
    toast.error("Create Error");

    return false;
  }
  const res = await $fetch("/api/hooks", {
    method: "POST",
    body: {data: hooks.concat()},
    baseURL: configg.public.apiBase,
  })
    .then((r) => {
      toast.success("Create Success");
      return r;
    })
    .catch((err) => {
      toast.error("Create Error " + err);
    });

  return res;
}

export async function deleteHook(id) {
  const configg = useRuntimeConfig();
  if (!id) {
    toast.error("Delete Error");
    return false;
  }
  const res = await $fetch("/api/hooks", {
    method: "DELETE",
    body: {id},
    baseURL: configg.public.apiBase,
  })
    .then((r) => {
      toast.success("Delete Success");
      return r;
    })
    .catch((err) => {
      toast.error("Delete Error " + err);
    });

  return res;
}

export async function editHook(id, data) {
  const configg = useRuntimeConfig();
  if (!id) {
    toast.error("Edit Error");
    return false;
  }
  const res = await $fetch("/api/hooks", {
    method: "PATCH",
    body: {id, data},
    baseURL: configg.public.apiBase,
  })
    .then((r) => {
      toast.success("Edit Success");
      return r;
    })
    .catch((err) => {
      toast.error("Edit Error " + err);
    });
  return data;
}

export async function login(username, password) {
  const configg = useRuntimeConfig();
  if (!username || !password) {
    toast.warning("Username & Password cannot blank");
    return false;
  }
  const isAuth = useAuth();
  const data = await $fetch("/api/login", {
    server: false,
    method: "POST",
    body: {
      username,
      password,
    },
    baseURL: configg.public.apiBase,
  }).catch(() => {
    toast.error("Authentication Fail");
    isAuth.value = false;
  });
  if (data && data.status / 100 == 2) {
    toast.success("Authentication Success");
    isAuth.value = true;
  }
  return data;
}

export async function logout() {
  const configg = useRuntimeConfig();
  const isAuth = useAuth();
  const data = await $fetch("/api/logout", {
    server: false,
    method: "POST",
    baseURL: configg.public.apiBase,
  });
  if (data && data.status == 200) {
    toast.success("Logout Success");
    isAuth.value = false;
  }
  return data;
}

export function colorCodeToInteger(colorCode) {
  // Ensure the color code starts with a '#' and is followed by 6 hexadecimal characters
  if (typeof colorCode === "string" && colorCode.startsWith("#") && colorCode.length === 7) {
    // Parse the hexadecimal part of the string to an integer
    return parseInt(colorCode.slice(1), 16);
  }
  // Return null or throw an error if the input is invalid
  return null; // or throw new Error('Invalid color code');
}

export function cleanUpBlank(obj) {
  for (let k in obj) {
    if (k == "content") continue;

    if (k == "color") obj[k] = colorCodeToInteger(obj[k]);
    if (k == "timestamp" && obj[k]) obj[k] = new Date(obj[k]).toISOString();

    if (typeof obj[k] == "boolean" && (obj?.name?.length > 0 || obj?.value?.length > 0)) continue;
    if (!obj[k] || obj[k]?.length < 1) {
      delete obj[k];
    } else if (typeof obj[k] == "object" && !obj[k]?.map) {
      cleanUpBlank(obj[k]);
      if (Object.keys(obj[k]).length < 1) {
        delete obj[k];
      }
    } else if (typeof obj[k] == "object") {
      obj[k].map((i) => cleanUpBlank(i));
      obj[k] = obj[k].filter((i) => !(Object.keys(i).length < 1 || (Object.keys(i).length == 1 && Object.keys(i) == "color")));
      if (obj[k].length < 1) delete obj[k];
    }
  }
  return obj;
}

export function formatFileSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} bytes`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

export async function sendToProxyD(url, json, files, sendImagesOnlyMode) {
  const configg = useRuntimeConfig();
  const njson = JSON.parse(JSON.stringify(json));
  njson.content = turndownService.turndown(njson?.content);
  //njson?.embeds?.map((i) => cleanUpBlank(i));
  cleanUpBlank(njson);
  const validate_url = urlSchema.safeParse(url);
  const validate = hookJsonSchema.safeParse(njson);
  const validate_files = filesSchema.safeParse(files);

  if (!validate.success || !validate_url.success || !validate_files.success) {
    validate?.error?.issues?.forEach((mss, c) => {
      setTimeout(() => toast.error(mss.message), c);
    });
    validate_url?.error?.issues?.forEach((mss, c) => {
      setTimeout(() => toast.error(mss.message), c);
    });
    validate_files?.error?.issues?.forEach((mss, c) => {
      setTimeout(() => toast.error(mss.message), c);
    });
    return;
  }
  const filesForm = new FormData();
  filesForm.append("url", url);
  let count = 0;
  if (sendImagesOnlyMode)
    for (let file of files) {
      filesForm.append("files", file, file.name);
      count++;
    }
  let data = null;
  if (njson.content) {
    data = await $fetch("/api/proxy", {
      baseURL: configg.public.apiBase,
      method: "POST",
      body: {
        url,
        json: Object.assign({}, njson),
      },
    })
      .then(async (r) => {
        if (sendImagesOnlyMode && files && files?.length > 0) {
          await $fetch("/api/proxy", {
            baseURL: configg.public.apiBase,
            method: "POST",
            body: filesForm,
          }).catch(() => {
            toast.error("Sending Files Fail");
          });
        } else if (files && files?.length > 0) {
          await sentFiles(url,files)
        }

        return r;
      })
      .catch(() => {
        toast.error("Sending Fail");
      });
  } else if (files) {
    if(sendImagesOnlyMode){
      data = await $fetch("/api/proxy", {
        baseURL: configg.public.apiBase,
        method: "POST",
        body: filesForm,
      }).catch(() => {
        toast.error("Sending Fail");
      });
    }else{
      await sentFiles(url,files)
    }
    
  }
  if (data && data.status / 100 == 2) {
    toast.success("Sending Success");
  }
  return data;
}


async function sentFiles(url,files){
  const configg = useRuntimeConfig();
  let c = 0;
  for (let file of files) {
    const filesForm = new FormData();
    filesForm.append("files[0]", file, file.name);
    await $fetch(url, {
      baseURL: configg.public.apiBase,
      method: "POST",
      body: filesForm,
    })
      .then(() => {
        toast.success("Sending Files " + (c + 1) + " Success");
      })
      .catch((e) => {
        toast.error("Sending Files " + (c + 1) + " Fail " + e);
      });
    c++;
  }
}
