export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: "url('/Creatorbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen w-full bg-black/40 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
