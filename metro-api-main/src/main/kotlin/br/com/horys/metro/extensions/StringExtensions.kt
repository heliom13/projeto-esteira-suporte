package br.com.horys.metro.extensions

fun String.cleanPhoneNumber(): String {
    // Mantem apenas digitos (remove espacos, parenteses, hifens, +, etc.)
    val digits = this.filter { it.isDigit() }
    // Se o numero ja vem com o codigo do pais (55 + DDD + numero = 12 ou 13 digitos),
    // nao adiciona outro 55. Caso contrario (DDD + numero), prefixa o 55.
    return if (digits.startsWith("55") && digits.length >= 12) digits else "55$digits"
}