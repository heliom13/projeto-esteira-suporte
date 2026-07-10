package br.com.horys.metro.services

import br.com.horys.metro.extensions.cleanPhoneNumber
import br.com.horys.metro.models.Client
import br.com.horys.metro.models.Process
import br.com.horys.metro.models.ProcessStep
import br.com.horys.metro.models.Property
import br.com.horys.metro.repositories.FlowStepRepository
import br.com.horys.metro.services.message.MessageRequest
import br.com.horys.metro.services.message.MessageService
import org.springframework.stereotype.Service

@Service
class ProcessMessageService(
    private val messageService: MessageService,
    private val flowStepRepository: FlowStepRepository
) {
    companion object {
        const val linkFront = "https://sistema.suporteimobiliario.com/external"
        const val messageLink = " \nVocê pode acompanhar todo o seu processo por este link a seguir 👉 "
    }

    fun sendNewProcess(process: Process) {
        val nameProperty = process.property?.description ?: "imóvel"
        val pathProperty = getPathProperty(process)
        val pathClient = getPathClient(process)

        if (process.client != null) {
            val messageClient =
                "Olá ${process.client.name}, tudo bem? 😊\nPassando pra avisar que iniciamos o seu processo de financiamento do imóvel *$nameProperty*. Você receberá as novidades por aqui! 🏠🍀"
                    .plus(messageLink).plus(pathClient)
            sendForClient(process.client, messageClient)
        }

        if (process.property != null) {
            val messageProperty =
                "Olá ${process.property.ownerName}, tudo bem? 😊\nPassando pra avisar que iniciamos o processo de venda do imóvel *$nameProperty*. Você receberá as atualizações por aqui! 🏠🍀"
                    .plus(messageLink).plus(pathProperty)
            sendForProperty(process.property, messageProperty)
        }

        sendNewProcessForSeller(process)
    }

    fun sendFinishSale(process: Process) {
        if (!process.flow.sendMessage) {
            return
        }

        if (process.client != null) {
            val messageClient =
                "Olá ${process.client.name}, finalizamos o seu processo: ${process.property?.description} 😍🫶"
                    .plus("\nGostariamos de agradecer a confiança que nos foi depositada. Desejamos toda a felicidade e sucesso do mundo para você e sua família 💙💙")
                    .plus("\nEstaremos sempre a sua disposição para um proximo processo.")
            sendForClient(process.client, messageClient)
        }

        if (process.property != null) {
            val messageProperty =
                "Olá ${process.property.ownerName}, finalizamos o seu processo: ${process.property.description} 😍🫶"
                    .plus("\nGostariamos de agradecer a confiança que nos foi depositada. Desejamos toda a felicidade e sucesso do mundo para você e sua família 💙💙")
                    .plus("\nEstaremos sempre a sua disposição para um proximo processo.")
            sendForProperty(process.property, messageProperty)
        }

        sendFinishSaleForSeller(process)
    }

    private fun sendFinishSaleForSeller(process: Process) {
        if (!process.flow.sendMessage) {
            return
        }

        val nameProperty = process.property?.description ?: "imóvel"
        val nameComprador = process.client?.name ?: "comprador"
        val nameVendedor = process.property?.ownerName ?: "vendedor"

        process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nFinalizamos o processo de compra e venda do imóvel *$nameProperty* com o comprador *$nameComprador* e vendedor *$nameVendedor*. 😍🫶"
                        .plus("\nGostaríamos de agradecer a confiança depositada. Ficamos muito felizes em participar deste processo!")
                        .plus("\nConte sempre conosco! Sucesso e boas vendas! 🤝"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nFinalizamos o processo de compra e venda do imóvel *$nameProperty* com o comprador *$nameComprador* e vendedor *$nameVendedor*. 😍🫶"
                        .plus("\nGostaríamos de agradecer a confiança depositada. Ficamos muito felizes em participar deste processo!")
                        .plus("\nConte sempre conosco! Sucesso e boas vendas! 🤝"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }
    }

    private fun getStepObservation(processStep: ProcessStep): String? {
        return flowStepRepository.findByFlowOrderedSteps(processStep.process.flow.id!!)
            .find { it.step.id == processStep.step.id }?.observation
    }

    private fun getPathClient(process: Process): String {
        return "$linkFront/cliente-comprador/${process.client?.externalId}"
    }

    private fun getPathProperty(process: Process): String {
        return "$linkFront/imovel/${process.property?.externalId}"
    }

    fun sendNextStepSale(processStep: ProcessStep, runtimeNote: String? = null) {
        if (!processStep.process.flow.sendMessage) {
            return
        }

        val nameProperty = processStep.process.property?.description ?: "imóvel"
        val etapa = processStep.getDescriptionStep()
        val flowObs = getStepObservation(processStep)
        val notes = listOfNotNull(
            flowObs?.takeIf { it.isNotBlank() },
            runtimeNote?.takeIf { it.isNotBlank() }
        ).joinToString("\n")
        val observationSuffix = if (notes.isNotBlank()) "\n\n📝 $notes" else ""

        if (processStep.process.client != null) {
            val messageClient =
                "Olá ${processStep.process.client.name}, tudo bem? 😊\nPassando pra avisar que o seu processo de financiamento do imóvel *$nameProperty* está na etapa: *$etapa* 🏠$observationSuffix"
                    .plus(messageLink)
                    .plus(getPathClient(processStep.process))
            sendForClient(processStep.process.client, messageClient)
        }

        if (processStep.process.property != null) {
            val messageProperty =
                "Olá ${processStep.process.property.ownerName}, tudo bem? 😊\nPassando pra avisar que a venda do imóvel *$nameProperty* está na etapa: *$etapa* 🏠$observationSuffix"
                    .plus(messageLink)
                    .plus(getPathProperty(processStep.process))
            sendForProperty(processStep.process.property, messageProperty)
        }

        sendForSeller(processStep, observationSuffix)
    }

    fun sendNextStepUnforeseenSale(processStep: ProcessStep) {
        if (!processStep.process.flow.sendMessage) {
            return
        }

        val observation = getStepObservation(processStep)
        val observationSuffix = if (!observation.isNullOrBlank()) "\n\n📝 $observation" else ""

        if (processStep.process.client != null) {
            val flowType = processStep.process.flow.type.description
            val propertyDescription = processStep.process.property?.description?.let { ": $it" } ?: " de $flowType. "

            val messageClient =
                "Olá ${processStep.process.client.name},tivemos um probleminha no seu processo$propertyDescription 😐\nHouve uma pendência: ${processStep.getDescriptionStep()}$observationSuffix"
                    .plus("\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀")
                    .plus(messageLink)
                    .plus(getPathClient(processStep.process))
            sendForClient(processStep.process.client, messageClient)
        }

        if (processStep.process.property != null) {
            val messageProperty =
                "Olá ${processStep.process.property.ownerName},tivemos um probleminha no seu processo: ${processStep.process.property.description} 😐\nHouve uma pendência: ${processStep.getDescriptionStep()}$observationSuffix"
                    .plus("\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀")
                    .plus(messageLink)
                    .plus(getPathProperty(processStep.process))

            sendForProperty(processStep.process.property, messageProperty)
        }

        sendForUnforeseenSeller(processStep, observationSuffix)
    }

    private fun sendNewProcessForSeller(process: Process) {
        if (!process.flow.sendMessage) {
            return
        }

        val nameProperty = process.property?.description ?: "imóvel"
        val nameComprador = process.client?.name ?: "comprador"
        val nameVendedor = process.property?.ownerName ?: "vendedor"

        process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nPassando pra avisar que iniciamos o processo de compra e venda do imóvel *$nameProperty* com o comprador *$nameComprador* e vendedor *$nameVendedor*. Você receberá as novidades por aqui! 🏠🍀"
                        .plus(messageLink)
                        .plus("$linkFront/vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nPassando pra avisar que iniciamos o processo de compra e venda do imóvel *$nameProperty* com o comprador *$nameComprador* e vendedor *$nameVendedor*. Você receberá as novidades por aqui! 🏠🍀"
                        .plus(messageLink)
                        .plus("$linkFront/vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }
    }

    private fun sendForUnforeseenSeller(processStep: ProcessStep, observationSuffix: String = "") {
        if (!processStep.process.flow.sendMessage) {
            return
        }

        val nameProperty = processStep.process.property?.description ?: "imóvel"
        val nameComprador = processStep.process.client?.name ?: "comprador"
        val nameVendedor = processStep.process.property?.ownerName ?: "vendedor"
        val etapa = processStep.getDescriptionStep()

        processStep.process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nO imóvel *$nameProperty* do processo com o comprador *$nameComprador* e vendedor *$nameVendedor* teve uma pendência: *$etapa* 😐$observationSuffix\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀"
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        processStep.process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nO imóvel *$nameProperty* do processo com o comprador *$nameComprador* e vendedor *$nameVendedor* teve uma pendência: *$etapa* 😐$observationSuffix\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀"
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }
    }

    private fun sendForSeller(processStep: ProcessStep, observationSuffix: String = "") {
        if (!processStep.process.flow.sendMessage) {
            return
        }

        val nameProperty = processStep.process.property?.description ?: "imóvel"
        val nameComprador = processStep.process.client?.name ?: "comprador"
        val nameVendedor = processStep.process.property?.ownerName ?: "vendedor"
        val etapa = processStep.getDescriptionStep()

        processStep.process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nO imóvel *$nameProperty* do processo com o comprador *$nameComprador* e vendedor *$nameVendedor* está na etapa: *$etapa* 🏠$observationSuffix"
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        processStep.process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, tudo bem? 😊\nO imóvel *$nameProperty* do processo com o comprador *$nameComprador* e vendedor *$nameVendedor* está na etapa: *$etapa* 🏠$observationSuffix"
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }
    }

    private fun sendForProperty(destiny: Property, message: String) {
        messageService.sendMessage(
            MessageRequest(
                message = message,
                phone = destiny.phone.cleanPhoneNumber()
            )
        )

        destiny.phoneSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = message,
                    phone = destiny.phoneSecondary.cleanPhoneNumber()
                )
            )
        }
    }

    private fun sendForClient(destiny: Client, message: String) {
        messageService.sendMessage(
            MessageRequest(
                message = message,
                phone = destiny.phone.cleanPhoneNumber()
            )
        )

        destiny.phoneSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = message,
                    phone = destiny.phoneSecondary.cleanPhoneNumber()
                )
            )
        }
    }
}
