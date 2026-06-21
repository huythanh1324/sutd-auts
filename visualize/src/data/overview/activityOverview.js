import fs from 'fs';
import XLSX from 'xlsx';
import csv from 'csv-parser';

// Load Excel
const wb = XLSX.readFile('atus_2024_activity_code_map.xlsx');

const mapSheet =
    wb.Sheets[wb.SheetNames.includes('ATUS_2024_Codes')
        ? 'ATUS_2024_Codes'
        : wb.SheetNames[0]];

const mapRows = XLSX.utils.sheet_to_json(mapSheet, { defval: '' });

const codeMap = new Map();

// Build LEVEL-2 map from explicit columns
for (const row of mapRows) {
    if (row.major_code === '50') continue; // skip the unclassified activity

    const raw = row.major_code + row.second_tier_code;
    if (!raw) continue;

    const level2Code = String(raw).padStart(4, '0');

    codeMap.set(level2Code, {
        major_code: row.major_code || '',
        category: row.new_second_tier_category || ''
    });
}

const sums = new Map();
let recordCount = 0;

fs.createReadStream('atussum_0324.csv')
    .pipe(csv())
    .on('data', (rec) => {
        recordCount++;

        for (const [key, value] of Object.entries(rec)) {
            if (!/^t\d{6}$/i.test(key)) continue;

            const minutes = Number(value) || 0;
            if (minutes === 0) continue;

            // convert t010101 → 0101
            const level2Code = key.slice(1, 5);

            let item = sums.get(level2Code);

            if (!item) {
                const meta = codeMap.get(level2Code) || {};

                item = {
                    activity_code: level2Code + '**',
                    major_code: meta.major_code || '',
                    label: meta.category || '',
                    total_minutes: 0,
                    record_count_nonzero: 0
                };

                sums.set(level2Code, item);
            }

            item.total_minutes += minutes;
            item.record_count_nonzero++;
        }

        if (recordCount % 100000 === 0) {
            console.log(`Processed ${recordCount.toLocaleString()} rows`);
        }
    })
    .on('end', () => {
        const result = [...sums.values()].sort(
            (a, b) =>
                b.total_minutes - a.total_minutes ||
                a.activity_code.localeCompare(b.activity_code)
        );

        fs.writeFileSync(
            'atus_activity_sums.json',
            JSON.stringify(result, null, 2)
        );

        console.log('\nDone');
        console.log(`Rows processed: ${recordCount.toLocaleString()}`);
        console.log(`Level-2 activity codes: ${result.length}`);
        console.log('Top 10:');
        console.table(result.slice(0, 10));
    })
    .on('error', (err) => {
        console.error(err);
    });