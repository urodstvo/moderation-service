import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComboboxProps = {
  options: Array<{ value: string; label: string }>;
  hasSearch?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export function Combobox({ options = [], hasSearch, value = '', onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-xs justify-between">
          {internalValue ? options.find((option) => option.value === internalValue)?.label : "Выберите вариант"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-xs p-0">
        <Command>
          {hasSearch && <CommandInput placeholder="" />}
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setInternalValue(currentValue === internalValue ? "" : currentValue);
                    if (typeof onChange === 'function') onChange(currentValue === internalValue ? "" : currentValue)
                    setOpen(false);
                  }}
                >
                  <CheckIcon className={cn("mr-2 h-4 w-4", internalValue === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
