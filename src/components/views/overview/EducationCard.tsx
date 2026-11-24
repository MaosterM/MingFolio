import { EDUCATION } from '../../../data/credentials';
import { BrutalCard } from '../../primitives/BrutalCard';
import { WindowChrome } from '../../primitives/WindowChrome';

/**
 * Education as a vertical timeline: a 2px rail with a square anchor per entry,
 * the same connector language as the Systems graph. Newest first.
 */
export function EducationCard({ className }: { className?: string }) {
  return (
    <BrutalCard as="section" aria-labelledby="education-title" className={className}>
      <WindowChrome title="education.log" />
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <h3 id="education-title" className="display text-2xl">
          Education
        </h3>
        <ol className="relative flex flex-col gap-6 border-l-2 border-line pl-6">
          {EDUCATION.map((entry) => (
            <li key={entry.id} className="relative flex flex-col gap-1">
              {/* Square anchor sitting on the rail */}
              <span aria-hidden="true" className="absolute top-1.5 -left-[1.95rem] size-3 border-2 border-line bg-yellow" />
              <p className="label text-muted">{entry.period}</p>
              <p className="text-lg font-semibold leading-tight">{entry.institution}</p>
              {entry.qualification && <p>{entry.qualification}</p>}
              {entry.notes.length > 0 && (
                <ul className="mt-1 flex flex-col gap-1 text-sm">
                  {entry.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span aria-hidden="true" className="text-cobalt">
                        →
                      </span>
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </BrutalCard>
  );
}
