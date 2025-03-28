export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-grow items-center justify-center">
      {children}
    </div>
  );
}
