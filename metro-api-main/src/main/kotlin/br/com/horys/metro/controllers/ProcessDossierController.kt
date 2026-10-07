package br.com.horys.metro.controllers

import br.com.horys.metro.controllers.response.ProcessDossierResponse
import br.com.horys.metro.controllers.response.ProcessLookupResponse
import br.com.horys.metro.services.ProcessDossierService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * Busca de processo por codigo/cliente e dossie completo. Rotas internas:
 * exigem login (nao estao na lista de rotas publicas do SecurityConfig).
 */
@RestController
@RequestMapping("/v1/processes")
class ProcessDossierController(
    private val service: ProcessDossierService
) {
    @GetMapping("/lookup")
    fun lookup(@RequestParam q: String): List<ProcessLookupResponse> = service.lookup(q)

    @GetMapping("/{id}/dossier")
    fun dossier(@PathVariable id: Long): ProcessDossierResponse = service.dossier(id)
}
