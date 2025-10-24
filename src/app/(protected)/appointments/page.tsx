import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddAppointmentButton from "./_components/add-appointment-button";

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
    }),
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session.user.clinic.id),
    }),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session.user.clinic.id),
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              Nenhum agendamento encontrado.
            </p>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{appointment.patient.name}</p>
                    <p className="text-muted-foreground text-sm">
                      Dr(a). {appointment.doctor.name} -{" "}
                      {appointment.doctor.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {new Date(appointment.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
