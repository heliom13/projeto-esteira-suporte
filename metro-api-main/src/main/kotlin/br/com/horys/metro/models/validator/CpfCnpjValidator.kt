package br.com.horys.metro.models.validator

import java.util.InputMismatchException
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext


class CpfCnpjValidator : ConstraintValidator<CpfCnpj, String?> {
    override fun initialize(constraintAnnotation: CpfCnpj) {}
    override fun isValid(value: String?, context: ConstraintValidatorContext): Boolean {
        return value == null || value.isEmpty() || isCpf(value) || isCnpj(value)
    }

    /**
     * Realiza a validação do CPF.
     *
     * @param cpf número de CPF a ser validado pode ser passado no formado 999.999.999-99 ou
     * 99999999999
     * @return true se o CPF é válido e false se não é válido
     */
    private fun isCpf(cpf: String): Boolean {
        var cpf = cpf
        cpf = cpf.replace(".", "")
        cpf = cpf.replace("-", "")
        try {
            cpf.toLong()
        } catch (e: NumberFormatException) {
            return false
        }
        var d1: Int
        var d2: Int
        var digito1: Int
        var digito2: Int
        var resto: Int
        var digitoCPF: Int
        val nDigResult: String
        d2 = 0
        d1 = d2
        resto = 0
        digito2 = resto
        digito1 = digito2
        for (nCount in 1 until cpf.length - 1) {
            digitoCPF = Integer.valueOf(cpf.substring(nCount - 1, nCount)).toInt()

            // multiplique a ultima casa por 2 a seguinte por 3 a seguinte por 4
            // e assim por diante.
            d1 = d1 + (11 - nCount) * digitoCPF

            // para o segundo digito repita o procedimento incluindo o primeiro
            // digito calculado no passo anterior.
            d2 = d2 + (12 - nCount) * digitoCPF
        }

        // Primeiro resto da divisão por 11.
        resto = d1 % 11

        // Se o resultado for 0 ou 1 o digito é 0 caso contrário o digito é 11
        // menos o resultado anterior.
        digito1 = if (resto < 2) 0 else 11 - resto
        d2 += 2 * digito1

        // Segundo resto da divisão por 11.
        resto = d2 % 11

        // Se o resultado for 0 ou 1 o digito é 0 caso contrário o digito é 11
        // menos o resultado anterior.
        digito2 = if (resto < 2) 0 else 11 - resto

        // Digito verificador do CPF que está sendo validado.
        val nDigVerific = cpf.substring(cpf.length - 2, cpf.length)

        // Concatenando o primeiro resto com o segundo.
        nDigResult = digito1.toString() + digito2.toString()

        // comparar o digito verificador do cpf com o primeiro resto + o segundo
        // resto.
        return nDigVerific == nDigResult
    }

    /**
     * Realiza a validação de um cnpj
     *
     * @param cnpj String - o CNPJ pode ser passado no formato 99.999.999/9999-99 ou 99999999999999
     * @return boolean
     */
    private fun isCnpj(cnpj: String): Boolean {
        var cnpj = cnpj
        cnpj = cnpj.replace(".", "")
        cnpj = cnpj.replace("-", "")
        cnpj = cnpj.replace("/", "")
        try {
            cnpj.toLong()
        } catch (e: NumberFormatException) {
            return false
        }

        // considera-se erro CNPJ's formados por uma sequencia de numeros iguais
        if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999" || cnpj.length != 14) return false
        val dig13: Char
        val dig14: Char
        var sm: Int
        var i: Int
        var r: Int
        var num: Int
        var peso: Int // "try" - protege o código para eventuais
        // erros de conversao de tipo (int)
        return try {
            // Calculo do 1o. Digito Verificador
            sm = 0
            peso = 2
            i = 11
            while (i >= 0) {

                // converte o i-ésimo caractere do CNPJ em um número: // por
                // exemplo, transforma o caractere '0' no inteiro 0 // (48 eh a
                // posição de '0' na tabela ASCII)
                num = (cnpj[i].code - 48)
                sm = sm + num * peso
                peso = peso + 1
                if (peso == 10) peso = 2
                i--
            }
            r = sm % 11
            dig13 = if (r == 0 || r == 1) '0' else (11 - r + 48).toChar()

            // Calculo do 2o. Digito Verificador
            sm = 0
            peso = 2
            i = 12
            while (i >= 0) {
                num = (cnpj[i].code - 48)
                sm = sm + num * peso
                peso = peso + 1
                if (peso == 10) peso = 2
                i--
            }
            r = sm % 11
            dig14 = if (r == 0 || r == 1) '0' else (11 - r + 48).toChar()
            // Verifica se os dígitos calculados conferem com os dígitos
            // informados.
            if (dig13 == cnpj[12] && dig14 == cnpj[13]) true else false
        } catch (erro: InputMismatchException) {
            false
        }
    }
}