import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Trash } from "lucide-react";
import { useGetBlacklistQuery } from "@/api/queries/get-blacklist";
import { useAddToBlacklistMutation } from "@/api/queries/add-blacklist";
import { useRemoveFromBlacklistMutation } from "@/api/queries/remove-blacklist";

const settingsFormSchema = z.object({
  toxicity_classification_model_name: z.string().min(1, "Имя модели обязательно"),
});

const blacklistFormSchema = z.object({
  blacklist_item: z.string().min(4, "Фраза должна быть длинее 4 символов"),
});

const SettingsForm = () => {
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      toxicity_classification_model_name: "detoxify",
    },
  });

  const isValueChanged = form.getFieldState("toxicity_classification_model_name").isDirty;

  const onSubmit = useCallback((data: z.infer<typeof settingsFormSchema>) => {
    console.log("Submitted settings:", data);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="toxicity_classification_model_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название модели для классификации текста</FormLabel>
              <FormControl>
                <Input placeholder="detoxify" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer" disabled={!isValueChanged}>
          Сохранить настройки
        </Button>
      </form>
    </Form>
  );
};

const BlacklistList = () => {
  const blacklist = useGetBlacklistQuery();
  const remove = useRemoveFromBlacklistMutation();

  const handleRemoveClick = useCallback(
    async (id: string | number) => {
      await remove.mutateAsync(id);
    },
    [remove]
  );

  if (blacklist.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {blacklist.data?.map((ent) => {
        return (
          <div key={ent.id} className="w-full flex gap-2">
            <span className="flex-1">{ent.phrase}</span>
            <Button size="icon" variant="ghost" onClick={() => handleRemoveClick(ent.id)} disabled={remove.isPending}>
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const BlacklistForm = () => {
  const add = useAddToBlacklistMutation();

  const form = useForm<z.infer<typeof blacklistFormSchema>>({
    resolver: zodResolver(blacklistFormSchema),
    defaultValues: {
      blacklist_item: "",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof blacklistFormSchema>) => {
      await add.mutateAsync(data.blacklist_item);
      form.reset();
    },
    [add, form]
  );

  return (
    <div className="flex flex-col gap-4">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Черный список</h4>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="blacklist_item"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Запрещенная фраза</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    <Input placeholder="..." {...field} />
                    <Button type="submit" variant="outline" size="icon" className="ml-2" disabled={add.isPending}>
                      <Check />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <BlacklistList />
    </div>
  );
};

export default function SettingsSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Настройки</h3>
        </SheetHeader>
        <div className="px-4">
          {/* <SettingsForm />
          <Separator /> */}
          <BlacklistForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
