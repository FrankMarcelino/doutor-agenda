"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import AppointmentsTableActions from "./table-actions";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect;
  doctor: typeof doctorsTable.$inferSelect;
};

export const createAppointmentsTableColumns = (
  patients: Array<typeof patientsTable.$inferSelect>,
  doctors: Array<typeof doctorsTable.$inferSelect>,
): ColumnDef<Appointment>[] => [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "Médico",
    cell: (params) => {
      const appointment = params.row.original;
      return `Dr(a). ${appointment.doctor.name}`;
    },
  },
  {
    id: "specialty",
    accessorKey: "doctor.specialty",
    header: "Especialidade",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data",
    cell: (params) => {
      const appointment = params.row.original;
      return dayjs(appointment.date).format("DD/MM/YYYY");
    },
  },
  {
    id: "time",
    accessorKey: "date",
    header: "Horário",
    cell: (params) => {
      const appointment = params.row.original;
      return dayjs(appointment.date).format("HH:mm");
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return (
        <AppointmentsTableActions
          appointment={appointment}
          patients={patients}
          doctors={doctors}
        />
      );
    },
  },
];
