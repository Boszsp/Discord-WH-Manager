import {toast} from "vue-sonner";
import TurndownService from "turndown";
import {filesSchema, hookJsonSchema, urlSchema} from "~/zschemas";
import CryptoJS from "crypto-js";
import PouchDB from "pouchdb";

export const turndownService = new TurndownService({headingStyle: "atx"});
const DB = () => new PouchDB("DWHManager");
const data = ref({status: 500, hooks: []});
const pending = ref(true);
const error = ref(false);

export async function getDBInfo() {
  const db = DB();
  const info = await db
    .info()
    .then((info) => {
      return info;
    })
    .catch((err) => {
      console.error("Error getting IndexedDB size:", err);
    });
  db.close();
  return info;
}

export async function destroyDB() {
  const db = DB();
  try {
    await db.destroy();
    toast.success(`Database destroyed successfully.`);
  } catch (err) {
    toast.error(`Error destroying database :`, err);
  }
}

export async function compressDB(){
  const db = DB()
  await db.compact().catch((e)=>console.error("Error "+e))
  db.close()
}

export function getHooks() {
  const session = useCookie("session").value;
  const db = DB();
  db.allDocs({
    include_docs: true,
  })
    .then((res) => {
      //console.log(res,res.rows.map((d) => ({id: d.doc._id, name: d.doc.name, link: CryptoJS.AES.decrypt(d.doc.link, session.value).toString(CryptoJS.enc.Utf8) ?? "Decrypt Key Error", _rev: d.doc_rev, _id: d.doc._id})))
      //console.log(res.rows);
      //res.rows.map((d)=>Object.assign({link:"xxx"},d))
      data.value = {
        status: 200,
        hooks: res.rows.map((d) => ({id: d.doc._id, name: d.doc.name, link: CryptoJS.AES.decrypt(d.doc.link, session).toString(CryptoJS.enc.Utf8) || "Decrypt Key Error", _rev: d.doc_rev, _id: d.doc._id})),
      };
    })
    .catch(function (err) {
      error.value = err;
    })
    .finally(() => {
      pending.value = false;
    });
  db.close();
  return {
    data,
    pending,
    error,
    refresh: getHooks,
  };
}

export function getPrefixs() {
  return {
    data: ref({
      status: 200,
      jaPrefix: [],
    }),
  };
}

export async function createHooks(hooks) {
  const session = useCookie("session");
  if (!(hooks && hooks[0].link && hooks[0].name)) {
    toast.error("Create Error");
    return false;
  }
  const db = DB();
  try {
    const data = await Promise.all(
      hooks?.map((hook) => {
        return db.post({
          name: hook.name,
          link: CryptoJS.AES.encrypt(hook.link, session.value).toString(),
        });
      })
    );
    db.close();
    toast.success("Create Success");
    return data;
  } catch {
    db.close();
    toast.error("Create Error");
    return {status: 400};
  }
}

export async function deleteHook(id) {
  if (!id) {
    toast.error("Delete Error");
    return false;
  }
  const db = DB();
  try {
    const res = await db.remove(await db.get(id));
    db.close();
    toast.success("Delete Success");
    return res;
  } catch {
    db.close();
    toast.error("Delete Error");
    return {status: 400};
  }
}

export async function editHook(id, data) {
  const session = useCookie("session");
  if (!id) {
    toast.error("Edit Error");

    return false;
  }
  const db = DB();
  try {
    const doc = await db.get(id);
    const res = await db.put({
      _id: id,
      _rev: doc._rev,
      name: data.name,
      link: CryptoJS.AES.encrypt(data.link, session.value).toString(),
    });
    db.close();
    toast.success("Delete Success");
    return res;
  } catch {
    db.close();
    toast.error("Delete Error");
    return {status: 400};
  }
}

export async function login(username, password) {
  if (!password) {
    toast.warning("Key cannot blank");
    return false;
  }
  const isAuth = useAuth();
  const session = useCookie("session");
  isAuth.value = false;

  if (password && password.length == 16) {
    session.value = password;
    if (session.value) {
      isAuth.value = true;
      return true;
    }
    toast.error("Some thing went wrong");
  } else {
    toast.error("Key length muse be 16 characters");
  }
}

export async function logout() {
  const isAuth = useAuth();
  const session = useCookie("session");
  session.value = undefined;
  if (!session.value) {
    toast.success("Logout Success");
    isAuth.value = false;
    setTimeout(() => reloadNuxtApp(), 100);
    return true;
  }
  return false;
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

export async function sendToProxyD(url, json, files) {
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
  for (const file of files) {
    filesForm.append("files[" + count + "]", file, file.name);
    count++;
  }
  let data = null;
  if (njson.content) {
    data = await $fetch(url, {
      baseURL: configg.public.apiBase,
      method: "POST",
      body: Object.assign({}, njson),
    })
      .then(async (r) => {
        if (files && files?.length > 0) {
          await $fetch(url, {
            baseURL: configg.public.apiBase,
            method: "POST",
            body: filesForm,
          })
            .then(() => {
              toast.success("Sending Files Success");
            })
            .catch((e) => {
              toast.error("Sending Files Fail " + e);
            })
            .finally(() => {
              pending.value = false;
            });
          return r;
        } else {
          pending.value = false;
        }
        toast.success("Sending Message Success");

        return r;
      })
      .catch((e) => {
        pending.value = false;
        toast.error("Sending Fail : " + e);
      });
  } else if (files) {
    data = await $fetch(url, {
      baseURL: configg.public.apiBase,
      method: "POST",
      body: filesForm,
    })
      .then((r) => {
        toast.success("Sending Success");
        return r;
      })
      .catch(() => {
        toast.error("Sending Fail");
      })
      .finally(() => {
        pending.value = false;
      });
  }

  return {data, pending};
}
