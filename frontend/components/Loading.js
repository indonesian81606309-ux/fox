import { ClipLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  );
}
