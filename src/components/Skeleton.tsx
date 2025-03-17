export default function Skeleton() {
  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="h-[307px] bg-gray-200 rounded-t-xl mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full max-w-[100px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full max-w-[270px] mb-2.5"></div>
      <span className="sr-only">იტვირთება...</span>
    </div>
  );
}
