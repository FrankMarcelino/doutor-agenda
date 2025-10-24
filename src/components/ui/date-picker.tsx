"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

dayjs.locale("pt-br");

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({
  date,
  onDateChange,
  disabled,
  placeholder = "Selecione uma data",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            dayjs(date).format("DD [de] MMMM [de] YYYY")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
