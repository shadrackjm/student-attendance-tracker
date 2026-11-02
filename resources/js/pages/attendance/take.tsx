import { Head, router, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { toast } from 'sonner';
import type { AttendanceStatus, RosterEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';

interface Props {
    class: { id: number; name: string };
    date: string;
    alreadyTaken: boolean;
    roster: RosterEntry[];
}

const STATUSES: { value: AttendanceStatus; label: string }[] = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' },
];

export default function TakeAttendance({ class: schoolClass, date, alreadyTaken, roster }: Props) {
    const form = useForm({
        date,
        records: roster.map((entry) => ({ student_id: entry.id, status: entry.status, remarks: entry.remarks ?? '' })),
    });

    function setStatus(studentId: number, status: AttendanceStatus) {
        form.setData(
            'records',
            form.data.records.map((r) => (r.student_id === studentId ? { ...r, status } : r)),
        );
    }

    function setRemarks(studentId: number, remarks: string) {
        form.setData(
            'records',
            form.data.records.map((r) => (r.student_id === studentId ? { ...r, remarks } : r)),
        );
    }

    function markAllPresent() {
        form.setData(
            'records',
            form.data.records.map((r) => ({ ...r, status: 'present' as AttendanceStatus })),
        );
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post(`/attendance/${schoolClass.id}`, {
            onSuccess: () => toast.success(`Attendance saved for ${date}.`),
        });
    }

    function changeDate(newDate: string) {
        router.get(`/attendance/${schoolClass.id}/take`, { date: newDate }, { preserveState: true });
    }

    return (
        <>
            <Head title={`Take Attendance — ${schoolClass.name}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{schoolClass.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {alreadyTaken ? 'Already recorded — you can still correct it below.' : 'Not yet recorded for this day.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input type="date" value={date} onChange={(e) => changeDate(e.target.value)} className="w-auto" />
                        <Button type="button" variant="outline" onClick={markAllPresent}>
                            Mark all present
                        </Button>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Student</th>
                                    <th className="px-4 py-3 text-left font-medium">Admission No</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {roster.map((entry) => {
                                    const record = form.data.records.find((r) => r.student_id === entry.id)!;

                                    return (
                                        <tr key={entry.id}>
                                            <td className="px-4 py-3 font-medium">{entry.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{entry.admission_no}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1">
                                                    {STATUSES.map((s) => (
                                                        <button
                                                            key={s.value}
                                                            type="button"
                                                            onClick={() => setStatus(entry.id, s.value)}
                                                            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                                                record.status === s.value
                                                                    ? statusActiveClass(s.value)
                                                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                                            }`}
                                                        >
                                                            {s.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Input
                                                    value={record.remarks}
                                                    onChange={(e) => setRemarks(entry.id, e.target.value)}
                                                    placeholder="Optional note…"
                                                    className="h-8"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving…' : 'Save attendance'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

function statusActiveClass(status: AttendanceStatus): string {
    return {
        present: 'bg-emerald-500 text-white',
        absent: 'bg-red-500 text-white',
        late: 'bg-amber-500 text-white',
        excused: 'bg-blue-500 text-white',
    }[status];
}

TakeAttendance.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Take Attendance', href: '/attendance' },
    ],
};
