import { CERTIFICATIONS, certificationsByIssuer } from '../../../data/credentials';
import { BrutalCard } from '../../primitives/BrutalCard';
import { WindowChrome } from '../../primitives/WindowChrome';

const GROUPS = certificationsByIssuer();

/**
 * Certifications grouped by issuer in native <details> dropdowns, so nine items
 * fit in a small card. The newest issuer's group starts open.
 */
export function CertificationsCard({ className }: { className?: string }) {
  return (
    <BrutalCard as="section" tone="cobalt" aria-labelledby="certs-title" className={className}>
      <WindowChrome title="certs.log" />
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id="certs-title" className="display text-2xl">
            Certifications
          </h3>
          <p className="label text-muted">
            {CERTIFICATIONS.length} / {GROUPS.length} issuers
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {GROUPS.map((group, index) => (
            <details key={group.issuer} className="disclosure" open={index === 0}>
              <summary>
                <span className="label flex-1">{group.issuer}</span>
                <span className="label text-muted">{String(group.items.length).padStart(2, '0')}</span>
              </summary>
              <ul className="flex flex-col gap-2 border-2 border-t-0 border-line px-3 py-3">
                {group.items.map((cert) => (
                  <li key={cert.title} className="flex flex-col">
                    <span className="text-sm font-medium">{cert.title}</span>
                    <span className="label text-muted">{cert.issued}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </BrutalCard>
  );
}
