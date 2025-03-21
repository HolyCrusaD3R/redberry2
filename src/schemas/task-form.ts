import { z } from "zod";

// This Counts words by splitting on whitespace and filtering out empty strings. In assignment it is mentioned, that 4 words is minimum, if user types and maximum 255 symbols (I don't know what happens when 4 words are more than 255 symbols, but it is highely unlikely for this assignment).
const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

const TaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "სათაური უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს" })
    .max(255, { message: "სათაური უნდა შეიცავდეს მაქსიმუმ 255 სიმბოლოს" }),

  description: z
    .string()
    .max(255, { message: "აღწერა უნდა შეიცავდეს მაქსიმუმ 255 სიმბოლოს" })
    .refine((val) => val === "" || countWords(val) >= 4, {
      message: "აღწერა უნდა შეიცავდეს მინიმუმ 4 სიტყვას",
    })
    .optional()
    .or(z.literal("")),

  priority: z.string().min(1, { message: "პრიორიტეტის არჩევა სავალდებულოა" }),

  status: z.string().min(1, { message: "სტატუსის არჩევა სავალდებულოა" }),

  department: z
    .string()
    .min(1, { message: "დეპარტამენტის არჩევა სავალდებულოა" }),

  employee: z
    .string()
    .min(1, { message: "პასუხისმგებელი თანამშრომლის არჩევა სავალდებულოა" }),

  deadline: z
    .date({
      required_error: "დედლაინის არჩევა სავალდებულოა",
    })
    .refine((date) => date > new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "დედლაინი არ შეიძლება იყოს წარსული თარიღი",
    }),
});

export default TaskSchema;
