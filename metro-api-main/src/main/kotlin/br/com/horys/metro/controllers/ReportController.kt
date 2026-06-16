package br.com.horys.metro.controllers

import br.com.horys.metro.models.ReportActiveSold
import br.com.horys.metro.models.ReportFlow
import br.com.horys.metro.services.ReportService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/reports")
class ReportController(private val reportService: ReportService) {
    @GetMapping("/flows")
    fun getReportFlow(): List<ReportFlow> {
        return reportService.getReportFlows();
    }

    @GetMapping("/quantitatives")
    fun getQuantitativeProcessReport(): List<ReportFlow> {
        return reportService.getQuantitativeProcessReport();
    }

    @GetMapping("/process/days")
    fun getReportActiveAndSold(): List<ReportActiveSold> {
        return reportService.getReportActiveAndSold();
    }

}