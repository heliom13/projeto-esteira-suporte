package br.com.horys.metro.services

import br.com.horys.metro.exceptions.ReportNotFoundException
import br.com.horys.metro.models.ReportActiveSold
import br.com.horys.metro.models.ReportFlow
import br.com.horys.metro.repositories.ReportRepository
import org.springframework.stereotype.Service

@Service
class ReportService(private val reportRepository: ReportRepository) {

    fun getReportFlows(): List<ReportFlow> {
        val reportFlows = reportRepository.getReportFlows()
        if (reportFlows.isEmpty())
            throw ReportNotFoundException()
        return reportFlows
    }

    fun getQuantitativeProcessReport(): List<ReportFlow> {
        val reportFlows = reportRepository.getQuantitativeProcessReport()
        if (reportFlows.isEmpty())
            throw ReportNotFoundException()
        return reportFlows
    }

    fun getReportActiveAndSold(): List<ReportActiveSold> {
        val reportActiveSold = reportRepository.getReportActiveAndSold()
        if (reportActiveSold.isEmpty())
            throw ReportNotFoundException()
        return reportActiveSold
    }


}