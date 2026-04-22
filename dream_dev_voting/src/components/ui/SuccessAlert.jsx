export default function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
      {message}
    </div>
  );
}
