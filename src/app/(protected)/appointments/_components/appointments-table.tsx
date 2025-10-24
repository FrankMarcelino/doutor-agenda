"use client";

import { DataTable } from "@/components/ui/data-table";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import { createAppointmentsTableColumns } from "./table-columns";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect;
  doctor: typeof doctorsTable.$inferSelect;
};

interface AppointmentsTableProps {
  appointments: Appointment[];
  patients: Array<typeof patientsTable.$inferSelect>;
  doctors: Array<typeof doctorsTable.$inferSelect>;
}

const AppointmentsTable = ({
  appointments,
  patients,
  doctors,
}: AppointmentsTableProps) => {
  const columns = createAppointmentsTableColumns(patients, doctors);

  return <DataTable columns={columns} data={appointments} />;
};

export default AppointmentsTable;
