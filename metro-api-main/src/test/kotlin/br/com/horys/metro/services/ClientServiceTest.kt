package br.com.horys.metro.services

import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
internal class ClientServiceTest {
//    @Mock
//    private lateinit var repository: ClientRepository
//
//    @InjectMocks
//    private lateinit var service: ClientService
//
//    @Test
//    fun `should be create a valid client single`() {
//        val request = CreateClientRequest(
//            name = "name",
//            document = "123",
//            email = "email",
//            phone = "phon1",
//            address = "add",
//            job = "job",
//            emailOther = null,
//            maritalStatus = MaritalStatus.SINGLE,
//            birthday = "2020-01-01"
//        )
//
//        Mockito.`when`(repository.save(any()))
//            .thenReturn(
//                Client(
//                    name = "name",
//                    document = "123",
//                    email = "email",
//                    phone = "phon1",
//                    address = "add",
//                    job = "job",
//                    emailOther = null,
//                    maritalStatus = MaritalStatus.SINGLE,
//                    id = 1,
//                    birthday = LocalDate.now(),
//                    createdAt = LocalDateTime.now(),
//                    updatedAt = LocalDateTime.now()
//                )
//            )
//
//        val client = service.save(request, emptyList())
//
//        Assertions.assertThat(client)
//            .isNotNull
//
//        Assertions.assertThat(client.id).isNotNull
//    }
//
//    @Test
//    fun `should be create a valid client married`() {
//        val request = CreateClientRequest(
//            name = "name",
//            document = "123",
//            email = "email",
//            phone = "phon1",
//            address = "add",
//            job = "job",
//            emailOther = null,
//            maritalStatus = MaritalStatus.MARRIED,
//            birthday = "2020-01-01"
//        )
//
//        Mockito.`when`(repository.save(any()))
//            .thenReturn(
//                Client(
//                    name = "name",
//                    document = "123",
//                    email = "email",
//                    phone = "phon1",
//                    address = "add",
//                    job = "job",
//                    emailOther = null,
//                    maritalStatus = MaritalStatus.SINGLE,
//                    id = 1,
//                    birthday = LocalDate.now(),
//                    createdAt = LocalDateTime.now(),
//                    updatedAt = LocalDateTime.now()
//                )
//            )
//
//        val client = service.save(request, emptyList())
//
//        Assertions.assertThat(client)
//            .isNotNull
//
//        Assertions.assertThat(client.id).isNotNull
//    }
}
