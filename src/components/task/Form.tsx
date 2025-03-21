"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import TaskSchema from "@/schemas/task-form";
import usePriority from "@/hooks/usePriority";
import useStatus from "@/hooks/useStatus";
import useDepartment from "@/hooks/useDepartment";
import { useEffect, useState } from "react";
import useEmployees from "@/hooks/useEmployee";

import apiKey from "../../keys/apiKey";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

export default function TaskForm() {
  const navigate = useNavigate();

  const {
    priorities,
    error: priorityError,
    loading: priorityLoading,
  } = usePriority();

  const { statuses, error: statusError, loading: statusLoading } = useStatus();

  const {
    departments,
    error: departmentError,
    loading: departmentLoading,
  } = useDepartment();

  const {
    employees,
    error: employeeError,
    loading: employeeLoading,
  } = useEmployees();

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      status: "",
      deadline: getTomorrowDate(),
      department: "",
      employee: "",
    },
  });

  const formValues = form.watch();
  console.log(formValues);

  const loading =
    priorityLoading || statusLoading || departmentLoading || employeeLoading;
  const error =
    priorityError ||
    statusError ||
    departmentError ||
    employeeError ||
    createError;

  useEffect(() => {
    try {
      localStorage.removeItem("selected");

      const savedFormValues = localStorage.getItem("taskFormValues");
      if (savedFormValues) {
        const parsedValues = JSON.parse(savedFormValues);

        if (parsedValues.deadline) {
          parsedValues.deadline = new Date(parsedValues.deadline);
        }

        form.reset(parsedValues);
      }
    } catch (error) {
      console.error("Error loading form values from localStorage:", error);
    }
  }, [form]);

  useEffect(() => {
    if (!priorityLoading && priorities.length > 0) {
      const mediumPriority = priorities.find((p) => p.name === "საშუალო");
      if (mediumPriority) {
        form.setValue("priority", String(mediumPriority.id));
      }
    }

    if (!statusLoading && statuses.length > 0) {
      const startedStatus = statuses.find((s) => s.name === "დასაწყები");
      if (startedStatus) {
        form.setValue("status", String(startedStatus.id));
      }
    }
  }, [priorities, loading, statuses, form, statusLoading, priorityLoading]);

  useEffect(() => {
    const hasValues = Object.values(formValues).some(
      (val) => val !== "" && val !== null && val !== undefined
    );

    if (hasValues) {
      try {
        const valuesToSave = {
          ...formValues,
          deadline:
            formValues.deadline instanceof Date
              ? formValues.deadline.toISOString()
              : formValues.deadline,
        };

        localStorage.setItem("taskFormValues", JSON.stringify(valuesToSave));
      } catch (error) {
        console.error("Error saving form values to localStorage:", error);
      }
    }
  }, [formValues]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">შეცდომა, რაღაც არასწორად წავიდა...</p>
      </div>
    );
  }

  if (loading || createLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-12 text-primary animate-spin" />
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof TaskSchema>) {
    try {
      setCreateLoading(true);

      const body = {
        name: values.title.trim(),
        description: values?.description ? values.description.trim() : "",
        due_date: values.deadline.toISOString().split("T")[0],
        priority_id: Number(values.priority),
        status_id: Number(values.status),
        employee_id: Number(values.employee),
      };

      const response = await fetch(
        "https://momentum.redberryinternship.ge/api/tasks",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log("Task created successfully:", data);

      form.reset({
        title: "",
        description: "",
        priority:
          priorities.find((p) => p.name === "საშუალო")?.id.toString() || "",
        status:
          statuses.find((s) => s.name === "დასაწყები")?.id.toString() || "",
        deadline: getTomorrowDate(),
        department: "",
        employee: "",
      });

      localStorage.removeItem("taskFormValues");
      navigate("/");
    } catch (err: any) {
      setCreateError(err instanceof Error ? err : new Error(err.message));
      console.error(err);
      alert("შეცდომა, დავალების შექმნისას მოხდა შეცდომა");
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <section className="max-w-[1684px] mx-auto font-firago mb-[100px]">
      <h1 className="text-[34px] font-semibold text-customGreyHeadline mt-10 mb-7">
        შექმენი ახალი დავალება
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-y-[57px] gap-x-[162px] bg-[#FBF9FFA6] border border-[#DDD2FF] rounded-[4px] pr-[368px] py-[65px] pl-[55px] text-customGreySecondary"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="title" className="block">
                  სათაური*
                </FormLabel>
                <FormControl>
                  <Input id="title" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="department" className="block">
                  დეპარტამენტი*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className=""
                        placeholder="აირჩიეთ დეპარტამენტი"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        value={String(department.id)}
                        key={department.id}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>აღწერა</FormLabel>
                <FormControl>
                  <Textarea className="w-[550px] h-[133px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employee"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  htmlFor="department"
                  className={`block ${
                    !formValues.department ? "text-[#ADB5BD]" : ""
                  } `}
                >
                  პასუხისმგებელი თანამშრომელი*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={!formValues.department}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees
                      .filter(
                        (employee) =>
                          String(employee.department.id) ===
                          formValues.department
                      )
                      .map((employee) => (
                        <SelectItem
                          value={String(employee.id)}
                          key={employee.id}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={employee.avatar}
                                alt={employee.name}
                              />
                              <AvatarFallback>TS</AvatarFallback>
                            </Avatar>
                            <span>
                              {employee.name} {employee.surname}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start gap-8">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="department" className="block">
                    პრიორიტეტი*
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[260px]">
                        <div className="flex items-center gap-2">
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[260px]">
                      {priorities.map((priority) => (
                        <SelectItem
                          value={String(priority.id)}
                          key={priority.id}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={priority.icon}
                              alt="priority"
                              className="w-[16px] h-[16px]"
                            />
                            <span>{priority.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="department" className="block">
                    სტატუსი*
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[260px]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[260px]">
                      {statuses.map((status) => (
                        <SelectItem value={String(status.id)} key={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="deadline" className="block">
                  დედლაინი*
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    // Disables past dates
                    min={new Date().toISOString().substring(0, 10)}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().substring(0, 10)
                        : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-8 col-start-2 col-end-3">
            <Button
              disabled={Object.keys(form.formState.errors).length > 0}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-normal cursor-pointer active:scale-95"
            >
              დავალების შექმნა
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
