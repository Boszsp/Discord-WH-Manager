import {z} from "zod";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

export const urlSchema = z.string().url("Hook url invalid");

export const fileSchema = z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
  message: `File size cannot be greater than ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
});

export const filesSchema = fileSchema.array().max(10, "Files length must be less than 10 files");

export const authorSchema = z.object({
  name: z.string().max(256, "Username length must be less than 256 characters"),
  url: z.string().url("Please enter a valid  URL for the author url"),
  icon_url: z.string().url("Please enter a valid image URL for the author embed icon"),
});

export const fieldsSchema = z.object({
  name: z.string().max(256, "Embed field name length must be less than 256 characters"),
  value: z.string().max(1024, "Embed field value length must be less than 1024 characters"),
  inline: z.boolean(),
});

export const embedsSchema = z.object({
  avatar_url: z.string().url("Please enter a valid image URL for the avatar"),
  color: z.number(),
  author: authorSchema,
  title: z.string().max(256, "Title length must be less than 256 characters"),
  description: z.string().max(4096, "Description length must be less than 4096 characters"),
  image: z.object({url: z.string().url("Please enter a valid image URL for the embed image")}),
  fields: fieldsSchema.array().max(25, "Fields length must be less than 25 fields per embed"),
  footer: z.object({text: z.string().max(2048, "Footer text length must be less than 2048 characters"), icon_url: z.string().url("Please enter a valid image URL for the footer embed icon")}),
  thumbnail: z.object({url: z.string().url("Please enter a valid image URL for the embed thumbnail")}),
});

export const hookJsonSchema = z
  .object({
    username: z.string().max(80, "Username length must be less than 80 characters"),
    avatar_url: z.string().url("Please enter a valid image URL for the profile avatar"),
    content: z.string().max(2000, "Content length must be less than 2,000 characters"),
    embeds: embedsSchema.array().max(10, "Embeds length must be less than 10 items").optional(),
    thread_name: z.string().max(100, "Thread name length must be less than 100 characters"),
  })
  .deepPartial();
