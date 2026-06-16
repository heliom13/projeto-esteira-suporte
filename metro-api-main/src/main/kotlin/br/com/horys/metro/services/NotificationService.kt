package br.com.horys.metro.services

import br.com.horys.metro.controllers.response.NotificationResponse
import br.com.horys.metro.exceptions.NotificationNotFoundException
import br.com.horys.metro.models.Notification.Destiny.NOTIFICATION
import br.com.horys.metro.models.Notification.Destiny.NOTIFICATION_AND_HISTORY
import br.com.horys.metro.repositories.NotificationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val userService: UserService
) {
    fun getUserNotifications(): List<NotificationResponse> {
        val currentUser = userService.getLoggedInUser()
        val destinies = listOf(NOTIFICATION, NOTIFICATION_AND_HISTORY)
        return notificationRepository.findTop30ByUserDestinyOrderByCreatedAtDesc(currentUser, destinies)
            .map { NotificationResponse.fromModel(it) }
    }

    @Transactional
    fun markAsRead(id: Long) {
        val notification = notificationRepository.findById(id).orElseThrow { NotificationNotFoundException() }
        notificationRepository.save(notification.copy(read = true))
    }
}