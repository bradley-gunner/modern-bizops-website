import { describe, it, expect } from 'vitest';
import { NEW_LEAD_STAGE, DISCOVERY_CALL_BOOKED_STAGE, REVOPS_PIPELINE_ID } from '@/lib/hubspot';

describe('hubspot RevOps pipeline constants', () => {
  it('exports REVOPS_PIPELINE_ID = "2172760768"', () => {
    expect(REVOPS_PIPELINE_ID).toBe('2172760768');
  });

  it('exports NEW_LEAD_STAGE = "3477396169"', () => {
    expect(NEW_LEAD_STAGE).toBe('3477396169');
  });

  it('exports DISCOVERY_CALL_BOOKED_STAGE = "3477396170"', () => {
    expect(DISCOVERY_CALL_BOOKED_STAGE).toBe('3477396170');
  });

  it('NEW_LEAD_STAGE precedes DISCOVERY_CALL_BOOKED_STAGE in sequence', () => {
    expect(Number(NEW_LEAD_STAGE) + 1).toBe(Number(DISCOVERY_CALL_BOOKED_STAGE));
  });
});
