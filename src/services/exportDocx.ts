import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';
import { Supervision, MadrasahIdentity } from '../types/supervisi';
import { DEFAULT_INDICATORS } from '../data/defaultData';

export async function generateSupervisionDocx(
  supervision: Supervision,
  madrasah: MadrasahIdentity
): Promise<Blob> {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const cellMargins = {
    top: 80,
    bottom: 80,
    left: 120,
    right: 120,
  };

  // Header Table (Kop)
  const kopParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: madrasah.namaYayasan.toUpperCase(),
          font: 'Times New Roman',
          size: 24, // 12pt
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: madrasah.namaMadrasah.toUpperCase(),
          font: 'Times New Roman',
          size: 28, // 14pt
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `${madrasah.alamat}, Desa/Kel. ${madrasah.desaKelurahan}, Kec. ${madrasah.kecamatan}, Kab. ${madrasah.kabupaten}, Prov. ${madrasah.provinsi}`,
          font: 'Times New Roman',
          size: 18, // 9pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `NSM: ${madrasah.nsm} | NPSN: ${madrasah.npsn} | Email: ${madrasah.email} | Telp: ${madrasah.telepon}`,
          font: 'Times New Roman',
          size: 18, // 9pt
          italics: true,
        }),
      ],
    }),
  ];

  // Document Title
  const titleParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: 'INSTRUMEN SUPERVISI AKADEMIK',
          font: 'Times New Roman',
          size: 24,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'SUPERVISI PELAKSANAAN PEMBELAJARAN (KURIKULUM MERDEKA)',
          font: 'Times New Roman',
          size: 22,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Nomor: ${supervision.nomorDokumen}`,
          font: 'Times New Roman',
          size: 20,
        }),
      ],
    }),
  ];

  // Teacher & Class Info Table
  const infoRows = [
    [
      'Nama Guru',
      `: ${supervision.namaGuru}`,
      'Hari/Tanggal',
      `: ${supervision.tanggalSupervisi}`,
    ],
    [
      'NIP / NUPTK',
      `: ${supervision.nipGuru || '-'}`,
      'Semester / Tapel',
      `: ${supervision.semester} / ${supervision.tahunPelajaran}`,
    ],
    [
      'Mata Pelajaran',
      `: ${supervision.mataPelajaran}`,
      'Kelas / Jam Ke',
      `: ${supervision.kelas} / ${supervision.jamPelajaran}`,
    ],
    [
      'Materi / Topik',
      `: ${supervision.materiTopik}`,
      'Nama Supervisor',
      `: ${supervision.namaSupervisor}`,
    ],
  ].map((row) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: row[0], font: 'Times New Roman', size: 20, bold: true })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: row[1], font: 'Times New Roman', size: 20 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: row[2], font: 'Times New Roman', size: 20, bold: true })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: row[3], font: 'Times New Roman', size: 20 })],
            }),
          ],
        }),
      ],
    });
  });

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: infoRows,
  });

  // Table of 38 Indicators
  const indicatorTableRows: TableRow[] = [];

  // Table Header
  indicatorTableRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'NO', font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'ASPEK YANG DIAMATI', font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 9, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: '0', font: 'Times New Roman', size: 18, bold: true })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Lengkap', font: 'Times New Roman', size: 14 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 9, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: '1', font: 'Times New Roman', size: 18, bold: true })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Kurang', font: 'Times New Roman', size: 14 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 9, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: '2', font: 'Times New Roman', size: 18, bold: true })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Tidak', font: 'Times New Roman', size: 14 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 19, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'CATATAN', font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
      ],
    })
  );

  // Group by Section
  let currentSection = '';
  DEFAULT_INDICATORS.forEach((ind) => {
    if (ind.section !== currentSection) {
      currentSection = ind.section;
      indicatorTableRows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 6,
              borders: tableBorder,
              shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
              margins: cellMargins,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: ind.sectionTitle,
                      font: 'Times New Roman',
                      size: 19,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }

    const rating = supervision.penilaian[ind.id] || { score: 0, catatan: '' };

    indicatorTableRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: tableBorder,
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: String(ind.number), font: 'Times New Roman', size: 18 })],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            margins: cellMargins,
            children: [
              new Paragraph({
                children: [new TextRun({ text: ind.aspekYangDiamati, font: 'Times New Roman', size: 18 })],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: rating.score === 0 ? '✓' : '',
                    font: 'Times New Roman',
                    size: 20,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: rating.score === 1 ? '✓' : '',
                    font: 'Times New Roman',
                    size: 20,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: rating.score === 2 ? '✓' : '',
                    font: 'Times New Roman',
                    size: 20,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            margins: cellMargins,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: rating.catatan || '-',
                    font: 'Times New Roman',
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  });

  // Table summary rows
  indicatorTableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders: tableBorder,
          shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'JUMLAH SKOR SESUAI PILIHAN', font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
        new TableCell({
          borders: tableBorder,
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: String(supervision.countScore0), font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
        new TableCell({
          borders: tableBorder,
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: String(supervision.countScore1), font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
        new TableCell({
          borders: tableBorder,
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: String(supervision.countScore2), font: 'Times New Roman', size: 18, bold: true })],
            }),
          ],
        }),
        new TableCell({
          borders: tableBorder,
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Total Indikator: 38', font: 'Times New Roman', size: 16 })],
            }),
          ],
        }),
      ],
    })
  );

  const indicatorsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: indicatorTableRows,
  });

  // Score Summary Box
  const scoreRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Skor Perolehan', font: 'Times New Roman', size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: 'Skor Maksimal', font: 'Times New Roman', size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: 'Metode Penilaian', font: 'Times New Roman', size: 20 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [new TextRun({ text: `: ${supervision.totalSkorPerolehan}`, font: 'Times New Roman', size: 20, bold: true })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `: ${supervision.skorMaksimal} (38 × 2)`, font: 'Times New Roman', size: 20 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `: ${supervision.evaluationMode === 'DOKUMEN_ASLI' ? 'Mode 1 (Dokumen Asli)' : 'Mode 2 (Skor Kualitas)'}`, font: 'Times New Roman', size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders: tableBorder,
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `NILAI AKHIR: ${supervision.nilaiAkhir}%   |   KATEGORI: `, font: 'Times New Roman', size: 24, bold: true }),
                new TextRun({ text: supervision.kategori.toUpperCase(), font: 'Times New Roman', size: 24, bold: true }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Rentang Nilai: 91–100 (Sangat Baik) | 81–90 (Baik) | 71–80 (Cukup) | < 71 (Kurang)', font: 'Times New Roman', size: 16, italics: true }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  const scoreTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: scoreRows,
  });

  // Supervisor Notes, Analysis, and Follow Up
  const analysisParagraphs = [
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [new TextRun({ text: 'KESIMPULAN DAN ANALISIS HASIL SUPERVISI', font: 'Times New Roman', size: 22, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: 'A. Aspek yang Sudah Baik:', font: 'Times New Roman', size: 20, bold: true })],
    }),
    ...supervision.analisis.aspekSudahBaik.map(
      (item) =>
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [new TextRun({ text: item, font: 'Times New Roman', size: 18 })],
        })
    ),
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: 'B. Aspek yang Perlu Ditingkatkan:', font: 'Times New Roman', size: 20, bold: true })],
    }),
    ...supervision.analisis.aspekPerluDitingkatkan.map(
      (item) =>
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [new TextRun({ text: item, font: 'Times New Roman', size: 18 })],
        })
    ),
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: 'C. Catatan Khusus & Rekomendasi Supervisor:', font: 'Times New Roman', size: 20, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: supervision.catatanHasilSupervisi || supervision.rekomendasi || '-', font: 'Times New Roman', size: 18 })],
    }),
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: 'D. Rencana Tindak Lanjut:', font: 'Times New Roman', size: 20, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `Bentuk Tindak Lanjut: ${supervision.tindakLanjut.options.join(', ') || 'Pembinaan individu'} | Tanggal: ${supervision.tindakLanjut.targetDate || '-'} | PIC: ${supervision.tindakLanjut.pic || '-'} | Status: ${supervision.tindakLanjut.status}`,
          font: 'Times New Roman',
          size: 18,
        }),
      ],
    }),
  ];

  // Signatures Table
  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Mengetahui,\nGuru yang Disupervisi', font: 'Times New Roman', size: 20 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 40 },
                children: [new TextRun({ text: supervision.namaGuru, font: 'Times New Roman', size: 20, bold: true, underline: {} })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `NIP. ${supervision.nipGuru || '-'}`, font: 'Times New Roman', size: 18 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${madrasah.kabupaten}, ${supervision.tanggalSupervisi}\nSupervisor Akademik,`,
                    font: 'Times New Roman',
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 40 },
                children: [new TextRun({ text: supervision.namaSupervisor, font: 'Times New Roman', size: 20, bold: true, underline: {} })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `NIP. ${supervision.nipSupervisor || '-'}`, font: 'Times New Roman', size: 18 })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 300 },
                children: [new TextRun({ text: 'Mengetahui / Mengesahkan,\nKepala MA Darul Mahfudz', font: 'Times New Roman', size: 20 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 40 },
                children: [new TextRun({ text: madrasah.namaKepalaMadrasah, font: 'Times New Roman', size: 20, bold: true, underline: {} })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `NIP. ${madrasah.nipKepalaMadrasah}`, font: 'Times New Roman', size: 18 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              bottom: 1134,
              left: 1134,
              right: 1134,
            },
          },
        },
        children: [
          ...kopParagraphs,
          ...titleParagraphs,
          infoTable,
          new Paragraph({ spacing: { before: 120 } }),
          indicatorsTable,
          new Paragraph({ spacing: { before: 180 } }),
          scoreTable,
          ...analysisParagraphs,
          new Paragraph({ spacing: { before: 200 } }),
          signTable,
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
