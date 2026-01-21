export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Life Platter</h1>
          <p className="text-gray-600 mt-2">料理の自炊サポートアプリ</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">{children}</div>
      </div>
    </div>
  );
}
