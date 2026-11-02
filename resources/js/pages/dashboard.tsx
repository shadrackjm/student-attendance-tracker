import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CalendarCheck, CalendarClock, GraduationCap, School, Users } from 'lucide-react';
import { dashboard } from '@/routes';

interface Trend {
    date: string;
    rate: number | null;
}

interface ClassBreakdown {
    id: number;
    name: string;
    students_count: number;
    teacher: string | null;
}

interface AtRiskStudent {
    id: number;
    name: string;
    class: string | null;
    attendance_rate: number;
}

interface TeacherClass {
    id: number;
    name: string;
    students_count: number;
    taken_today: boolean;
}

interface RecentRecord {
    date: string;
    status: string;
}

interface Props {
    role: 'admin' | 'teacher' | 'student';
    stats?: { classes: number; teachers: number; students: number; sessions_today: number };
    trend?: Trend[];
    classBreakdown?: ClassBreakdown[];
    atRiskStudents?: AtRiskStudent[];
    hasTeacherRecord?: boolean;
    classes?: TeacherClass[];
    hasStudentRecord?: boolean;
    attendanceRate?: number;
    className?: string | null;
    recent?: RecentRecord[];
}

export default function Dashboard({
    role,
    stats,
    trend,
    classBreakdown,
    atRiskStudents,
    hasTeacherRecord,
    classes,
    hasStudentRecord,
    attendanceRate,
    className,
    recent,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {role === 'admin' && (
                    <AdminDashboard
                        stats={stats!}
                        trend={trend ?? []}
                        classBreakdown={classBreakdown ?? []}
                        atRiskStudents={atRiskStudents ?? []}
                    />
                )}
                {role === 'teacher' && <TeacherDashboard hasTeacherRecord={!!hasTeacherRecord} classes={classes ?? []} />}
                {role === 'student' && (
                    <StudentDashboard
                        hasStudentRecord={!!hasStudentRecord}
                        attendanceRate={attendanceRate ?? 0}
                        className={className ?? null}
                        recent={recent ?? []}
                    />
                )}
            </div>
        </>
    );
}

function AdminDashboard({
    stats,
    trend,
    classBreakdown,
    atRiskStudents,
}: {
    stats: { classes: number; teachers: number; students: number; sessions_today: number };
    trend: Trend[];
    classBreakdown: ClassBreakdown[];
    atRiskStudents: AtRiskStudent[];
}) {
    const maxStudents = Math.max(1, ...classBreakdown.map((c) => c.students_count));

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<School className="h-5 w-5" />} label="Classes" value={stats.classes} />
                <StatCard icon={<Users className="h-5 w-5" />} label="Teachers" value={stats.teachers} />
                <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Students" value={stats.students} />
                <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="Registers taken today" value={stats.sessions_today} />
            </div>

            <div className="rounded-xl border p-5">
                <h2 className="mb-4 font-semibold">Attendance rate, last 14 school days</h2>
                <div className="flex h-40 items-end gap-1">
                    {trend.map((point) => (
                        <div key={point.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                            <div
                                className="w-full rounded-t bg-primary"
                                style={{ height: `${point.rate ?? 0}%` }}
                                title={`${point.date}: ${point.rate ?? 'no data'}%`}
                            />
                            <span className="text-[10px] text-muted-foreground">{point.date.split(' ')[1]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border p-5">
                    <h2 className="mb-4 font-semibold">Students per class</h2>
                    {classBreakdown.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No classes yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {classBreakdown.map((c) => (
                                <div key={c.id}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span>
                                            {c.name} <span className="text-muted-foreground">· {c.teacher ?? 'unassigned'}</span>
                                        </span>
                                        <span className="font-medium">{c.students_count}</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{ width: `${(c.students_count / maxStudents) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">Students to watch</h2>
                        <Link href="/reports" className="text-sm text-primary hover:underline">
                            View reports
                        </Link>
                    </div>
                    {atRiskStudents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attendance concerns right now.</p>
                    ) : (
                        <div className="divide-y">
                            {atRiskStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between py-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-muted-foreground">{student.class}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-muted-foreground">{student.attendance_rate}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function TeacherDashboard({ hasTeacherRecord, classes }: { hasTeacherRecord: boolean; classes: TeacherClass[] }) {
    if (!hasTeacherRecord) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Your account is not yet linked to a teacher record. Ask an admin to link it from the Teachers page.
            </div>
        );
    }

    return (
        <div className="rounded-xl border p-5">
            <h2 className="mb-4 font-semibold">Your classes</h2>
            {classes.length === 0 ? (
                <p className="text-sm text-muted-foreground">You are not the homeroom teacher for any class yet.</p>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {classes.map((c) => (
                        <Link
                            key={c.id}
                            href={`/attendance/${c.id}/take`}
                            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/40"
                        >
                            <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-xs text-muted-foreground">{c.students_count} students</p>
                            </div>
                            {c.taken_today ? (
                                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                                    Taken today
                                </span>
                            ) : (
                                <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">Not taken</span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function StudentDashboard({
    hasStudentRecord,
    attendanceRate,
    className,
    recent,
}: {
    hasStudentRecord: boolean;
    attendanceRate: number;
    className: string | null;
    recent: RecentRecord[];
}) {
    if (!hasStudentRecord) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Your account is not yet linked to a student record. Ask an admin to link it from the Students page.
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Class" value={className ?? '—'} />
                <StatCard icon={<CalendarClock className="h-5 w-5" />} label="Attendance rate" value={`${attendanceRate}%`} />
            </div>
            <div className="rounded-xl border p-5">
                <h2 className="mb-4 font-semibold">Recent days</h2>
                {recent.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>
                ) : (
                    <div className="divide-y">
                        {recent.map((r, i) => (
                            <div key={i} className="flex items-center justify-between py-2 text-sm">
                                <span>{r.date}</span>
                                <StatusBadge status={r.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        present: 'bg-emerald-500/10 text-emerald-600',
        absent: 'bg-red-500/10 text-red-600',
        late: 'bg-amber-500/10 text-amber-600',
        excused: 'bg-blue-500/10 text-blue-600',
    };

    return (
        <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${styles[status] ?? 'bg-muted text-muted-foreground'}`}>
            {status}
        </span>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
    return (
        <div className="rounded-xl border p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
