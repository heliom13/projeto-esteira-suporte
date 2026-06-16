package br.com.horys.metro

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@SpringBootApplication
@EnableFeignClients
class MetroApiApplication

fun main(args: Array<String>) {
    runApplication<MetroApiApplication>(*args)
}
