package br.com.horys.metro.models

import br.com.horys.metro.models.enums.StatusEnum
import com.fasterxml.jackson.annotation.JsonInclude
import java.math.BigInteger
import java.time.LocalDate
import javax.persistence.ColumnResult
import javax.persistence.ConstructorResult
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.SqlResultSetMapping

@SqlResultSetMapping(
    name = "ReportActiveSold",
    classes = [
        ConstructorResult(
            targetClass = ReportActiveSold::class,
            columns = arrayOf(
                ColumnResult(name = "amount"),
                ColumnResult(name = "description"),
                ColumnResult(name = "createdAt", type = LocalDate::class)
            )
        )]
)
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
data class ReportActiveSold(
    val amount: BigInteger,
    val description: String,
    @Id val createdAt: LocalDate
) {

}



