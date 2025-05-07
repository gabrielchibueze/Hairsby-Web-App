export default function Spinner({ plain }: { plain?: boolean }) {
  if (plain) {
    return (
      <span className="animate-spin border-b-2 h-6 w-6 border-gray-50 rounded-full"></span>
    );
  } else {
    return (
      <div className="animate-spin w-8 h-8 border-b-2 rounded-full absolute border-hairsby-orange"></div>
    );
  }
}
