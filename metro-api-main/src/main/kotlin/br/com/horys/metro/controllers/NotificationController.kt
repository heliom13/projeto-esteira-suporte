package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.response.NotificationResponse
import br.com.horys.metro.services.NotificationService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/notifications")
class NotificationController(
    private val notificationService: NotificationService
) {
    @GetMapping
    fun getUserNotifications(): List<NotificationResponse> {
        return notificationService.getUserNotifications()
    }

    @PutMapping("/{id}/read")
    fun markAsRead(@PathVariable id: Long) {
        notificationService.markAsRead(id)
    }
}