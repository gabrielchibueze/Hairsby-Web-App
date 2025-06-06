import { InviteEmployeeForm } from "../../components/InviteEmployeeForm";

export default function InviteSpecialistsPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Onboard a new Specialist
        </h1>
        <p className="text-muted-foreground">
          Quickly invite a new specilist to your team
        </p>
      </div>
      <InviteEmployeeForm />
    </div>
  );
}
