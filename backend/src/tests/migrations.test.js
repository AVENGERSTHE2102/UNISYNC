const fs = require('fs');
const path = require('path');

function readMigration(name) {
  return fs.readFileSync(path.resolve(__dirname, '..', 'migrations', name), 'utf8');
}

describe('migration schema contracts', () => {
  test('user migration uses normalized auth/profile columns', () => {
    const source = readMigration('20251014091028-create-user.js');
    expect(source).toContain('passwordHash');
    expect(source).toContain('role');
    expect(source).toContain('professionalRole');
    expect(source).toContain('JSONB');
  });

  test('discussion migrations use authorId and body fields', () => {
    const threadSource = readMigration('20251014091419-create-thread.js');
    const replySource = readMigration('20251014091502-create-reply.js');

    expect(threadSource).toContain('authorId');
    expect(threadSource).toContain('body');
    expect(replySource).toContain('authorId');
    expect(replySource).toContain('body');
  });

  test('event and job migrations include normalized metadata fields', () => {
    const eventSource = readMigration('20251014091552-create-event.js');
    const jobSource = readMigration('20251014091810-create-job.js');

    expect(eventSource).toContain('organizerId');
    expect(eventSource).toContain('location');
    expect(eventSource).toContain('type');
    expect(jobSource).toContain('createdBy');
    expect(jobSource).toContain('contactEmail');
    expect(jobSource).toContain('type');
  });
});
