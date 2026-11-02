export type Role = 'admin' | 'teacher' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Teacher {
    id: number;
    user_id: number | null;
    staff_no: string;
    phone: string | null;
    subject_specialty: string | null;
    user?: { id: number; name: string; email: string } | null;
    homeroom_classes_count?: number;
    created_at: string;
    updated_at: string;
}

export interface SchoolClass {
    id: number;
    name: string;
    grade_level: string;
    homeroom_teacher_id: number | null;
    capacity: number;
    homeroom_teacher?: Teacher | null;
    students_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: number;
    user_id: number | null;
    school_class_id: number | null;
    admission_no: string;
    name: string;
    guardian_name: string | null;
    guardian_phone: string | null;
    date_of_birth: string | null;
    gender: string | null;
    attendance_rate: number;
    school_class?: SchoolClass | null;
    created_at: string;
    updated_at: string;
}

export interface RosterEntry {
    id: number;
    name: string;
    admission_no: string;
    status: AttendanceStatus;
    remarks: string | null;
}

export interface AttendanceSessionSummary {
    id: number;
    date: string;
    present_count: number;
    absent_count: number;
    late_count: number;
    excused_count: number;
}
