import { Head, Link } from '@inertiajs/react';
import type { AttendanceSessionSummary } from '@/types';
import { dashboard } from '@/routes';

interface Props {
    class: { id: number; name: string };
    sessions: AttendanceSessionSummary[];
}

export default function AttendanceHistory({ class: schoolClass, sessions }: Props) {
    return (
        <>
            <Head title={`Attendance History — ${schoolClass.name}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{schoolClass.name} — History</h1>
                    <Link href={`/attendance/${schoolClass.id}/take`} className="text-sm text-primary hover:underline">
                        Take today's attendance
                    </Link>
                </div>

                {sessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed py-24 text-center text-sm text-muted-foreground">
                        No attendance has been recorded for this class yet.
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-right font-medium">Present</th>
                                    <th className="px-4 py-3 text-right font-medium">Absent</th>
                                    <th className="px-4 py-3 text-right font-medium">Late</th>
                                    <th className="px-4 py-3 text-right font-medium">Excused</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3 font-medium">{session.date}</td>
                                        <td className="px-4 py-3 text-right text-emerald-600">{session.present_count}</td>
                                        <td className="px-4 py-3 text-right text-red-600">{session.absent_count}</td>
                                        <td className="px-4 py-3 text-right text-amber-600">{session.late_count}</td>
                                        <td className="px-4 py-3 text-right text-blue-600">{session.excused_count}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/attendance/${schoolClass.id}/take?date=${session.date}`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                View / edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

AttendanceHistory.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Take Attendance', href: '/attendance' },
        { title: 'History', href: '#' },
    ],
};
