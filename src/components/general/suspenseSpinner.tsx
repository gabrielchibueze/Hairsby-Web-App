import Spinner from "@/components/general/spinner";

export default function SuspenseSpinner() {
  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <Spinner plain={false} size="lg" />
    </div>
  );
}
