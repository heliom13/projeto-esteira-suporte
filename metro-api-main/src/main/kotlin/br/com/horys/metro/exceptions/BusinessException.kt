package br.com.horys.metro.exceptions

open class BusinessException(override val message: String) : RuntimeException(message)
