import {compile} from "handlebars";
import {toast} from "vue-sonner";
import {z} from "zod";

export function getTemplateFromId(id: number = 0) {
  return localStorage.getItem("template_" + id) || `{"content":"<p></p>{{content}}","embeds":[{"title":" {{embeds0title}}"}]}`;
}

export function saveTemplate(id: number = 0, template: string) {
  const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
  type Literal = z.infer<typeof literalSchema>;
  type Json = Literal | {[key: string]: Json} | Json[];
  const jsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]));
  const safeParseTemplate = jsonSchema.safeParse(JSON.parse(template));

  if (!safeParseTemplate.success) {
    toast.error("Save template failed");
    return false;
  }

  if (safeParseTemplate?.data) {
    toast.success("Saved template");
    localStorage.setItem("template_" + id, JSON.stringify(safeParseTemplate?.data));
    localStorage.setItem("template_id_list" + id, JSON.stringify([id].concat(JSON.parse(localStorage.getItem("template_id_list") ?? "[]"))));
  }
}

let count: any = {};

function covertToTemplate(template: any, prefix: string = "") {
  for (let key in template) {
    if (key == "color") {
      template[key] = "#" + template[key].toString(16);
      continue;
    }
    if (typeof template[key] != "object" && template[key]) {
      template[key] = template[key] + "{{" + prefix + (prefix ? count[prefix] || 0 : "") + key + (count[key] || "") + "}}";
    } else if (typeof template[key] == "object") {
      covertToTemplate(template[key], isNaN(parseInt(key)) ? prefix + (prefix ? count[prefix] || 0 : "") + key : prefix);
    }
    if (count[key]) {
      count[key]++;
    } else {
      count[key] = 1;
    }
  }
  return template;
}
export function exportAsTemplate(obj: any) {
  count = {};
  return covertToTemplate(cleanUpBlank(JSON.parse(JSON.stringify(obj))));
}

export function getAllVariable(templateString: string) {
  const re1 = /{{\s*(\w+|\d+)\s*}}/gi;
  let results: any = templateString.matchAll(re1);
  let allVariable: any = {};
  results = results?.toArray()?.map((vv: any) => vv?.[1] as string);
  results.forEach((r: string) => (allVariable[r] = ""));
  return allVariable;
}

export function renderTemplate(templateString: string, data: Object) {
  const template = compile(templateString, {data: true});
  return template(data);
}
