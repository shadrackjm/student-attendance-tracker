import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { CalendarCheck, FileBarChart, GraduationCap, School, ShieldCheck, Users } from 'lucide-react';

const FEATURES = [
    {
        icon: CalendarCheck,
        title: 'Take attendance in seconds',
        description: 'A homeroom teacher marks a whole class present, absent, late, or excused in one screen — no paper register, no spreadsheet.',
    },
    {
        icon: FileBarChart,
        title: 'See problems before they grow',
        description: 'A live dashboard flags students whose attendance is slipping, with a school-wide trend so admins spot patterns early.',
    },
    {
        icon: ShieldCheck,
        title: 'Every role sees only what it needs',
        description: 'Admins manage the school, teachers take attendance for their own class, and students see just their own record.',
    },
    {
        icon: Users,
        title: 'A real school register',
        description: 'Classes, homeroom teachers, and enrolled students — organised the way a school actually works, not a generic spreadsheet.',
    },
];

const ROLES = [
    { icon: ShieldCheck, title: 'Admins', copy: 'Manage teachers, classes and students, and pull attendance reports for the whole school.' },
    { icon: School, title: 'Teachers', copy: 'Take daily attendance for their homeroom class and review the history at a glance.' },
    { icon: GraduationCap, title: 'Students', copy: 'Check their own attendance rate and see exactly which days were marked and why.' },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="AttendEase — Student Attendance Tracking" />
            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
                    <div className="flex items-center gap-2 font-semibold">
                        <CalendarCheck className="h-6 w-6 text-primary" />
                        AttendEase
                    </div>
                    <nav className="flex items-center gap-4 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 leading-normal hover:border-[#19140035] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-6xl px-6 pt-12 pb-24">
                    <section className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
                                Know who showed up, <span className="text-primary">every single day.</span>
                            </h1>
                            <p className="mt-4 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                AttendEase replaces the paper register with a class-by-class digital roster: teachers mark attendance in
                                seconds, admins see school-wide trends, and every student can check their own record.
                            </p>
                            <div className="mt-8 flex gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-6 py-2.5 text-sm font-medium text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                    >
                                        Go to dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-6 py-2.5 text-sm font-medium text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                    >
                                        Get started
                                    </Link>
                                )}
                                <a
                                    href="#features"
                                    className="inline-block rounded-sm border border-[#19140035] px-6 py-2.5 text-sm font-medium hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                >
                                    See how it works
                                </a>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#19140035] bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                            <p className="mb-4 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A]">Grade 4A — today</p>
                            <div className="space-y-2">
                                {[
                                    { name: 'Amara Otieno', status: 'Present' },
                                    { name: 'Brian Kamau', status: 'Late' },
                                    { name: 'Diana Wambui', status: 'Absent' },
                                    { name: 'Ethan Mwangi', status: 'Present' },
                                ].map((row) => (
                                    <div key={row.name} className="flex items-center justify-between rounded-lg bg-[#FDFDFC] px-3 py-2 text-sm dark:bg-[#0a0a0a]">
                                        <span>{row.name}</span>
                                        <span
                                            className={
                                                {
                                                    Present: 'text-emerald-600',
                                                    Absent: 'text-red-600',
                                                    Late: 'text-amber-600',
                                                }[row.status]
                                            }
                                        >
                                            {row.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="features" className="mt-24">
                        <h2 className="text-center text-2xl font-bold">Built for how a school actually runs</h2>
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {FEATURES.map((feature) => (
                                <div key={feature.title} className="rounded-xl border border-[#19140035] p-5 dark:border-[#3E3E3A]">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                    <h3 className="mt-3 font-semibold">{feature.title}</h3>
                                    <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-24">
                        <h2 className="text-center text-2xl font-bold">One app, three roles</h2>
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {ROLES.map((role) => (
                                <div key={role.title} className="rounded-xl border border-[#19140035] p-6 text-center dark:border-[#3E3E3A]">
                                    <role.icon className="mx-auto h-8 w-8 text-primary" />
                                    <h3 className="mt-3 font-semibold">{role.title}</h3>
                                    <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">{role.copy}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-[#19140035] py-8 text-center text-sm text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                    Built with Laravel 13, React 19 and Inertia.js — a demo project for learning purposes.
                </footer>
            </div>
        </>
    );
}
