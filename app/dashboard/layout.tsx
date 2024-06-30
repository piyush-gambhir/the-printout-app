import AsideBar from "@/components/AsideBar";

};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AsideBar />
        {children}
     
    </div>
  );
}
