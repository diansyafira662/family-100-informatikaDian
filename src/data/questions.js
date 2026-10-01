import { category1Questions } from './category1_berpikir_komputasional';
import { category2Questions } from './category2_sistem_komputer';
import { category3Questions } from './category3_jaringan_internet';
import { category4Questions } from './category4_analisis_data';
import { category5Questions } from './category5_keamanan_etika';

export const defaultQuestions = [
  ...category1Questions,
  ...category2Questions,
  ...category3Questions,
  ...category4Questions,
  ...category5Questions
];

export const questionCategoriesList = [
  { id: 'ALL', name: '🎮 SEMUA GAME / CAMPURAN (250+ Soal)' },
  { id: 'Berpikir Komputasional & Algoritma', name: '🧠 GAME 1: Berpikir Komputasional & Algoritma (50 Soal)' },
  { id: 'Sistem Komputer & Hardware/Software', name: '💻 GAME 2: Sistem Komputer & Hardware/Software (50 Soal)' },
  { id: 'Jaringan Komputer & Internet', name: '🌐 GAME 3: Jaringan Komputer & Internet (50 Soal)' },
  { id: 'Analisis Data & Spreadsheet', name: '📊 GAME 4: Analisis Data & Spreadsheet (50 Soal)' },
  { id: 'Keamanan Digital & Etika IT', name: '🛡️ GAME 5: Keamanan Digital & Etika IT (50 Soal)' }
];
