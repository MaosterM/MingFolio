/**
 * Education, activities and certifications. Source: the owner's LinkedIn profile (read 2026-11-23).
 * Credential IDs are left out on purpose: they add nothing for a visitor.
 */

export interface EducationEntry {
  id: string;
  institution: string;
  qualification: string | null;
  /** As written on LinkedIn, e.g. "Sep 2024 – Sep 2027". */
  period: string;
  notes: readonly string[];
}

export interface Certification {
  title: string;
  issuer: string;
  /** "Mon YYYY" as written on LinkedIn. */
  issued: string;
}

/** Newest first. */
export const EDUCATION: readonly EducationEntry[] = [
  {
    id: 'taylors-university',
    institution: "Taylor's University",
    qualification: 'Bachelor’s Degree, Computer Science',
    period: 'Sep 2024 – Sep 2027',
    notes: [
      'Specialising in Data Science, minor in Finance',
      'Best Low-Resource Language Solution, RMIT Hackathon 2026 (Team Shuijiao)',
      'Student organising team, Sync Night 2026 (Talent Readiness Engagement, School of Computer Science)',
    ],
  },
  {
    id: 'taylors-college',
    institution: "Taylor's College",
    qualification: 'Foundation in Computing',
    period: 'Aug 2023 – Aug 2024',
    notes: ['3.80 CGPA'],
  },
  {
    id: 'sri-kdu',
    institution: 'Sri KDU Schools',
    qualification: null,
    period: '2018 – 2022',
    notes: ['Treasurer of the Futsal Club: managed club funds and coordinated sports events'],
  },
];

/** Newest first. */
export const CERTIFICATIONS: readonly Certification[] = [
  { title: 'DEC x Taylor’s University AI Literacy for All', issuer: 'Digital Education Council', issued: 'Oct 2026' },
  { title: 'Bloomberg Market Concepts', issuer: 'Bloomberg', issued: 'Jul 2026' },
  { title: 'Environmental Social Governance', issuer: 'Bloomberg', issued: 'Jun 2026' },
  { title: 'Bloomberg Finance Fundamentals', issuer: 'Bloomberg', issued: 'May 2026' },
  { title: 'Getting Started with Cisco Packet Tracer', issuer: 'Cisco Networking Academy', issued: 'Nov 2025' },
  { title: 'Exploring Internet of Things with Cisco Packet Tracer', issuer: 'Cisco Networking Academy', issued: 'Nov 2025' },
  { title: 'Exploring Networking with Cisco Packet Tracer', issuer: 'Cisco Networking Academy', issued: 'Nov 2025' },
  { title: 'Java Foundations', issuer: 'Oracle', issued: 'Dec 2024' },
  { title: 'Lightning Experience Reports & Dashboards Specialist', issuer: 'Trailhead by Salesforce', issued: 'Nov 2024' },
];

/** Certifications grouped by issuer, keeping the newest-first order of first appearance. */
export function certificationsByIssuer(): { issuer: string; items: Certification[] }[] {
  const groups = new Map<string, Certification[]>();
  for (const cert of CERTIFICATIONS) {
    const list = groups.get(cert.issuer) ?? [];
    list.push(cert);
    groups.set(cert.issuer, list);
  }
  return [...groups].map(([issuer, items]) => ({ issuer, items }));
}
