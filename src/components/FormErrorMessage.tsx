
import { XCircleIcon } from "@heroicons/react/24/outline"

function FormErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-6 w-6 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default FormErrorMessage;