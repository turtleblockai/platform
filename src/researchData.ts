export const SCREENING_VERSION = "0.2";

export type ScreeningStatus = "clean" | "needs_review" | "rejected";
export type FindingSeverity = "info" | "review" | "reject";

export interface ScreeningFinding {
  id: string;
  type: string;
  severity: FindingSeverity;
  start: number;
  end: number;
  replacement: string;
}

export interface ScreeningResult {
  version: string;
  status: ScreeningStatus;
  redacted_text: string;
  redaction_applied: boolean;
  findings: ScreeningFinding[];
}

type PatternRule = {
  type: string;
  severity: FindingSeverity;
  replacement: string;
  pattern: RegExp;
};

const RULES: PatternRule[] = [
  {
    type: "email_address",
    severity: "review",
    replacement: "[EMAIL REDACTED]",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  },
  {
    type: "phone_number",
    severity: "review",
    replacement: "[PHONE REDACTED]",
    pattern: /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g
  },
  {
    type: "social_security_number",
    severity: "reject",
    replacement: "[SSN REDACTED]",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g
  },
  {
    type: "payment_card_like_number",
    severity: "reject",
    replacement: "[CARD NUMBER REDACTED]",
    pattern: /\b(?:\d[ -]*?){13,19}\b/g
  },
  {
    type: "credential_like_value",
    severity: "reject",
    replacement: "$1[SECRET REDACTED]",
    pattern: /\b(password|passcode|api[_ -]?key|secret|token)\s*[:=]\s*[^\s,;]+/gi
  }
];

/**
 * First-pass research screening. This intentionally errs toward human review.
 * It is not represented as a complete safety, PII, or content-moderation system.
 * Future model/provider screening can add findings before dataset approval.
 */
export function screenResearchInput(input: string): ScreeningResult {
  const findings: ScreeningFinding[] = [];
  const matches: Array<{ start: number; end: number; replacement: string }> = [];

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    for (const match of input.matchAll(rule.pattern)) {
      if (match.index == null) continue;
      const start = match.index;
      const end = start + match[0].length;
      findings.push({
        id: crypto.randomUUID(),
        type: rule.type,
        severity: rule.severity,
        start,
        end,
        replacement: rule.replacement.replace("$1", match[1] ? `${match[1]}: ` : "")
      });
      matches.push({
        start,
        end,
        replacement: rule.replacement.replace("$1", match[1] ? `${match[1]}: ` : "")
      });
    }
  }

  // Apply replacements from the end of the string so offsets remain valid.
  let redacted = input;
  for (const match of matches.sort((a, b) => b.start - a.start)) {
    redacted = redacted.slice(0, match.start) + match.replacement + redacted.slice(match.end);
  }

  const status: ScreeningStatus = findings.some((f) => f.severity === "reject")
    ? "rejected"
    : findings.some((f) => f.severity === "review")
      ? "needs_review"
      : "clean";

  return {
    version: SCREENING_VERSION,
    status,
    redacted_text: redacted,
    redaction_applied: redacted !== input,
    findings
  };
}

export function candidateDatasetStatus(screening: ScreeningResult) {
  return screening.status === "clean" ? "candidate" : screening.status === "rejected" ? "rejected" : "raw";
}
