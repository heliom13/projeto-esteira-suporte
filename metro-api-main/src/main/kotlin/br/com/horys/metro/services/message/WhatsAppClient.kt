package br.com.horys.metro.services.message

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@FeignClient(value = "whatsapp", url = "https://zaping.io:8445/api/66f40effc433c280144b9894")
interface WhatsAppClient {
    @PostMapping
    fun sendMessage(@RequestBody messageRequest: MessageRequest)
}