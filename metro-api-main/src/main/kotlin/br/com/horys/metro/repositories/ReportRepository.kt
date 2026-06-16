package br.com.horys.metro.repositories

import br.com.horys.metro.models.ReportActiveSold
import br.com.horys.metro.models.ReportFlow
import org.springframework.stereotype.Repository
import javax.persistence.EntityManager

@Repository
class ReportRepository(private val entityManager: EntityManager) {

    fun getReportFlows(): List<ReportFlow> {
        val createNativeQuery = entityManager.createNativeQuery(
            """ 
            select f.description , count(*) as amount from sale s 
            left join flows f on s.flow_id = f.id group by f.description, s.flow_id
        """.trimIndent(),
            "ReportFlow"
        )

        return createNativeQuery.resultList as List<ReportFlow>;
    }

    fun getQuantitativeProcessReport(): List<ReportFlow> {
        val creativeNativeQuery = entityManager.createNativeQuery(
            """
            select
	count(*) as amount,
	atrasadas.status as description
from
	(
	select
	case
			when (cast(to_char(now(), 'DD') as INTEGER) - cast(to_char(s.created_at, 'DD') as INTEGER)) > s2.deadline and s.status = 'ACTIVE' then 'Em Atraso'
			when (cast(to_char(now(), 'DD') as INTEGER) - cast(to_char(s.created_at, 'DD') as INTEGER)) <= s2.deadline and s.status = 'ACTIVE' then 'A Vencer'
            when s.status ='SOLD' then 'Concluído'
		end as status
	from
		sale s
	inner join step s2 on
		s.step_current_id = s2.id ) atrasadas

group by
	atrasadas.status
union all
    select
		count(*) quantidade,
        'Em Aberto'
    from
	sale s
    inner join step s2 on
	    s.step_current_id = s2.id
    where
	    s.status = 'ACTIVE'
        """.trimIndent(),
            "ReportFlow"
        )
        return creativeNativeQuery.resultList as List<ReportFlow>
    }

    fun getReportActiveAndSold(): List<ReportActiveSold> {
        val createNativeQuery = entityManager.createNativeQuery(
            """ 
            select
	count(*) as amount,
	s.status as description ,
	cast (s.created_at as date) as createdAt
from
	sale s
	where (s.status ='ACTIVE' or s.status ='SOLD')
group by
	s.status ,
	s.created_at 
        """.trimIndent(),
            "ReportActiveSold"
        )

        return createNativeQuery.resultList as List<ReportActiveSold>
    }


}