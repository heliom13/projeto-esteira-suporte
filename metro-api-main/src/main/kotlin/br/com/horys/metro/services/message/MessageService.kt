package br.com.horys.metro.services.message

import br.com.horys.metro.configs.MessageConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class MessageService(
    private val whatsAppClient: WhatsAppClient,
    private val messageConfig: MessageConfig
) {
    val log: Logger = LoggerFactory.getLogger(this::class.java)
    fun sendMessage(messageRequest: MessageRequest) {
        GlobalScope.launch {
            try {
                withContext(Dispatchers.IO) {
                    whatsAppClient.sendMessage(messageRequest)
                }
            } catch (e: Exception) {
                log.error(e.message, e.cause)
            }
        }
    }
}