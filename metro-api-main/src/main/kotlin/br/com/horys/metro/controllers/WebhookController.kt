package br.com.horys.metro.controllers

import br.com.horys.metro.repositories.BoardRepository
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/webhook")
class WebhookController(
    private val boardRepository: BoardRepository
) {

    @PostMapping
    fun webhook(@RequestBody body: WebhookRequest): BoardResponse {
        val board = boardRepository.findByExternalId(body.uuid)

        var response = BoardResponse("Não localizado!: ${body.uuid} ")

        if (board != null) {

            if (board.checked) {
                response = BoardResponse("Checkin ja foi realizado anteriormente: ${board.name}")
                return response;
            }

            board.checked = true
            boardRepository.save(board)
            response = BoardResponse("Checkin realizado: ${board.name}")
            return response;
        }

        return response
    }

    class BoardResponse(
        val description: String
    )

    class WebhookRequest(
        val uuid: String
    )
}