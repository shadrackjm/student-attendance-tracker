import { Head, router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { SchoolClass, Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import { dashboard } from '@/routes';

interface Props {
    students: Student[];
    classes: Pick<SchoolClass, 'id' | 'name'>[];
}

const emptyCreate = {
    name: '',
    admission_no: '',
    school_class_id: '',
    guardian_name: '',
    guardian_phone: '',
    date_of_birth: '',
    gender: '',
    create_login: false,
    email: '',
};

const emptyEdit = {
    name: '',
    admission_no: '',
    school_class_id: '',
    guardian_name: '',
    guardian_phone: '',
    date_of_birth: '',
    gender: '',
};

export default function StudentsIndex({ students, classes }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);

    const createForm = useForm({ ...emptyCreate });
    const editForm = useForm({ ...emptyEdit });

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        createForm.post('/students', {
            onSuccess: () => {
                toast.success('Student enrolled.');
                setShowCreate(false);
                createForm.reset();
            },
        });
    }

    function openEdit(student: Student) {
        setEditing(student);
        editForm.setData({
            name: student.name,
            admission_no: student.admission_no,
            school_class_id: student.school_class_id ? String(student.school_class_id) : '',
            guardian_name: student.guardian_name ?? '',
            guardian_phone: student.guardian_phone ?? '',
            date_of_birth: student.date_of_birth ?? '',
            gender: student.gender ?? '',
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editing) return;
        editForm.patch(`/students/${editing.id}`, {
            onSuccess: () => {
                toast.success('Student updated.');
                setEditing(null);
            },
        });
    }

    function handleDelete(student: Student) {
        if (!confirm(`Remove ${student.name} from the school register?`)) return;
        router.delete(`/students/${student.id}`, {
            onSuccess: () => toast.success('Student removed.'),
        });
    }

    return (
        <>
            <Head title="Students" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Enrol Student
                    </Button>
                </div>

                {students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <GraduationCap className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No students yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Enrol your first student to start taking attendance.</p>
                        <Button className="mt-4" onClick={() => setShowCreate(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Enrol Student
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Admission No</th>
                                    <th className="px-4 py-3 text-left font-medium">Class</th>
                                    <th className="px-4 py-3 text-left font-medium">Guardian</th>
                                    <th className="px-4 py-3 text-right font-medium">Attendance</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3 font-medium">{student.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{student.admission_no}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{student.school_class?.name ?? 'Unassigned'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{student.guardian_name ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">{student.attendance_rate}%</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(student)} className="text-muted-foreground hover:text-foreground" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(student)} className="text-muted-foreground hover:text-destructive" title="Remove">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Dialog open={showCreate} onOpenChange={(open) => { if (!open) { setShowCreate(false); createForm.reset(); } }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Enrol Student</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div>
                            <Label htmlFor="s-name">Full name</Label>
                            <Input id="s-name" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} autoFocus />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="s-admission">Admission number</Label>
                            <Input id="s-admission" value={createForm.data.admission_no} onChange={(e) => createForm.setData('admission_no', e.target.value)} placeholder="ADM-00042" />
                            <InputError message={createForm.errors.admission_no} />
                        </div>
                        <div>
                            <Label>Class</Label>
                            <Select value={createForm.data.school_class_id} onValueChange={(value) => createForm.setData('school_class_id', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.school_class_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="s-guardian-name">Guardian name</Label>
                                <Input id="s-guardian-name" value={createForm.data.guardian_name} onChange={(e) => createForm.setData('guardian_name', e.target.value)} />
                                <InputError message={createForm.errors.guardian_name} />
                            </div>
                            <div>
                                <Label htmlFor="s-guardian-phone">Guardian phone</Label>
                                <Input id="s-guardian-phone" value={createForm.data.guardian_phone} onChange={(e) => createForm.setData('guardian_phone', e.target.value)} />
                                <InputError message={createForm.errors.guardian_phone} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                            <Checkbox
                                id="s-create-login"
                                checked={createForm.data.create_login}
                                onCheckedChange={(checked) => createForm.setData('create_login', checked === true)}
                            />
                            <Label htmlFor="s-create-login" className="cursor-pointer font-normal">
                                Give this student a portal login (for older students who check their own attendance)
                            </Label>
                        </div>
                        {createForm.data.create_login && (
                            <div>
                                <Label htmlFor="s-email">Login email</Label>
                                <Input id="s-email" type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} placeholder="student@school.test" />
                                <InputError message={createForm.errors.email} />
                            </div>
                        )}
                        <div className="flex justify-end gap-2 pt-1">
                            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); createForm.reset(); }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Enrolling…' : 'Enrol'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div>
                            <Label htmlFor="se-name">Full name</Label>
                            <Input id="se-name" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} autoFocus />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="se-admission">Admission number</Label>
                            <Input id="se-admission" value={editForm.data.admission_no} onChange={(e) => editForm.setData('admission_no', e.target.value)} />
                            <InputError message={editForm.errors.admission_no} />
                        </div>
                        <div>
                            <Label>Class</Label>
                            <Select value={editForm.data.school_class_id} onValueChange={(value) => editForm.setData('school_class_id', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.school_class_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="se-guardian-name">Guardian name</Label>
                                <Input id="se-guardian-name" value={editForm.data.guardian_name} onChange={(e) => editForm.setData('guardian_name', e.target.value)} />
                                <InputError message={editForm.errors.guardian_name} />
                            </div>
                            <div>
                                <Label htmlFor="se-guardian-phone">Guardian phone</Label>
                                <Input id="se-guardian-phone" value={editForm.data.guardian_phone} onChange={(e) => editForm.setData('guardian_phone', e.target.value)} />
                                <InputError message={editForm.errors.guardian_phone} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Saving…' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Students', href: '/students' },
    ],
};
