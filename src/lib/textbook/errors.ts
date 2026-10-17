// Rule violations raised by the pure textbook engines. The message is
// Estonian and child-safe (the server may show it as is); `code` is stable for
// the API layer to map to HTTP statuses.

export type TextbookRuleCode =
  | 'already_submitted'
  | 'unknown_question'
  | 'invalid_response'
  | 'incomplete_response'
  | 'not_all_answered'
  | 'practice_completed'
  | 'not_current_question'
  | 'invalid_state'
  | 'empty_pool';

export class TextbookRuleError extends Error {
  constructor(readonly code: TextbookRuleCode, message: string) {
    super(message);
  }
}
