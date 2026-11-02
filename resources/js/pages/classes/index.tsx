import { Head, router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { SchoolClass, Teacher } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Pencil, Plus, School, Trash2 } from 'lucide-react';
import { dashboard } from '@/routes';

interface Props {
    classes: SchoolClass[];
    teachers: Teacher[];
}

const emptyForm = { name: '', grade_level: '', homeroom_teacher_id: '', capacity: '35' };

export default function ClassesIndex({ classes, teachers }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<SchoolClass | null>(null);

    const createForm = useForm({ ...emptyForm });
    const editForm = useForm({ ...emptyForm });

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        createForm.post('/classes', {
            onSuccess: () => {
                toast.success('Class created.');
                setShowCreate(false);
                createForm.reset();
            },
        });
    }

    function openEdit(schoolClass: SchoolClass) {
        setEditing(schoolClass);
        editForm.setData({
            name: schoolClass.name,
            grade_level: schoolClass.grade_level,
            homeroom_teacher_id: schoolClass.homeroom_teacher_id ? String(schoolClass.homeroom_teacher_id) : '',
            capacity: String(schoolClass.capacity),
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editing) return;
        editForm.patch(`/classes/${editing.id}`, {
            onSuccess: () => {
                toast.success('Class updated.');
                setEditing(null);
            },
        });
    }

    function handleDelete(schoolClass: SchoolClass) {
        if (!confirm(`Delete "${schoolClass.name}"? Its students will become unassigned.`)) return;
        router.delete(`/classes/${schoolClass.id}`, {
            onSuccess: () => toast.success('Class deleted.'),
        });
    }

    return (
        <>
            <Head title="Classes" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Classes</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Class
                    </Button>
                </div>

                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <School className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No classes yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Create your first class before enrolling students.</p>
                        <Button className="mt-4" onClick={() => setShowCreate(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Class
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Grade</th>
                                    <th className="px-4 py-3 text-left font-medium">Homeroom teacher</th>
                                    <th className="px-4 py-3 text-right font-medium">Students</th>
                                    <th className="px-4 py-3 text-right font-medium">Capacity</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {classes.map((c) => (
                                    <tr key={c.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3 font-medium">{c.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{c.grade_level}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{c.homeroom_teacher?.user?.name ?? 'Unassigned'}</td>
                                        <td className="px-4 py-3 text-right">{c.students_count ?? 0}</td>
                                        <td className="px-4 py-3 text-right">{c.capacity}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-foreground" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(c)} className="text-muted-foreground hover:text-destructive" title="Delete">
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
                        <DialogTitle>Add Class</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <ClassFormFields form={createForm} teachers={teachers} idPrefix="c" />
                        <div className="flex justify-end gap-2 pt-1">
                            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); createForm.reset(); }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Creating…' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Class</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <ClassFormFields form={editForm} teachers={teachers} idPrefix="ce" />
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

function ClassFormFields({
    form,
    teachers,
    idPrefix,
}: {
    form: ReturnType<typeof useForm<typeof emptyForm>>;
    teachers: Teacher[];
    idPrefix: string;
}) {
    return (
        <>
            <div>
                <Label htmlFor={`${idPrefix}-name`}>Class name</Label>
                <Input id={`${idPrefix}-name`} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Grade 4A" autoFocus />
                <InputError message={form.errors.name} />
            </div>
            <div>
                <Label htmlFor={`${idPrefix}-grade`}>Grade level</Label>
                <Input id={`${idPrefix}-grade`} value={form.data.grade_level} onChange={(e) => form.setData('grade_level', e.target.value)} placeholder="Grade 4" />
                <InputError message={form.errors.grade_level} />
            </div>
            <div>
                <Label>Homeroom teacher</Label>
                <Select value={form.data.homeroom_teacher_id} onValueChange={(value) => form.setData('homeroom_teacher_id', value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                        {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={String(teacher.id)}>
                                {teacher.user?.name ?? teacher.staff_no}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={form.errors.homeroom_teacher_id} />
            </div>
            <div>
                <Label htmlFor={`${idPrefix}-capacity`}>Capacity</Label>
                <Input id={`${idPrefix}-capacity`} type="number" min={1} value={form.data.capacity} onChange={(e) => form.setData('capacity', e.target.value)} />
                <InputError message={form.errors.capacity} />
            </div>
        </>
    );
}

ClassesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Classes', href: '/classes' },
    ],
};
