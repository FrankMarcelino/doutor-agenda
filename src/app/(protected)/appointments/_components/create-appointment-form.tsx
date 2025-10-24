"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useAction } from "next-safe-action/hooks";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createAppointment } from "@/actions/create-appointment";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/schema";

const formSchema = z.object({
  patientId: z.string().min(1, {
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().min(1, {
    message: "Médico é obrigatório.",
  }),
  date: z.date(),
  time: z.string().min(1, {
    message: "Horário é obrigatório.",
  }),
});

interface CreateAppointmentFormProps {
  patients: Array<typeof patientsTable.$inferSelect>;
  doctors: Array<typeof doctorsTable.$inferSelect>;
  onSuccess?: () => void;
}

const CreateAppointmentForm = ({
  patients,
  doctors,
  onSuccess,
}: CreateAppointmentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: undefined,
      time: "",
    },
  });

  const createAppointmentAction = useAction(createAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar agendamento.");
    },
  });

  const watchedDoctorId = form.watch("doctorId");
  const watchedPatientId = form.watch("patientId");
  const watchedDate = form.watch("date");

  const selectedDoctor = useMemo(() => {
    return doctors.find((doctor) => doctor.id === watchedDoctorId);
  }, [watchedDoctorId, doctors]);

  // Gera os horários disponíveis baseado no médico selecionado
  const availableTimes = useMemo(() => {
    if (!selectedDoctor) return [];

    const times: string[] = [];
    const fromTime = selectedDoctor.availableFromTime;
    const toTime = selectedDoctor.availableToTime;

    const [fromHour, fromMinute] = fromTime.split(":").map(Number);
    const [toHour, toMinute] = toTime.split(":").map(Number);

    const startMinutes = fromHour * 60 + fromMinute;
    const endMinutes = toHour * 60 + toMinute;

    // Gera horários de 30 em 30 minutos
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      times.push(
        `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`,
      );
    }

    return times;
  }, [selectedDoctor]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Combina data e hora
    const [hours, minutes] = values.time.split(":").map(Number);
    const appointmentDate = dayjs(values.date)
      .set("hour", hours)
      .set("minute", minutes)
      .set("second", 0)
      .toDate();

    createAppointmentAction.execute({
      patientId: values.patientId,
      doctorId: values.doctorId,
      date: appointmentDate,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>
          Crie um novo agendamento para um paciente.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
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
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={!watchedPatientId || !watchedDoctorId}
                    placeholder="Selecione a data"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!watchedDoctorId || !watchedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={createAppointmentAction.isPending}>
              {createAppointmentAction.isPending
                ? "Criando..."
                : "Criar agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateAppointmentForm;
