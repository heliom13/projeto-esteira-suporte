package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.requests.CreateUserRequest
import br.com.horys.metro.controllers.requests.ListUserRequest
import br.com.horys.metro.controllers.requests.UpdateUserRequest
import br.com.horys.metro.controllers.requests.UserRequest
import br.com.horys.metro.controllers.requests.UserResetRequest
import br.com.horys.metro.controllers.response.UserResponse
import br.com.horys.metro.models.User
import br.com.horys.metro.services.UserService
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/v1/users")
class UserController(
    private val service: UserService
) {
    //    @Secured("ROLE_$USER_ROLE_ADMIN")
    @PutMapping("/{email:.+}/reset")
    fun reset(@PathVariable email: String, @RequestBody request: UserResetRequest) {
        service.reset(java.net.URLDecoder.decode(email, "UTF-8"), request.password)
    }

    @PostMapping("/admin")
    @ResponseStatus(HttpStatus.CREATED)
    fun createUserAdmin(
        @Valid @RequestBody createUserRequest: CreateUserRequest
    ): UserResponse = service.executeAdmin(createUserRequest)


    @GetMapping
    fun listUsers(query: ListUserRequest, page: Pageable): List<UserResponse> = service.findAll(query, page)

    @PostMapping("/basic")
    fun basic(@RequestBody request: UserRequest): UserResponse {
        val user = service.create(request)
        return UserResponse(
            id = user.id!!,
            name = user.name,
            username = user.username,
            email = user.email,
            role = user.role
        )
    }

    @PutMapping("/{id}")
    fun update(@Valid @RequestBody updateUserRequest: UpdateUserRequest, @PathVariable id: Long): User {
        return service.update(id, updateUserRequest)
    }
}