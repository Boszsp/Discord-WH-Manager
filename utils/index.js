import {toast} from "vue-sonner";
import TurndownService from "turndown";

export const turndownService = new TurndownService({headingStyle: "atx"});

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
  });
  toast.success("Create Success");

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
  });
  toast.success("Delete Success");

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
  });
  toast.success("Edit Success");
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

export async function sendToProxyD(url, json, files) {
  const configg = useRuntimeConfig();
  const njson = JSON.parse(JSON.stringify(json));
  njson.content = turndownService.turndown(njson?.content);
  //njson?.embeds?.map((i) => cleanUpBlank(i));
  cleanUpBlank(njson);
  const filesForm = new FormData();
  filesForm.append("url", url);
  let count = 0;
  for (const file of files) {
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
        if (files && files?.length > 0) {
          await $fetch("/api/proxy", {
            baseURL: configg.public.apiBase,
            method: "POST",
            body: filesForm,
          });
        }

        return r;
      })
      .catch(() => {
        toast.error("Sending Fail");
      });
  } else if (files) {
    data = await $fetch("/api/proxy", {
      baseURL: configg.public.apiBase,
      method: "POST",
      body: filesForm,
    }).catch(() => {
      toast.error("Sending Fail");
    });
  }

  console.log(data);
  if (data && data.status / 100 == 2) {
    toast.success("Sending Success");
  }
  return data;
}

export async function getFileFromClipboard() {
  try {
    // Request clipboard access
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      // Check if the clipboard item has any file types
      if (item.types.includes("image/png") || item.types.includes("image/jpeg") || item.types.includes("image/gif") || item.types.includes("application/pdf")) {
        // Get the file from the clipboard item
        const blob = await item.getType(item.types[1]);

        // Create a File object from the Blob
        const file = new File([blob], blob?.name ?? "clipboard-file." + blob.type.split("/")[1], {type: blob.type});

        // Return the file
        return file;
      }
    }

    // No file found in the clipboard
    return null;
  } catch (error) {
    console.error("Failed to read clipboard contents: ", error);
    return null;
  }
}
