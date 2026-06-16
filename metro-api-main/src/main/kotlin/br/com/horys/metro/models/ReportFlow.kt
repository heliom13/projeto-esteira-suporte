package br.com.horys.metro.models

import com.fasterxml.jackson.annotation.JsonInclude
import java.math.BigInteger
import javax.persistence.*

@SqlResultSetMapping(
    name = "ReportFlow",
    classes = [
        ConstructorResult(
            targetClass = ReportFlow::class,
            columns = arrayOf(
                ColumnResult(name = "description"),
                ColumnResult(name = "amount")
            )
        )
    ]
)
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
data class ReportFlow(
    @Id
    val id: Long? = null,
    val description: String,
    val amount: BigInteger
) {
    constructor(description: String, amount: BigInteger) : this(null, description, amount)
}
