package br.com.horys.metro.extensions

fun String.cleanPhoneNumber(): String {
    return "55" + this.replace(" ", "")
        .replace("(", "")
        .replace(")", "")
        .replace("-", "")
}