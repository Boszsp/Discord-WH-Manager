import type {content} from "#tailwind-config";
import {precompile, compile} from "handlebars";
import {toast} from "vue-sonner";
import {z} from "zod";

export function getTemplateFromId(id: number = 0) {
  return localStorage.getItem("template_" + id) || `{"content":"<p></p>{{content}}","embeds":[{"title":" {{embeds0title}}"}]}`;
}

export function saveTemplate(id: number = 0, template: string) {
  toast.success("Saved template");
  localStorage.setItem("template_" + id, JSON.stringify(JSON.parse(template)));
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
