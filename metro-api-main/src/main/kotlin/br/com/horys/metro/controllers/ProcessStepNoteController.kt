package br.com.horys.metro.controllers

import br.com.horys.metro.models.ProcessStepNote
import br.com.horys.metro.repositories.ProcessStepNoteRepository
import br.com.horys.metro.repositories.ProcessStepRepository
import br.com.horys.metro.services.UserService
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import javax.validation.constraints.NotBlank

@RestController
@RequestMapping("/v1/process-steps")
class ProcessStepNoteController(
    private val processStepRepository: ProcessStepRepository,
    private val noteRepository: ProcessStepNoteRepository,
    private val userService: UserService
) {
    data class NoteRequest(@field:NotBlank val content: String)

    data class NoteResponse(
        val id: Long,
        val content: String,
        val userName: String,
        val createdAt: LocalDateTime
    )

    @GetMapping("/{processStepId}/notes")
    fun getNotes(@PathVariable processStepId: Long): List<NoteResponse> {
        return noteRepository.findByProcessStep_IdOrderByCreatedAtAsc(processStepId)
            .map { NoteResponse(it.id!!, it.content, it.userName, it.createdAt) }
    }

    @PostMapping("/{processStepId}/notes")
    fun addNote(@PathVariable processStepId: Long, @RequestBody request: NoteRequest): NoteResponse {
        val processStep = processStepRepository.findById(processStepId)
            .orElseThrow { IllegalArgumentException("Etapa não encontrada") }
        val user = userService.getLoggedInUser()
        val note = noteRepository.save(
            ProcessStepNote(
                processStep = processStep,
                content = request.content,
                userName = user.name
            )
        )
        return NoteResponse(note.id!!, note.content, note.userName, note.createdAt)
    }
}
