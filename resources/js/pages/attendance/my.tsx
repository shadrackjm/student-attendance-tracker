import { Head } from '@inertiajs/react';
import { CalendarClock, GraduationCap } from 'lucide-react';
import { dashboard } from '@/routes';
import { StatusBadge } from '@/pages/dashboard';

interface Record {
    date: string;
    status: string;
    remarks: string | null;
}

interface Props {
    className: string | null;
    attendanceRate: number;
    records: Record[];
}

export default function MyAttendance({ className, attendanceRate, records }: Props) {
    return (
        <>
            <Head title="My Attendance" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">My Attendance</h1>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <GraduationCap className="h-5 w-5" />
                            <span className="text-sm">Class</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold">{className ?? '—'}</p>
                    </div>
                    <div className="rounded-xl border p-5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarClock className="h-5 w-5" />
                            <span className="text-sm">Attendance rate</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold">{attendanceRate}%</p>
                    </div>
                </div>

                <div className="rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                                        No attendance recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3 font-medium">{record.date}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={record.status} />
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{record.remarks ?? '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

MyAttendance.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Attendance', href: '/my-attendance' },
    ],
};
