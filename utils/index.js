import {toast} from "vue-sonner";
export async function createHooks(hooks) {
  if (!(hooks && hooks[0].link && hooks[0].name)) {
    return false;
  }
  const res = await $fetch("/api/hooks", {
    method: "POST",
    body: {data: hooks.concat()},
    retry: 0,
  });
  return res;
}

export async function deleteHook(id) {
  if (!id) {
    return false;
  }
  const res = await $fetch("/api/hooks", {
    method: "DELETE",
    body: {id},
  });
  return res;
}

export async function editHook(id, data) {
  if (!id) {
    return false;
  }
  const res = await $fetch("/api/hooks", {
    method: "PATCH",
    body: {id, data},
  });
  return data;
}

export async function login(username, password) {
  if (!username || !password) {
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
  });
  if (data && data.status == 200) {
    toast.success("Authentication Success");
    isAuth.value = true;
  }
  return data;
}

export async function logout() {
  const isAuth = useAuth();
  const data = await $fetch("/api/logout", {
    server: false,
    method: "POST",
  });
  if (data && data.status == 200) {
    toast.success("Logout Success");
    isAuth.value = false;
  }
  return data;
}

export function colorCodeToInteger(colorCode) {
    // Ensure the color code starts with a '#' and is followed by 6 hexadecimal characters
    if (typeof colorCode === 'string' && colorCode.startsWith('#') && colorCode.length === 7) {
      // Parse the hexadecimal part of the string to an integer
      return parseInt(colorCode.slice(1), 16);
    }
    // Return null or throw an error if the input is invalid
    return null; // or throw new Error('Invalid color code');
  }

export function cleanUpBlank(obj) {
    for (let k in obj) {
        if(k == "content")continue
        if(k=="color")obj[k]=colorCodeToInteger(obj[k])
      if (!obj[k] || obj[k]?.length < 1) {
        delete obj[k];
      } else if (typeof obj[k] == "object" && !obj[k]?.map) {
        cleanUpBlank(obj[k]);
        if(Object.keys(obj[k]).length < 1  ){
            delete obj[k];
        }
      } else if (typeof obj[k] == "object") {
        obj[k].map((i) => cleanUpBlank(i));
        obj[k] = obj[k].filter((i)=>!(Object.keys(i).length < 1 || (Object.keys(i).length == 1 && Object.keys(i) == "color")))
        if(obj[k].length < 1)delete obj[k];
      }
    }
    return obj;
  }



export async function sendToProxyD(url, json) {
  
  const njson = JSON.parse(JSON.stringify(json));
  //njson?.embeds?.map((i) => cleanUpBlank(i));
  cleanUpBlank(njson)
  //console.log(JSON.stringify(njson))
  const data = await $fetch("/api/proxy",{
        method:"POST",
        body: {
            url,
            json:Object.assign({}, njson)
        }
    })
    if(data && data.status%100 == 2){
        toast.success('Sending Success')
    }
  return data;
}
