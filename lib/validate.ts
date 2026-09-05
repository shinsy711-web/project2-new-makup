// DB 폼 입력 검증 — project23/29 계승 (수신 서버가 PHP 시절 규칙을 그대로 쓰기 때문에 형식을 맞춘다)

export type FormData = {
  customer_name: string;
  customer_birth: string;
  mobile1: string;
  mobile2: string;
  customer_sex: string;
  region: string;
  privacy: boolean;
};

export type ParsedPhone = {
  mobile1: string;
  mobile2: string;
};

export const SPECIAL_CHAR_REG = /[ \{\}\[\]\/.,;:|\)*~`^\-_+┼<>\%\'\"\\\(\=]/i;

export function validateForm(data: FormData): string | null {
  if (!data.customer_name) return '이름을 입력해 주세요.';
  if (SPECIAL_CHAR_REG.test(data.customer_name)) return '이름에 특수문자는 입력하실 수 없습니다.';
  if (data.customer_name.length > 8) return '이름을 다시 입력해 주세요.';

  if (!data.customer_birth) return '생년월일을 입력해 주세요.';
  if (!/^\d{6}$/.test(data.customer_birth)) return '생년월일 6자리 숫자만 입력해 주세요.';
  const month = parseInt(data.customer_birth.slice(2, 4));
  const day = parseInt(data.customer_birth.slice(4, 6));
  if (month < 1 || month > 12) return '생년월일을 다시 확인해 주세요.';
  if (day < 1 || day > 31) return '생년월일을 다시 확인해 주세요.';

  if (!data.customer_sex) return '성별을 선택해 주세요.';

  if (!data.mobile2) return '전화번호를 다시 입력해 주세요.';
  if (!/^\d+$/.test(data.mobile2)) return '전화번호는 숫자만 입력해 주세요.';
  if (data.mobile2.length < 8) return '전화번호 8자리를 입력해 주세요.';

  if (!data.privacy) return '개인정보 수집 및 활용에 동의해 주세요.';

  return null;
}

export function parsePhone(mobile1: string, mobile2: string): ParsedPhone | string {
  const isValidPrefix = /^(010|011|016|017|018|019)/.test(mobile2.slice(0, 3));

  if (mobile2.length === 8) {
    if (isValidPrefix) return '전화번호를 다시 입력해 주세요.';
    return { mobile1, mobile2 };
  }

  if (mobile2.length === 11) {
    if (isValidPrefix) {
      return { mobile1: mobile2.slice(0, 3), mobile2: mobile2.slice(3) };
    }
    return '전화번호를 다시 입력해 주세요.';
  }

  return '전화번호를 다시 입력해 주세요.';
}

/** 생년월일 6자리(YYMMDD)로 만 14세 미만 여부 판정 — 법정대리인 동의 항목 노출 조건 */
export function isUnder14(birth: string): boolean {
  if (!/^\d{6}$/.test(birth)) return false;
  const yy = parseInt(birth.slice(0, 2));
  const mm = parseInt(birth.slice(2, 4));
  const dd = parseInt(birth.slice(4, 6));
  const nowYY = new Date().getFullYear() % 100;
  const fullYear = yy > nowYY ? 1900 + yy : 2000 + yy;
  const today = new Date();
  let age = today.getFullYear() - fullYear;
  if (today.getMonth() + 1 < mm || (today.getMonth() + 1 === mm && today.getDate() < dd)) age--;
  return age < 14;
}
