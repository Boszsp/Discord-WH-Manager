import {compile, registerHelper} from "handlebars";
import {toast} from "vue-sonner";
import {z} from "zod";

export function getTemplateFromId(id: number = 0) {
  return localStorage?.getItem("template_" + id) || `{"content":"{{content}}"}`;
}

export function getAllTemplateId(): number[] {
  const holds: number[] = [];
  new Set(JSON.parse(localStorage?.getItem("template_id_list") ?? "[0]")).forEach((hold) => holds.push(hold as number));
  return holds;
}

export function deleteTemplate(id: number) {
  localStorage?.removeItem("template_" + id);
  localStorage?.setItem("template_id_list", JSON.stringify(getAllTemplateId().filter((item) => item != id)));
  toast.success("Deleted template");
}

export function safeParseJson(template: string) {
  const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
  type Literal = z.infer<typeof literalSchema>;
  type Json = Literal | {[key: string]: Json} | Json[];
  const jsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]));
  return jsonSchema.safeParse(JSON.parse(template));
}

export function saveTemplate(id: number = 0, template: string) {
  const safeParseTemplate = safeParseJson(template);

  if (!safeParseTemplate.success) {
    toast.error("Save template failed");
    return false;
  }

  if (safeParseTemplate?.data) {
    toast.success("Saved template");
    localStorage?.setItem("template_" + id, JSON.stringify(safeParseTemplate?.data));
    localStorage?.setItem("template_id_list", JSON.stringify([id].concat(getAllTemplateId())));
    localStorage?.setItem("template_id_list", JSON.stringify(getAllTemplateId()));
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

export function safeParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

export function renderTemplate(templateString: string, data: Object) {
  const template = compile(templateString, {data: true, strict: true});
  const escapedData = Object.entries(data).reduce(
    (acc: Record<string, any>, [key, value]) => {
      if (typeof value === "string") {
        acc[key] = value.replace(/\n/g, "\\n"); // Escape newlines
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );
  return template(escapedData);
}
