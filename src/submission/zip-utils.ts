const AdmZip = require('adm-zip');
import * as path from 'path';

export function listZipEntries(buffer: Buffer): string[] {
    const zip = new AdmZip(buffer);
    return zip.getEntries().map(e => e.entryName);
}

export function fileExistsInZip(buffer: Buffer, fileName: string): boolean {
    const zip = new AdmZip(buffer);
    // On ignore le chemin, on cherche le fichier par son nom (insensible à la casse)
    const lowerName = fileName.toLowerCase();
    return zip.getEntries().some(e => e.entryName.split('/').pop()?.toLowerCase() === lowerName);
}

export function dirStructureMatches(buffer: Buffer, structure: string[]): boolean {
    const entries = listZipEntries(buffer);
    return structure.every(s => entries.some(e => e === s || e.startsWith(s)));
}

export function fileContentMatches(buffer: Buffer, filePath: string, matcher: { type: 'text' | 'regex', value: string }): boolean {
    const zip = new AdmZip(buffer);
    const entry = zip.getEntry(filePath);
    if (!entry) return false;
    const content = entry.getData().toString('utf-8');
    if (matcher.type === 'text') {
        return content.includes(matcher.value);
    } else {
        const regex = new RegExp(matcher.value, 'm');
        return regex.test(content);
    }
}
