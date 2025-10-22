import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos e sua clínicas</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <Plus size={16} />
            Adicionar Médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        {/* Future content for managing doctors can be added here */}
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
