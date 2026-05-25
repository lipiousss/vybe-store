export function maskRuPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  const normalized = digits.startsWith('7')
    ? digits.slice(1)
    : digits.startsWith('8')
      ? digits.slice(1)
      : digits;
  const limited = normalized.slice(0, 10);
  const parts = {
    code: limited.slice(0, 3),
    first: limited.slice(3, 6),
    second: limited.slice(6, 8),
    third: limited.slice(8, 10),
  };

  let result = '+7';

  if (parts.code) {
    result += ` (${parts.code}`;
  }

  if (parts.code.length === 3) {
    result += ')';
  }

  if (parts.first) {
    result += ` ${parts.first}`;
  }

  if (parts.second) {
    result += `-${parts.second}`;
  }

  if (parts.third) {
    result += `-${parts.third}`;
  }

  return result;
}
