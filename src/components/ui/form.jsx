import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./FormComponents";

export default function MyForm() {
  const methods = useForm({ defaultValues: { email: "" } });

  const onSubmit = (data) => console.log(data);

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          control={methods.control}
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl asChild>
                <input {...field} type="email" placeholder="Enter your email" className="input" />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </Form>
  );
}
