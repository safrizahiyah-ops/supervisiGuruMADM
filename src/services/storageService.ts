import { MadrasahIdentity, AppSettings, Teacher, Subject, SchoolClass, Supervision, UserAccount } from '../types/supervisi';
import { DEFAULT_MADRASAH, DEFAULT_SETTINGS, DEFAULT_TEACHERS, DEFAULT_SUBJECTS, DEFAULT_CLASSES, DEFAULT_SUPERVISIONS, DEFAULT_USERS } from '../data/defaultData';

const STORAGE_KEYS = {
  MADRASAH: 'dm_supervisi_madrasah_v1',
  SETTINGS: 'dm_supervisi_settings_v1',
  TEACHERS: 'dm_supervisi_teachers_v2',
  TEACHERS_INITIALIZED: 'dm_supervisi_teachers_initialized_v2',
  SUBJECTS: 'dm_supervisi_subjects_v1',
  CLASSES: 'dm_supervisi_classes_v1',
  SUPERVISIONS: 'dm_supervisi_supervisions_v1',
  CURRENT_USER: 'dm_supervisi_current_user_v2',
  USERS: 'dm_supervisi_users_v2',
};

// Initialize or read from localStorage
export const storageService = {
  getMadrasah(): MadrasahIdentity {
    const raw = localStorage.getItem(STORAGE_KEYS.MADRASAH);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MADRASAH, JSON.stringify(DEFAULT_MADRASAH));
      return DEFAULT_MADRASAH;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_MADRASAH;
    }
  },

  saveMadrasah(data: MadrasahIdentity): void {
    localStorage.setItem(STORAGE_KEYS.MADRASAH, JSON.stringify(data));
  },

  getSettings(): AppSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(data: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
  },

  getUsers(): UserAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      const parsed: UserAccount[] = JSON.parse(raw);
      // Ensure all 3 roles exist
      if (parsed && parsed.length >= 3) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },

  getCurrentUser(): UserAccount {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      const defaultUser = DEFAULT_USERS[0]; // Admin by default
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS[0];
    }
  },

  setCurrentUser(user: UserAccount): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  login(usernameOrEmail: string, password?: string): UserAccount | null {
    const users = this.getUsers();
    const query = usernameOrEmail.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.username?.toLowerCase() === query ||
        u.email.toLowerCase() === query
    );
    if (!found) return null;
    if (password && found.password && found.password !== password.trim()) {
      return null;
    }
    this.setCurrentUser(found);
    return found;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getTeachers(): Teacher[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    if (raw !== null) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }

    // Check if initialization has ever happened
    const wasInitialized = localStorage.getItem(STORAGE_KEYS.TEACHERS_INITIALIZED);
    if (wasInitialized) {
      // User deliberately emptied the list or initialized earlier
      return [];
    }

    // Check v1 legacy key
    const v1Raw = localStorage.getItem('dm_supervisi_teachers_v1');
    if (v1Raw) {
      try {
        const v1List = JSON.parse(v1Raw);
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(v1List));
        localStorage.setItem(STORAGE_KEYS.TEACHERS_INITIALIZED, 'true');
        return v1List;
      } catch {
        // fallback
      }
    }

    // Seed default only once initially
    localStorage.setItem(STORAGE_KEYS.TEACHERS_INITIALIZED, 'true');
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
    return DEFAULT_TEACHERS;
  },

  saveTeacher(teacher: Teacher): void {
    const teachers = this.getTeachers();
    const index = teachers.findIndex((t) => t.id === teacher.id);
    if (index >= 0) {
      teachers[index] = teacher;
    } else {
      teachers.push(teacher);
    }
    this.saveTeachers(teachers);
  },

  saveTeachers(teachers: Teacher[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    localStorage.setItem(STORAGE_KEYS.TEACHERS_INITIALIZED, 'true');
  },

  deleteTeacher(id: string): void {
    const teachers = this.getTeachers().filter((t) => t.id !== id);
    this.saveTeachers(teachers);
  },

  bulkImportTeachers(newTeachers: Teacher[], mode: 'append' | 'replace'): Teacher[] {
    let finalTeachers: Teacher[];
    if (mode === 'replace') {
      finalTeachers = newTeachers;
    } else {
      const existing = this.getTeachers();
      const existingNips = new Set(
        existing.map((t) => t.nip?.trim()).filter((n) => n && n !== '-')
      );
      const existingNames = new Set(
        existing.map((t) => t.nama.trim().toLowerCase())
      );

      const toAdd = newTeachers.filter((nt) => {
        const ntNip = nt.nip?.trim();
        if (ntNip && ntNip !== '-' && existingNips.has(ntNip)) {
          return false;
        }
        if (existingNames.has(nt.nama.trim().toLowerCase())) {
          return false;
        }
        return true;
      });

      finalTeachers = [...existing, ...toAdd];
    }
    this.saveTeachers(finalTeachers);
    return finalTeachers;
  },

  getSubjects(): Subject[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
      return DEFAULT_SUBJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SUBJECTS;
    }
  },

  saveSubject(subject: Subject): void {
    const subjects = this.getSubjects();
    const index = subjects.findIndex((s) => s.id === subject.id);
    if (index >= 0) {
      subjects[index] = subject;
    } else {
      subjects.push(subject);
    }
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  deleteSubject(id: string): void {
    const subjects = this.getSubjects().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getClasses(): SchoolClass[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
      return DEFAULT_CLASSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CLASSES;
    }
  },

  saveClass(schoolClass: SchoolClass): void {
    const classes = this.getClasses();
    const index = classes.findIndex((c) => c.id === schoolClass.id);
    if (index >= 0) {
      classes[index] = schoolClass;
    } else {
      classes.push(schoolClass);
    }
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  deleteClass(id: string): void {
    const classes = this.getClasses().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  getSupervisions(): Supervision[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPERVISIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUPERVISIONS, JSON.stringify(DEFAULT_SUPERVISIONS));
      return DEFAULT_SUPERVISIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SUPERVISIONS;
    }
  },

  getSupervisionById(id: string): Supervision | undefined {
    return this.getSupervisions().find((s) => s.id === id);
  },

  saveSupervision(item: Supervision): void {
    const items = this.getSupervisions();
    const index = items.findIndex((s) => s.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.SUPERVISIONS, JSON.stringify(items));
  },

  deleteSupervision(id: string): void {
    const items = this.getSupervisions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUPERVISIONS, JSON.stringify(items));
  },

  duplicateSupervision(id: string): Supervision | null {
    const original = this.getSupervisionById(id);
    if (!original) return null;

    const newDocNumber = this.generateNextDocumentNumber();
    const today = new Date().toISOString().split('T')[0];

    const duplicate: Supervision = {
      ...original,
      id: `sup-${Date.now()}`,
      nomorDokumen: newDocNumber,
      tanggalSupervisi: today,
      status: 'DRAFT',
      approvedByKamad: false,
      approvalDate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Reset signatures for new document
      signature: {
        ...original.signature,
        supervisorSignature: undefined,
        teacherSignature: undefined,
        supervisorSignDate: today,
        teacherSignDate: today,
      },
    };

    this.saveSupervision(duplicate);
    return duplicate;
  },

  generateNextDocumentNumber(): string {
    const settings = this.getSettings();
    const supervisions = this.getSupervisions();
    const now = new Date();
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[now.getMonth()];
    const year = now.getFullYear();

    // Find highest index
    const nextSeq = supervisions.length + 1;
    const paddedSeq = String(nextSeq).padStart(3, '0');
    const prefix = settings.documentNumberPrefix || 'SUP/AMD';

    return `${prefix}/${paddedSeq}/${romanMonth}/${year}`;
  },

  backupDatabase(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      madrasah: this.getMadrasah(),
      settings: this.getSettings(),
      teachers: this.getTeachers(),
      subjects: this.getSubjects(),
      classes: this.getClasses(),
      supervisions: this.getSupervisions(),
    };
    return JSON.stringify(data, null, 2);
  },

  restoreDatabase(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.madrasah || !parsed.teachers || !parsed.supervisions) {
        return { success: false, message: 'Format file backup tidak valid atau data korup.' };
      }
      if (parsed.madrasah) localStorage.setItem(STORAGE_KEYS.MADRASAH, JSON.stringify(parsed.madrasah));
      if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      if (parsed.teachers) localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(parsed.teachers));
      if (parsed.subjects) localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(parsed.subjects));
      if (parsed.classes) localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(parsed.classes));
      if (parsed.supervisions) localStorage.setItem(STORAGE_KEYS.SUPERVISIONS, JSON.stringify(parsed.supervisions));
      return { success: true, message: 'Data berhasil dipulihkan dari file backup!' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal membaca file JSON.';
      return { success: false, message: `Error: ${errorMsg}` };
    }
  },

  exportAllData(): string {
    return this.backupDatabase();
  },

  importAllData(jsonString: string): boolean {
    const res = this.restoreDatabase(jsonString);
    return res.success;
  },

  resetToDefault(): void {
    this.resetToDefaults();
  },

  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.MADRASAH, JSON.stringify(DEFAULT_MADRASAH));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
    localStorage.setItem(STORAGE_KEYS.SUPERVISIONS, JSON.stringify(DEFAULT_SUPERVISIONS));
  },
};
