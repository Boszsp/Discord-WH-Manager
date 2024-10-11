import { hookJsonSchema } from "~/zschemas"

export function fetchMessage(hook_url:string,message_id:string){
    return $fetch(hook_url+"/messages/"+message_id)
}


export function extractMessage(obj:typeof hookJsonSchema){
    const hold = hookJsonSchema.safeParse(obj).data;
    hold?.embeds?.map(element => {
        return Object.assign(element,{color:"#"+element.color?.toString(16)})
    });
    return hold
}
