import { Head, Link } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';
import { dashboard } from '@/routes';

interface ClassRow {
    id: number;
    name: string;
    students_count: number;
    taken_today: boolean;
}

interface Props {
    classes: ClassRow[];
}

export default function AttendanceIndex({ classes }: Props) {
    return (
        <>
            <Head title="Take Attendance" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Take Attendance</h1>

                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <CalendarCheck className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No homeroom class assigned</p>
                        <p className="mt-1 text-sm text-muted-foreground">Ask an admin to make you the homeroom teacher for a class.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {classes.map((c) => (
                            <div key={c.id} className="rounded-xl border p-5">
                                <p className="text-lg font-semibold">{c.name}</p>
                                <p className="mb-4 text-sm text-muted-foreground">{c.students_count} students</p>
                                <div className="flex items-center justify-between">
                                    {c.taken_today ? (
                                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                                            Taken today
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">Not taken</span>
                                    )}
                                    <div className="flex gap-3 text-sm">
                                        <Link href={`/attendance/${c.id}/take`} className="text-primary hover:underline">
                                            {c.taken_today ? 'Review today' : 'Take now'}
                                        </Link>
                                        <Link href={`/attendance/${c.id}/history`} className="text-muted-foreground hover:underline">
                                            History
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Take Attendance', href: '/attendance' },
    ],
};
