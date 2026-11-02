import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface ClassRate {
    id: number;
    name: string;
    students_count: number;
    average_rate: number;
}

interface Props {
    classRates: ClassRate[];
}

export default function ReportsIndex({ classRates }: Props) {
    return (
        <>
            <Head title="Reports" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <Button asChild>
                        <a href="/reports/attendance.csv">
                            <Download className="mr-2 h-4 w-4" />
                            Export attendance CSV
                        </a>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Class</th>
                                <th className="px-4 py-3 text-right font-medium">Students</th>
                                <th className="px-4 py-3 text-right font-medium">Average attendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {classRates.map((c) => (
                                <tr key={c.id} className="hover:bg-muted/20">
                                    <td className="px-4 py-3 font-medium">{c.name}</td>
                                    <td className="px-4 py-3 text-right">{c.students_count}</td>
                                    <td className="px-4 py-3 text-right">{c.average_rate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Reports', href: '/reports' },
    ],
};
