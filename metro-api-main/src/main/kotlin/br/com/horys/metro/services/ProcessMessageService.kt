package br.com.horys.metro.services

import br.com.horys.metro.extensions.cleanPhoneNumber
import br.com.horys.metro.models.Client
import br.com.horys.metro.models.Process
import br.com.horys.metro.models.ProcessStep
import br.com.horys.metro.models.Property
import br.com.horys.metro.services.message.MessageRequest
import br.com.horys.metro.services.message.MessageService
import org.springframework.stereotype.Service

@Service
class ProcessMessageService(
    private val messageService: MessageService
) {
    companion object {
        const val linkFront = "https://sistema.suporteimobiliario.com/external"
        const val messageLink = " \nVocê pode acompanhar todo o seu processo por este link a seguir 👉 "
    }

    fun sendNewProcess(process: Process) {
        val nameProperty = process.property?.description
        val pathProperty = getPathProperty(process)
        val pathClient = getPathClient(process)


        if (process.client != null) {
            val beginMessageClient =
                """
                Olá, Somos a SUPORTE IMOBILIÁRIO, soluções em financiamentos e regularizações, é um prazer ter você aqui conosco! 

                Você iniciou um processo de compra e venda 🏠🔄. 

                Você receberá as novidades do seu financiamento através desse canal📲, Conte conosco😉
            """.trimIndent()

            sendForClient(process.client, beginMessageClient)

            val messageClient =
                "Olá ${process.client.name}, iniciamos o seu processo de compra do seu imóvel: $nameProperty 😀🍀".plus(
                    messageLink
                ).plus(pathClient)
            sendForClient(process.client, messageClient)
        }

        if (process.property != null) {
            val messageProperty =
                "Olá ${process.property.ownerName}, iniciamos o seu processo de venda do seu imóvel: $nameProperty 😉🍀".plus(
                    messageLink
                ).plus(pathProperty)
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
                "Olá ${process.client.name}, finalizamos o seu processo: ${process.property?.description} 😍\uD83E\uDEF6"
                    .plus("\nGostariamos de agradecer a confiança que nos foi depositada. Desejamos toda a felicidade e sucesso do mundo para você e sua família 💙💙")
                    .plus("\nEstaremos sempre a sua disposição para um proximo processo.")
            sendForClient(process.client, messageClient)
        }

        if (process.property != null) {
            val messageProperty =
                "Olá ${process.property.ownerName}, finalizamos o seu processo: ${process.property.description} 😍\uD83E\uDEF6"
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
        process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, finalizamos o seu processo: ${process.property?.description} 😍\uD83E\uDEF6"
                        .plus("\nGostariamos de agradecer a confiança que nos foi depositada ficamos muito felizes em participar e ajudar em seu processo")
                        .plus("\nConte sempre conosco! Sucesso e boas vendas!"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, finalizamos o seu processo: ${process.property?.description} 😍\uD83E\uDEF6"
                        .plus("\nGostariamos de agradecer a confiança que nos foi depositada ficamos muito felizes em participar e ajudar em seu processo")
                        .plus("\nConte sempre conosco! Sucesso e boas vendas!"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

    }

    private fun getPathClient(process: Process): String {
        return "$linkFront/cliente-comprador/${process.client?.externalId}"
    }

    private fun getPathProperty(process: Process): String {
        return "$linkFront/imovel/${process.property?.externalId}"
    }

    fun sendNextStepSale(processStep: ProcessStep) {
        if (!processStep.process.flow.sendMessage) {
            return
        }
        if (processStep.process.client != null) {

            val flowType = processStep.process.flow.type.description
            val propertyDescription = processStep.process.property?.description?.let { ": $it" } ?: " de $flowType. "
            val messageClient =
                "Olá ${processStep.process.client.name}, temos novidade sobre o seu processo$propertyDescription 🤩\nEle avançou para a etapa: ${processStep.getDescriptionStep()}"
                    .plus(messageLink)
                    .plus(getPathClient(processStep.process))

            sendForClient(processStep.process.client, messageClient)
        }

        if (processStep.process.property != null) {
            val messageProperty =
                "Olá ${processStep.process.property.ownerName}, temos novidade sobre o seu processo: ${processStep.process.property.description} 🤩\nEle avançou para a etapa: ${processStep.getDescriptionStep()}"
                    .plus(messageLink)
                    .plus(getPathProperty(processStep.process))

            sendForProperty(processStep.process.property, messageProperty)
        }

        sendForSeller(processStep)
    }

    fun sendNextStepUnforeseenSale(processStep: ProcessStep) {
        if (!processStep.process.flow.sendMessage) {
            return
        }
        if (processStep.process.client != null) {

            val flowType = processStep.process.flow.type.description
            val propertyDescription = processStep.process.property?.description?.let { ": $it" } ?: " de $flowType. "

            val messageClient =
                "Olá ${processStep.process.client.name},tivemos um probleminha no seu processo$propertyDescription 😐\nHouve uma pendência: ${processStep.getDescriptionStep()}"
                    .plus("\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀")
                    .plus(messageLink)
                    .plus(getPathClient(processStep.process))
            sendForClient(processStep.process.client, messageClient)
        }

        if (processStep.process.property != null) {
            val messageProperty =
                "Olá ${processStep.process.property.ownerName},tivemos um probleminha no seu processo: ${processStep.process.property.description} 😐\nHouve uma pendência: ${processStep.getDescriptionStep()}"
                    .plus("\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀")
                    .plus(messageLink)
                    .plus(getPathProperty(processStep.process))

            sendForProperty(processStep.process.property, messageProperty)
        }

        sendForUnforeseenSeller(processStep)
    }

    private fun sendNewProcessForSeller(process: Process) {
        if (!process.flow.sendMessage) {
            return
        }
        process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, iniciamos o processo de compra e venda do seu imóvel: ${process.property?.description} "
                        .plus(messageLink)
                        .plus("$linkFront/vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, iniciamos o processo de compra e venda do seu imóvel: ${process.property?.description} "
                        .plus(messageLink)
                        .plus("$linkFront/vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

    }

    private fun sendForUnforeseenSeller(processStep: ProcessStep) {
        if (!processStep.process.flow.sendMessage) {
            return
        }
        processStep.process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name},tivemos um probleminha no seu processo: ${processStep.process.property?.description} 😐. \nHouve uma pendência: ${processStep.getDescriptionStep()}"
                        .plus("\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀")
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        processStep.process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name},tivemos um probleminha no seu processo: ${processStep.process.property?.description} 😐. \nHouve uma pendência: ${processStep.getDescriptionStep()}"
                        .plus("\nMas não se preocupe, iremos resolver tudo. 😀🤝🍀")
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

    }

    private fun sendForSeller(processStep: ProcessStep) {
        if (!processStep.process.flow.sendMessage) {
            return
        }
        processStep.process.sellerMain?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name}, temos novidade sobre o seu processo: ${processStep.process.property?.description} 🤩\nEle avançou para a etapa: ${processStep.getDescriptionStep()}"
                        .plus(messageLink)
                        .plus("$linkFront/cliente-vendedor/${it.externalId}"),
                    phone = it.phone.cleanPhoneNumber()
                )
            )
        }

        processStep.process.sellerSecondary?.let {
            messageService.sendMessage(
                MessageRequest(
                    message = "Olá ${it.name},temos novidade sobre o seu processo: ${processStep.process.property?.description} 🤩\nEle avançou para a etapa: ${processStep.getDescriptionStep()}"
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