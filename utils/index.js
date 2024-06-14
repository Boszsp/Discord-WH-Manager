import { toast } from 'vue-sonner'
export async function createHooks(hooks){
    if(!(hooks && hooks[0].link && hooks[0].name)){
        return false
    }
    const res = await $fetch("/api/hooks",{
        "method":"POST",
        body: {data:hooks.concat()},
        retry:0
    });
    return res
}

export async function deleteHook(id){
    if(!id){
        return false
    }
    const res = await $fetch("/api/hooks",{
        "method":"DELETE",
        body: {id}
    });
    return res
}

export async function editHook(id,data){
    if(!id){
        return false
    }
    const res = await $fetch("/api/hooks",{
        "method":"PATCH",
        body: {id,data}
    });
    return data
}

export async function login(username,password){
    if(!username || !password){
        return false
    }
    const isAuth = useAuth();
    const data = await $fetch("/api/login",{
        server:false,
        method:"POST",
        body:{
            username,password
        }
    })
    if(data && data.status == 200){
        toast.success('Authentication Success')
        isAuth.value = true
    }
    return data
}

export async function logout(){
    const isAuth = useAuth();
    const data = await $fetch("/api/logout",{
        server:false,
        method:"POST"
    })
    if(data && data.status == 200){
        toast.success('Logout Success')
        isAuth.value = false
    }
    return data
}

export async function sendToProxyD(url,json){
    const data = await $fetch("/api/proxy",{
        method:"POST",
        body: {
            url,
            json:Object.assign({}, json)
        }
    })
    if(data && data.status == 200){
        toast.success('Sending Success')
    }
    return data
}