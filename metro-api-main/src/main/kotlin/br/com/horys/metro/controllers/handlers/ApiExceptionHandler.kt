package br.com.horys.metro.controllers.handlers

import br.com.horys.metro.exceptions.BusinessException
import br.com.horys.metro.exceptions.ResourceNotFoundException
import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.exc.InvalidFormatException
import com.fasterxml.jackson.databind.exc.PropertyBindingException
import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import org.apache.commons.lang3.exception.ExceptionUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.TypeMismatchException
import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.FieldError
import org.springframework.validation.ObjectError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.servlet.NoHandlerFoundException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.time.OffsetDateTime
import java.util.stream.Collectors
import java.util.stream.Collectors.toList
import javax.persistence.EntityNotFoundException

@ControllerAdvice
class ApiExceptionHandler(
    private val messageSource: MessageSource
) : ResponseEntityExceptionHandler() {
    val log: Logger = LoggerFactory.getLogger(this.javaClass)
    override fun handleMethodArgumentNotValid(
        ex: MethodArgumentNotValidException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val detail = "Um ou mais campos estão inválidos. Faça o preenchimento correto e tente novamente."
        val bindingResult = ex.bindingResult
        val problemObjects = bindingResult.allErrors.stream()
            .map { objectError: ObjectError ->
                val message: String = messageSource.getMessage(objectError, LocaleContextHolder.getLocale())
                var name: String = objectError.objectName
                if (objectError is FieldError) {
                    name = objectError.field
                }
                Problem.Object(
                    name = name,
                    message = message
                )
            }
            .collect(toList())
        val problem: Problem = createProblemBuilder(status, detail).copy(
            objects = problemObjects as List<Problem.Object>
        )

        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    @ExceptionHandler(Exception::class)
    fun handleUncaught(ex: Exception, request: WebRequest): ResponseEntity<Any> {
        val status = HttpStatus.INTERNAL_SERVER_ERROR
        val detail = MSG_ERRO_GENERICA_USUARIO_FINAL

        val problem: Problem = createProblemBuilder(status, detail)

        return handleExceptionInternal(ex, problem, HttpHeaders(), status, request)
    }

//    @ExceptionHandler(org.springframework.security.access.AccessDeniedException::class)
//    fun handleAccess(ex: Exception, request: WebRequest): ResponseEntity<Any> {
//        val status = HttpStatus.FORBIDDEN
//        val detail = "Acesso Invalido"
//
//        val problem: Problem = createProblemBuilder(status, detail)
//
//        return handleExceptionInternal(ex, problem, HttpHeaders(), status, request)
//    }

    override fun handleNoHandlerFoundException(
        ex: NoHandlerFoundException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {

        val detail = String.format(
            "O recurso %s, que você tentou acessar, é inexistente.",
            ex.requestURL
        )
        val problem: Problem =
            createProblemBuilder(status, detail)
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    override fun handleTypeMismatch(
        ex: TypeMismatchException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        log.error(ex.message)
        return if (ex is MethodArgumentTypeMismatchException) {
            handleMethodArgumentTypeMismatch(
                ex, headers, status, request
            )
        } else super.handleTypeMismatch(ex, headers, status, request)
    }

    private fun handleMethodArgumentTypeMismatch(
        ex: MethodArgumentTypeMismatchException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val detail = String.format(
            "O parâmetro de URL '%s' recebeu o valor '%s', " +
                "que é de um tipo inválido. Corrija e informe um valor compatível com o tipo %s.",
            ex.name, ex.value, ex.requiredType!!.simpleName
        )
        val problem: Problem =
            createProblemBuilder(status, detail)
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    override fun handleHttpMessageNotReadable(
        ex: HttpMessageNotReadableException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val rootCause: Throwable = ExceptionUtils.getRootCause(ex)
        if (rootCause is InvalidFormatException) {
            return handleInvalidFormat(rootCause, headers, status, request)
        } else if (rootCause is PropertyBindingException) {
            return handlePropertyBinding(rootCause, headers, status, request)
        }
        if (rootCause is MissingKotlinParameterException) {
            return handleMissingKotlinFormat(rootCause, headers, status, request)
        }
        val detail = "O corpo da requisição está inválido. Verifique erro de sintaxe."
        val problem = createProblemBuilder(status, detail)
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    private fun handleMissingKotlinFormat(
        ex: MissingKotlinParameterException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val path = joinPath(ex.path)
        val detail = String.format(
            (
                "A propriedade '%s' não existe. " +
                    "Corrija ou remova essa propriedade e tente novamente."
                ),
            path
        )
        val problem =
            createProblemBuilder(status, detail)
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    private fun handlePropertyBinding(
        ex: PropertyBindingException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val path = joinPath(ex.path)
        val detail = String.format(
            (
                "A propriedade '%s' não existe. " +
                    "Corrija ou remova essa propriedade e tente novamente."
                ),
            path
        )
        val problem =
            createProblemBuilder(status, detail)
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    private fun handleInvalidFormat(
        ex: InvalidFormatException,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        val path = joinPath(ex.path)
        val detail = String.format(
            (
                "A propriedade '%s' recebeu o valor '%s', " +
                    "que é de um tipo inválido. Corrija e informe um valor compatível com o tipo %s."
                ),
            path, ex.value, ex.targetType.simpleName
        )
        val problem = createProblemBuilder(status, detail)
            .copy(message = MSG_ERRO_GENERICA_USUARIO_FINAL)
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, headers, status, request)
    }

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleResourceNotFoundException(
        ex: ResourceNotFoundException,
        request: WebRequest
    ): ResponseEntity<*> {
        val status = HttpStatus.NOT_FOUND
        val detail = ex.message
        val problem: Problem = createProblemBuilder(status, detail)
            .copy(
                message = detail
            )
        log.error(ex.message)
        return handleExceptionInternal(ex, problem, HttpHeaders(), status, request)
    }

    @ExceptionHandler(BusinessException::class)
    fun handleNegocio(ex: BusinessException, request: WebRequest): ResponseEntity<*> {
        val status = HttpStatus.BAD_REQUEST
        val detail = ex.message
        val problem =
            createProblemBuilder(status, MSG_ERRO_GENERICA_USUARIO_FINAL)
                .copy(
                    message = detail
                )
        return handleExceptionInternal(ex, problem, HttpHeaders(), status, request)
    }

    override fun handleExceptionInternal(
        ex: Exception,
        body: Any?,
        headers: HttpHeaders,
        status: HttpStatus,
        request: WebRequest
    ): ResponseEntity<Any> {
        var body = body
        if (ex is EntityNotFoundException) {
            body = Problem(
                timestamp = OffsetDateTime.now(),
                status = status.value(),
                message = MSG_ERRO_GENERICA_USUARIO_FINAL
            )
        } else if (body == null) {
            body = Problem(
                timestamp = OffsetDateTime.now(),
                status = status.value(),
                message = MSG_ERRO_GENERICA_USUARIO_FINAL
            )
        } else if (body is String) {
            body = Problem(
                timestamp = OffsetDateTime.now(),
                status = status.value(),
                message = MSG_ERRO_GENERICA_USUARIO_FINAL
            )
        }
        log.error(ex.message)
        return super.handleExceptionInternal(ex, body, headers, status, request)
    }

    private fun createProblemBuilder(
        status: HttpStatus,
        message: String?
    ): Problem {
        return Problem(
            timestamp = OffsetDateTime.now(),
            status = status.value(),
            message = message
        )
    }

    private fun joinPath(references: List<JsonMappingException.Reference>): String {
        return references.stream()
            .map { ref: JsonMappingException.Reference -> ref.fieldName }
            .collect(Collectors.joining("."))
    }

    companion object {
        const val MSG_ERRO_GENERICA_USUARIO_FINAL =
            (
                "Ocorreu um erro interno inesperado no sistema. Tente novamente"
                )
    }
}
