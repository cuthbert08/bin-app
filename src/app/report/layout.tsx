export default function ReportIssueLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex items-center justify-center min-h-screen">
            {children}
        </main>
    );
}
