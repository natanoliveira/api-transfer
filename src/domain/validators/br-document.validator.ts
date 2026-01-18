function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function hasAllSameDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

export function isValidCpf(input: string): boolean {
  const cpf = onlyDigits(input);
  if (cpf.length !== 11 || hasAllSameDigits(cpf)) {
    return false;
  }

  const digits = cpf.split('').map(Number);
  const calcCheck = (length: number, weightStart: number) => {
    let sum = 0;
    for (let i = 0; i < length; i += 1) {
      sum += digits[i] * (weightStart - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const first = calcCheck(9, 10);
  if (first !== digits[9]) {
    return false;
  }
  const second = calcCheck(10, 11);
  return second === digits[10];
}

export function isValidCnpj(input: string): boolean {
  const cnpj = onlyDigits(input);
  if (cnpj.length !== 14 || hasAllSameDigits(cnpj)) {
    return false;
  }

  const digits = cnpj.split('').map(Number);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calcCheck = (weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i += 1) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const first = calcCheck(weights1);
  if (first !== digits[12]) {
    return false;
  }
  const second = calcCheck(weights2);
  return second === digits[13];
}
