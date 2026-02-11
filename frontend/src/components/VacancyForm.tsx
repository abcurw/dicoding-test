'use client';

import { useState, useEffect, useRef } from 'react';
import { VacancyFormData, Vacancy } from '@/types/vacancy';

interface VacancyFormProps {
  initialData?: Vacancy;
  onSubmit: (data: VacancyFormData) => void;
  isLoading?: boolean;
}

const locations = [
  'Bandung',
  'Jakarta',
  'Surabaya',
  'Yogyakarta',
  'Semarang',
  'Medan',
  'Makassar',
];

export default function VacancyForm({
  initialData,
  onSubmit,
  isLoading,
}: VacancyFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState<VacancyFormData>({
    title: '',
    company_name: 'Dicoding Indonesia',
    company_city: '',
    company_sector: 'Technology',
    company_employee_count: 75,
    job_type: 'Full-Time',
    description: getDefaultDescription(),
    salary_min: undefined,
    salary_max: undefined,
    show_salary: false,
    experience_min: '',
    candidates_needed: 1,
    is_remote: false,
    expired_at: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        company_name: initialData.company_name,
        company_city: initialData.company_city,
        company_sector: initialData.company_sector || 'Technology',
        company_employee_count: initialData.company_employee_count || 75,
        job_type: initialData.job_type,
        description: initialData.description,
        salary_min: initialData.salary_min || undefined,
        salary_max: initialData.salary_max || undefined,
        show_salary: initialData.show_salary || false,
        experience_min: initialData.experience_min || '',
        candidates_needed: initialData.candidates_needed,
        is_remote: initialData.is_remote,
        expired_at: initialData.expired_at.split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? value ? parseInt(value) : undefined
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const applyFormat = (format: 'bold' | 'italic' | 'underline' | 'bullet' | 'number') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    const beforeText = formData.description.substring(0, start);
    const afterText = formData.description.substring(end);

    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        cursorOffset = selectedText ? newText.length : 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        cursorOffset = selectedText ? newText.length : 1;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        cursorOffset = selectedText ? newText.length : 3;
        break;
      case 'bullet':
        if (selectedText) {
          newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        } else {
          newText = '- ';
        }
        cursorOffset = newText.length;
        break;
      case 'number':
        if (selectedText) {
          newText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        } else {
          newText = '1. ';
        }
        cursorOffset = newText.length;
        break;
    }

    const newDescription = beforeText + newText + afterText;
    setFormData(prev => ({ ...prev, description: newDescription }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const scrollToCursor = (textarea: HTMLTextAreaElement) => {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const lineNumber = textBeforeCursor.split('\n').length;
    const cursorY = lineNumber * lineHeight;

    const visibleTop = textarea.scrollTop;
    const visibleBottom = visibleTop + textarea.clientHeight;

    if (cursorY < visibleTop + lineHeight) {
      textarea.scrollTop = Math.max(0, cursorY - lineHeight);
    } else if (cursorY > visibleBottom - lineHeight * 2) {
      textarea.scrollTop = cursorY - textarea.clientHeight + lineHeight * 2;
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = formData.description.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];

      const bulletMatch = currentLine.match(/^(\s*)- /);
      const numberMatch = currentLine.match(/^(\s*)(\d+)\. /);

      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];
        if (currentLine.trim() === '-') {
          const newText = formData.description.substring(0, cursorPos - currentLine.length) +
                         formData.description.substring(cursorPos);
          setFormData(prev => ({ ...prev, description: newText }));
        } else {
          const newText = formData.description.substring(0, cursorPos) +
                         `\n${indent}- ` +
                         formData.description.substring(cursorPos);
          setFormData(prev => ({ ...prev, description: newText }));
          setTimeout(() => {
            textarea.setSelectionRange(cursorPos + indent.length + 3, cursorPos + indent.length + 3);
            scrollToCursor(textarea);
          }, 0);
        }
      } else if (numberMatch) {
        e.preventDefault();
        const indent = numberMatch[1];
        const num = parseInt(numberMatch[2]);
        if (currentLine.trim() === `${num}.`) {
          const newText = formData.description.substring(0, cursorPos - currentLine.length) +
                         formData.description.substring(cursorPos);
          setFormData(prev => ({ ...prev, description: newText }));
        } else {
          const newText = formData.description.substring(0, cursorPos) +
                         `\n${indent}${num + 1}. ` +
                         formData.description.substring(cursorPos);
          setFormData(prev => ({ ...prev, description: newText }));
          setTimeout(() => {
            const newPos = cursorPos + indent.length + String(num + 1).length + 3;
            textarea.setSelectionRange(newPos, newPos);
            scrollToCursor(textarea);
          }, 0);
        }
      } else {
        setTimeout(() => scrollToCursor(textarea), 0);
      }
    }
  };

  const handleDescriptionInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setTimeout(() => scrollToCursor(textarea), 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Judul lowongan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masukkan judul lowongan"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Contoh: Android Native Developer</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Posisi <span className="text-red-500">*</span>
        </label>
        <select
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Kontrak">Kontrak</option>
          <option value="Intern">Intern</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipe pekerjaan <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {['Full-Time', 'Part-Time', 'Kontrak', 'Intern'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="job_type"
                value={type}
                checked={formData.job_type === type}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kandidat yang dibutuhkan <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="candidates_needed"
          value={formData.candidates_needed}
          onChange={handleChange}
          placeholder="Masukkan jumlah kandidat yang dibutuhkan"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aktif hingga <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="expired_at"
          value={formData.expired_at}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lokasi <span className="text-red-500">*</span>
        </label>
        <select
          name="company_city"
          value={formData.company_city}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Pilih lokasi</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            name="is_remote"
            checked={formData.is_remote}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Bisa remote</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 border-b border-gray-300">
            <button
              type="button"
              onClick={() => applyFormat('bold')}
              className="p-1.5 hover:bg-gray-200 rounded font-bold text-sm"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat('italic')}
              className="p-1.5 hover:bg-gray-200 rounded italic text-sm"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat('underline')}
              className="p-1.5 hover:bg-gray-200 rounded underline text-sm"
              title="Underline"
            >
              U
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => applyFormat('bullet')}
              className="p-1.5 hover:bg-gray-200 rounded text-sm"
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="2" cy="6" r="1" fill="currentColor" />
                <circle cx="2" cy="12" r="1" fill="currentColor" />
                <circle cx="2" cy="18" r="1" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => applyFormat('number')}
              className="p-1.5 hover:bg-gray-200 rounded text-sm"
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13" />
                <text x="1" y="8" fontSize="6" fill="currentColor">1</text>
                <text x="1" y="14" fontSize="6" fill="currentColor">2</text>
                <text x="1" y="20" fontSize="6" fill="currentColor">3</text>
              </svg>
            </button>
          </div>
          <textarea
            ref={textareaRef}
            name="description"
            value={formData.description}
            onChange={handleChange}
            onKeyDown={handleDescriptionKeyDown}
            onInput={handleDescriptionInput}
            rows={15}
            className="w-full px-3 py-2 focus:outline-none font-mono text-sm border-0"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Anda bisa mengubah templat yang telah disediakan di atas.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rentang gaji per bulan <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minimum</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-gray-50 text-gray-500 text-sm">
                Rp
              </span>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min || ''}
                onChange={handleChange}
                placeholder="5.000.000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maksimum</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-gray-50 text-gray-500 text-sm">
                Rp
              </span>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max || ''}
                onChange={handleChange}
                placeholder="10.000.000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Anda tidak perlu mengisi kolom "Maksimum" jika yang dimasukkan adalah gaji pokok.
        </p>
        <div className="mt-3 flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="show_salary"
              checked={formData.show_salary || false}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Tampilkan gaji</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-11">
          Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh kandidat.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pengalaman kerja <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {['Kurang dari 1 tahun', '1-3 tahun', '4-5 tahun', '6-10 tahun', 'Lebih dari 10 tahun'].map((exp) => (
            <label key={exp} className="flex items-center">
              <input
                type="radio"
                name="experience_min"
                value={exp}
                checked={formData.experience_min === exp}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span className="text-sm text-gray-700">{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-slate-800 text-white font-medium rounded hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Buat Lowongan'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-100 text-gray-600 font-medium rounded hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function getDefaultDescription(): string {
  return `## Deskripsi Pekerjaan

Sebagai [Posisi Lowongan], Anda akan berpartisipasi dalam proses pembangunan aplikasi yang sedang dibangun dalam perusahaan [Nama Perusahaan]. Anda juga diharapkan mampu bekerja dalam tim.

## Tanggung Jawab

- Membuat atau memodifikasi program yang sudah ada.
- Bertanggung jawab dalam mengelola program.

## Persyaratan

- Memiliki pengalaman di bidang terkait.
- Mampu bekerja dalam tim.
- Memiliki kemampuan komunikasi yang baik.`;
}