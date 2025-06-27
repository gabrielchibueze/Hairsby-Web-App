// app/provider/management/branches/invite/page.tsx

import { InviteBranchForm } from "../components/InviteBranchForm";

export default function InviteBranchPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Create a new Branch
        </h1>
        <p className="text-muted-foreground">
          Invite a new branch location for your business
        </p>
      </div>
      <InviteBranchForm />
    </div>
  );
}
