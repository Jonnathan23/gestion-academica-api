const fs = require('fs');
const path = require('path');

const renames = [
    ['src/app/admin-desk/modules/application/useCases', 'src/app/admin-desk/modules/application/use-cases'],
    ['src/app/admin-desk/payments/application/useCases', 'src/app/admin-desk/payments/application/use-cases'],
    ['src/app/admin-desk/student-level/application/useCases', 'src/app/admin-desk/student-level/application/use-cases'],
    ['src/app/admin-desk/students/application/useCases', 'src/app/admin-desk/students/application/use-cases'],
    ['src/app/class-track/feats/attendance/application/useCases', 'src/app/class-track/feats/attendance/application/use-cases'],
    ['src/app/class-track/feats/observation/application/useCases', 'src/app/class-track/feats/observation/application/use-cases'],
    ['src/app/class-track/feats/retention-alerts/application/useCases', 'src/app/class-track/feats/retention-alerts/application/use-cases'],
    ['src/app/shared/identity/application/useCases', 'src/app/shared/identity/application/use-cases'],
    ['src/data/models/AdminDesk', 'src/data/models/admin-desk'],
    ['src/data/models/ClassTrack', 'src/data/models/class-track'],
    ['src/data/models/Shared', 'src/data/models/shared'],
    ['src/app/admin-desk/payments/domain/interfaces/payment-method.ts', 'src/app/admin-desk/payments/domain/interfaces/PaymentMethod.ts'],
    ['src/app/admin-desk/payments/domain/interfaces/payment-plan-status.ts', 'src/app/admin-desk/payments/domain/interfaces/PaymentPlanStatus.ts'],
    ['src/app/admin-desk/payments/domain/interfaces/payment-quota-status.ts', 'src/app/admin-desk/payments/domain/interfaces/PaymentQuotaStatus.ts'],
    ['src/core/utils/object-tools.ts', 'src/core/utils/objectTools.ts'],
    ['src/data/config/db-postgresql.ts', 'src/data/config/dbPostgresql.ts'],
    ['src/app/class-track/feats/observation/presentation/academicObservation.controller.ts', 'src/app/class-track/feats/observation/presentation/AcademicObservation.controller.ts']
];

for (const [oldPath, newPath] of renames) {
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${oldPath} -> ${newPath}`);
    } else {
        console.log(`Not found: ${oldPath}`);
    }
}

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('src');

const replacements = [
    { regex: /admin-desk\/modules\/application\/useCases/g, replacement: 'admin-desk/modules/application/use-cases' },
    { regex: /admin-desk\/payments\/application\/useCases/g, replacement: 'admin-desk/payments/application/use-cases' },
    { regex: /admin-desk\/student-level\/application\/useCases/g, replacement: 'admin-desk/student-level/application/use-cases' },
    { regex: /admin-desk\/students\/application\/useCases/g, replacement: 'admin-desk/students/application/use-cases' },
    { regex: /class-track\/feats\/attendance\/application\/useCases/g, replacement: 'class-track/feats/attendance/application/use-cases' },
    { regex: /class-track\/feats\/observation\/application\/useCases/g, replacement: 'class-track/feats/observation/application/use-cases' },
    { regex: /class-track\/feats\/retention-alerts\/application\/useCases/g, replacement: 'class-track/feats/retention-alerts/application/use-cases' },
    { regex: /shared\/identity\/application\/useCases/g, replacement: 'shared/identity/application/use-cases' },
    { regex: /data\/models\/AdminDesk/g, replacement: 'data/models/admin-desk' },
    { regex: /data\/models\/ClassTrack/g, replacement: 'data/models/class-track' },
    { regex: /data\/models\/Shared/g, replacement: 'data/models/shared' },
    { regex: /admin-desk\/payments\/domain\/interfaces\/payment-method/g, replacement: 'admin-desk/payments/domain/interfaces/PaymentMethod' },
    { regex: /admin-desk\/payments\/domain\/interfaces\/payment-plan-status/g, replacement: 'admin-desk/payments/domain/interfaces/PaymentPlanStatus' },
    { regex: /admin-desk\/payments\/domain\/interfaces\/payment-quota-status/g, replacement: 'admin-desk/payments/domain/interfaces/PaymentQuotaStatus' },
    { regex: /core\/utils\/object-tools/g, replacement: 'core/utils/objectTools' },
    { regex: /data\/config\/db-postgresql/g, replacement: 'data/config/dbPostgresql' },
    { regex: /class-track\/feats\/observation\/presentation\/academicObservation\.controller/g, replacement: 'class-track/feats/observation/presentation/AcademicObservation.controller' },
];

let changedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
        content = content.replace(r.regex, r.replacement);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log('Updated imports in:', file);
    }
});
console.log('Total files updated:', changedCount);
