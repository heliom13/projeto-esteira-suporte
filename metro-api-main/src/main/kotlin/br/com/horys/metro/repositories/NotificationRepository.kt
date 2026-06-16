package br.com.horys.metro.repositories

import br.com.horys.metro.models.Notification
import br.com.horys.metro.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface NotificationRepository : JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.userDestiny = :user and n.destiny in :destinies ORDER BY n.createdAt DESC")
    fun findTop30ByUserDestinyOrderByCreatedAtDesc(
        @Param("user") user: User,
        @Param("destinies") destinies: List<Notification.Destiny>
    ): List<Notification>

    @Query("SELECT n FROM Notification n WHERE n.process.id = :processId and n.destiny in :destinies ORDER BY n.createdAt DESC")
    fun findByProcessIdOrderByCreatedAtDesc(
        @Param("processId") processId: Long,
        @Param("destinies") destinies: List<Notification.Destiny>
    ): List<Notification>
}