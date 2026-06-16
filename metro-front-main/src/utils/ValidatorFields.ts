/* eslint-disable no-template-curly-in-string */
export const validateMessages = {
  required: "${label} é obrigatório!",
  types: {
    email: "${label} e-mail inválido!",
    number: "${label} não é um número válido!",
  },
  number: {
    range: "${label} o valor não está entre ${min} e ${max}",
  },
};

export const required = [
  {
    required: true,
  },
];

export const formatCurrency = (event) => {
  const onlyDigits = event.target.value
      .split("")
      .filter(s => /\d/.test(s))
      .join("")
      .padStart(3, "0")
  const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
  return event.target.value = maskCurrency(digitsFloat)
}

const maskCurrency = (valor, locale = 'pt-BR', currency = 'BRL') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(valor)
}

export const formattedValue = (value) => {
  const stringValue = value ? value.toString() : "";
  const formattedValue = stringValue
      .replace(/\D/g, "") // Remove non-numeric characters
  const floatValue = parseFloat(formattedValue) / 100; // Convert to float (assuming value is in cents)

  return isNaN(floatValue) ? 0 : floatValue;
}

export const validateMessages2 = {
  required: '${label} é obrigatorio!',
  types: {
    email: '${label} email invalido!',
    number: '${label} não é um numero valido!'
  },
  number: {
    range: '${label} o valor não está entre ${min} e ${max}'
  }
}
