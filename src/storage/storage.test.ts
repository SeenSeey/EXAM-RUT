import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, restoreState, serializeState } from './storage';
describe('хранилище', () => { it('сериализует и восстанавливает состояние', () => expect(restoreState(serializeState(DEFAULT_STATE))).toEqual(DEFAULT_STATE)); it('безопасно сбрасывает несовместимое состояние', () => expect(restoreState('{"version":99}')).toEqual(DEFAULT_STATE)); });
