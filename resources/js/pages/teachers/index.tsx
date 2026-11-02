import { useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Head, router } from '@inertiajs/react';
import type { Teacher } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import { dashboard } from '@/routes';

interface Props {
    teachers: Teacher[];
}

const emptyCreate = { name: '', email: '', staff_no: '', phone: '', subject_specialty: '' };
const emptyEdit = { name: '', staff_no: '', phone: '', subject_specialty: '' };

export default function TeachersIndex({ teachers }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Teacher | null>(null);

    const createForm = useForm({ ...emptyCreate });
    const editForm = useForm({ ...emptyEdit });

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        createForm.post('/teachers', {
            onSuccess: () => {
                toast.success('Teacher added.');
                setShowCreate(false);
                createForm.reset();
            },
        });
    }

    function openEdit(teacher: Teacher) {
        setEditing(teacher);
        editForm.setData({
            name: teacher.user?.name ?? '',
            staff_no: teacher.staff_no,
            phone: teacher.phone ?? '',
            subject_specialty: teacher.subject_specialty ?? '',
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editing) return;
        editForm.patch(`/teachers/${editing.id}`, {
            onSuccess: () => {
                toast.success('Teacher updated.');
                setEditing(null);
            },
        });
    }

    function handleDelete(teacher: Teacher) {
        if (!confirm(`Remove ${teacher.user?.name ?? teacher.staff_no}? Classes they lead will become unassigned.`)) return;
        router.delete(`/teachers/${teacher.id}`, {
            onSuccess: () => toast.success('Teacher removed.'),
        });
    }

    return (
        <>
            <Head title="Teachers" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Teachers</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Teacher
                    </Button>
                </div>

                {teachers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <UserRound className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No teachers yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Add your first teacher to start assigning homerooms.</p>
                        <Button className="mt-4" onClick={() => setShowCreate(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Teacher
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Staff No</th>
                                    <th className="px-4 py-3 text-left font-medium">Specialty</th>
                                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                                    <th className="px-4 py-3 text-right font-medium">Homerooms</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-muted/20">
                                        <td className="px-4 py-3 font-medium">{teacher.user?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{teacher.staff_no}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{teacher.subject_specialty ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{teacher.phone ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">{teacher.homeroom_classes_count ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(teacher)} className="text-muted-foreground hover:text-foreground" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(teacher)} className="text-muted-foreground hover:text-destructive" title="Remove">
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
                        <DialogTitle>Add Teacher</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div>
                            <Label htmlFor="t-name">Full name</Label>
                            <Input id="t-name" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} autoFocus />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="t-email">Login email</Label>
                            <Input id="t-email" type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} placeholder="teacher@school.test" />
                            <InputError message={createForm.errors.email} />
                        </div>
                        <div>
                            <Label htmlFor="t-staff-no">Staff number</Label>
                            <Input id="t-staff-no" value={createForm.data.staff_no} onChange={(e) => createForm.setData('staff_no', e.target.value)} placeholder="STF-0007" />
                            <InputError message={createForm.errors.staff_no} />
                        </div>
                        <div>
                            <Label htmlFor="t-subject">Subject specialty</Label>
                            <Input id="t-subject" value={createForm.data.subject_specialty} onChange={(e) => createForm.setData('subject_specialty', e.target.value)} />
                            <InputError message={createForm.errors.subject_specialty} />
                        </div>
                        <div>
                            <Label htmlFor="t-phone">Phone</Label>
                            <Input id="t-phone" value={createForm.data.phone} onChange={(e) => createForm.setData('phone', e.target.value)} />
                            <InputError message={createForm.errors.phone} />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); createForm.reset(); }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Adding…' : 'Add teacher'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Teacher</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div>
                            <Label htmlFor="te-name">Full name</Label>
                            <Input id="te-name" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} autoFocus />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="te-staff-no">Staff number</Label>
                            <Input id="te-staff-no" value={editForm.data.staff_no} onChange={(e) => editForm.setData('staff_no', e.target.value)} />
                            <InputError message={editForm.errors.staff_no} />
                        </div>
                        <div>
                            <Label htmlFor="te-subject">Subject specialty</Label>
                            <Input id="te-subject" value={editForm.data.subject_specialty} onChange={(e) => editForm.setData('subject_specialty', e.target.value)} />
                            <InputError message={editForm.errors.subject_specialty} />
                        </div>
                        <div>
                            <Label htmlFor="te-phone">Phone</Label>
                            <Input id="te-phone" value={editForm.data.phone} onChange={(e) => editForm.setData('phone', e.target.value)} />
                            <InputError message={editForm.errors.phone} />
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

TeachersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Teachers', href: '/teachers' },
    ],
};
